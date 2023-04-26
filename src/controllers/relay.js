const { exec } = require('child_process');
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
							env: [
								{
									name: 'RTMP_URL',
									value: destination_url,
								},
								{
									name: 'SRT_URL',
									value: `srt://:${port}`,
								},
							],
						},
					],
				},
			},
		},
	};

	const yamlStr = yaml.dump(manifest);
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

const deleteRelay = async (req, res) => {
	const relayName = req.params.relayName;
	Relay.destroy({ where: { name: relayName } })
		.then(() => {
			res.send({ msg: 'Deleted successfully!' });
		})
		.catch(() => res.status(500).json({ msg: 'Failed to delete!' }));
};


export {
	createRelay,
	getRelaysInOrg,
	deleteRelay
};