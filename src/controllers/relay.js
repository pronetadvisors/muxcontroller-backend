const { exec } = require('child_process');

import db from '../models';
const Relay = db.Relay;


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
		const projectName = 'YOUR_PROJECT_NAME';
		const zone = 'YOUR_ZONE';
		const clusterName = 'YOUR_CLUSTER_NAME';

		// Configure kubectl to use the appropriate cluster
		exec(`gcloud container clusters get-credentials ${clusterName} --zone ${zone} --project ${projectName}`, (error) => {
			if (error) {
				console.error(error);
				res.status(500).json({ message: 'Error configuring kubectl', error: error.message });
			} else {
				// Run the kubectl create deployment command
				const imageName = 'raajpatel229/srt-to-rtmp:latest';
				exec(`kubectl create deployment ${name} --image=${imageName}`, (error, stdout, stderr) => {
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
	const relayId = req.params.relayId;
	Relay.destroy({ where: { relay_id: relayId } })
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