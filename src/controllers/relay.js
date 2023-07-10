const { exec } = require('child_process');
const { promisify } = require('util');
const execP = promisify(require('child_process').exec);
const yaml = require('js-yaml');
const fs = require('fs');

import db from '../models';
const Relay = db.Relay;


async function createTempManifestFile(name, imageName, destination_url, port) {
	const manifest = {
		apiVersion: 'apps/v1',
		kind: 'Deployment',
		metadata: {
			name: name,
		},
		spec: {
			selector: {
				matchLabels: {
					app: name,
				},
			},
			template: {
				metadata: {
					labels: {
						app: name,
					},
				},
				spec: {
					containers: [
						{
							name: 'srt-relay',
							image: imageName,
							ports: [
								{
									name: 'srt-tcp',
									containerPort: parseInt(port),
									protocol: 'TCP',
								},
								{
									name: 'srt-udp',
									containerPort: parseInt(port),
									protocol: 'UDP',
								},
							],
							env: [
								{
									name: 'RTMP_URL',
									value: destination_url,
								},
								{
									name: 'PORT',
									value: `${port}`,
								},
							],
							resources: {
								requests: {
									cpu: '200m', // Request 200 millicores (0.2 core)
									memory: '128Mi', // Request 128 MiB
								},
								limits: {
									cpu: '500m', // Limit to 500 millicores (0.5 core)
									memory: '256Mi', // Limit to 256 MiB
								},
							},
						},
					],
				},
			},
		},
	};

	const tcpService = {
		apiVersion: 'v1',
		kind: 'Service',
		metadata: {
			name: `${name}-tcp-service`,
		},
		spec: {
			selector: {
				app: name,
			},
			ports: [
				{
					name: 'srt-tcp',
					protocol: 'TCP',
					port: parseInt(port),
					targetPort: parseInt(port),
				},
			],
			type: 'LoadBalancer',
			loadBalancerIP: '34.172.5.27', // Your reserved static IP for TCP
		},
	};

	const udpService = {
		apiVersion: 'v1',
		kind: 'Service',
		metadata: {
			name: `${name}-udp-service`,
		},
		spec: {
			selector: {
				app: name,
			},
			ports: [
				{
					name: 'srt-udp',
					protocol: 'UDP',
					port: parseInt(port),
					targetPort: parseInt(port),
				},
			],
			type: 'LoadBalancer',
			loadBalancerIP: '34.172.5.27', // Your reserved static IP for UDP
		},
	};

	const deploymentYaml = yaml.dump(manifest);
	const tcpServiceYaml = yaml.dump(tcpService);
	const udpServiceYaml = yaml.dump(udpService);
	const yamlStr = `${deploymentYaml}---\n${tcpServiceYaml}---\n${udpServiceYaml}`;
	const tempFilePath = `/tmp/${name}_manifest.yaml`;
	fs.writeFileSync(tempFilePath, yamlStr);
	return tempFilePath;
}

const createRelay = async (req, res) => {
	const organization_id = req.user[0].dataValues.organization_id;
	const {
		name,
		port,
		stream_name,
		destination_url
	} = req.body;

	// Create Relay in GCP
	try {
		const projectName = 'noc4-relays';
		const zone = 'us-central1';
		const clusterName = 'srt-relay-cluster';
		const imageName = 'raajpatel229/srt-to-rtmp:latest';

		const tempManifestFile = await createTempManifestFile(name, imageName, destination_url, port);

		// Configure kubectl to use the appropriate cluster
		exec(`gcloud container clusters get-credentials ${clusterName} --zone ${zone} --project ${projectName}`, (error) => {
			if (error) {
				console.error(error);
				res.status(500).json({ message: 'Error configuring kubectl', error: error.message });
			} else {
				// Run the kubectl create deployment command
				exec(`kubectl apply -f ${tempManifestFile}`, (error) => {
					if (error) {
						console.error(error);
						res.status(500).json({ message: 'Error creating deployment', error: error.message });
					} else {
						// Create Relay in DB
						const newRelay = {
							name,
							port,
							stream_name,
							destination_url,
							organization_id
						};
						Relay.create(newRelay)
							.then(() => {
								res.send(newRelay);
							})
							.catch(err => {
								res.status(500).json({ err });
							});
					}
				});
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error creating deployment', error: error.message });
	}
};

const getRelaysInOrg = async (req, res) => {
	const organization_id = req.user[0].dataValues.organization_id;
	Relay.findAll({ where: { organization_id } })
		.then(relays => {
			res.send(relays);
		})
		.catch(err => {
			res.status(500).json({ err });
		});
};

const getRelaysByOrgId = async (req, res) => {
	const org_id = req.params.org_id;
	Relay.findAll({ where: { organization_id: org_id } })
		.then(relays => {
			res.send(relays);
		})
		.catch(err => {
			res.status(500).json({ err });
		});
};

const deleteRelay = async (req, res) => {
	const relayName = req.params.relayName;

	const projectName = 'noc4-relays';
	const zone = 'us-central1';
	const clusterName = 'srt-relay-cluster';

	try {
		// Configure kubectl to use the appropriate cluster
		await execP(`gcloud container clusters get-credentials ${clusterName} --zone ${zone} --project ${projectName}`);

		// Delete the deployment
		await execP(`kubectl delete deployment ${relayName}`);

		// Delete the services
		await execP(`kubectl delete service ${relayName}-tcp-service`);
		await execP(`kubectl delete service ${relayName}-udp-service`);

		// Delete Relay in DB
		Relay.destroy({ where: { name: relayName } })
			.then(() => {
				res.send({ msg: 'Deleted successfully!' });
			})
			.catch(() => res.status(500).json({ msg: 'Failed to delete!' }));

	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error deleting deployment and services', error: error.message});
	}
};

async function getServiceInfo(projectName, zone, clusterName, serviceName) {
	try {
		// Configure kubectl to use the appropriate cluster
		await execP(`gcloud container clusters get-credentials ${clusterName} --zone ${zone} --project ${projectName}`);

		// Get the service details
		const { stdout } = await execP(`kubectl get service ${serviceName} -o json`);
		const serviceInfo = JSON.parse(stdout);

		// Extract the IP and port
		const ip = serviceInfo.status.loadBalancer.ingress[0].ip;
		// const port = serviceInfo.spec.ports[0].port;

		return { ip };
	} catch (error) {
		console.error(error);
		throw new Error('Error getting service information');
	}
}

const getRelayExpose = async (req, res) => {
	const projectName = 'noc4-relays';
	const zone = 'us-central1';
	const clusterName = 'srt-relay-cluster';
	const serviceName = req.params.relayName + '-tcp-service';

	try {
		const serviceInfo = await getServiceInfo(projectName, zone, clusterName, serviceName);
		res.json(serviceInfo);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


export {
	createRelay,
	getRelaysInOrg,
	deleteRelay,
	getRelayExpose,
	getRelaysByOrgId
};