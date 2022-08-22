const Mux = require('@mux/mux-node');
import { muxInfo } from "../services/muxHelper";

import db from '../models';
const Asset = db.Asset;

const createUpload = async (req, res) => {
	const {
		name,
		data
	} = req.body;

	const organization_id = req.user[0].dataValues.organization_id;
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const upload = await Video.Uploads.create(data);

	let newAsset = {
		name,
		asset_id: upload.id,
		organization_id
	};
	Asset.create(newAsset)
		.then(() => {
			upload.name = name;
			res.send(upload);
		})
		.catch(err => {
			res.status(500).json({ err });
		});

};

const listUploads = async (req, res) => {
	const organization_id = req.user[0].dataValues.organization_id;
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(organization_id);

	const { Video } = new Mux(mux_accessToken, mux_secret);

	const list = await Video.Uploads.list();
	res.send(list);
};

const deleteUpload = async (req, res) => {
	const organization_id = req.user[0].dataValues.organization_id;
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(organization_id);

	const { Video } = new Mux(mux_accessToken, mux_secret);

	const cancel = await Video.Uploads.cancel(req.params.uploadId);
	res.send(cancel);
};

const assetCreated = async (req, res) => {
	console.log("*** ASSET CREATED ***");
	const organization_id = req.user[0].dataValues.organization_id;
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(organization_id);

	const { Video } = new Mux(mux_accessToken, mux_secret);

	console.log(req.params.uploadId);
	// Video.Uploads.get(req.params.uploadId)
	// 	.then(result => {
	// 		console.log(result);
	// 		res.send(result);
	// 	})
	// 	.catch(err => {
	// 		console.log(err);
	// 		res.status(500).send(err);
	// 	});
	const asset = await Video.Uploads.get(req.params.uploadId);
	console.log("*** ASSET CREATED - 1 ***");
	Asset.update(
		{ asset_id: asset.asset_id },
		{ where: { asset_id: asset.id }}
	)
		.then(res => res.status(200).json({ res }))
		.catch(err => res.status(500).json({ err }));
};


export {
	createUpload,
	listUploads,
	deleteUpload,
	assetCreated,
};