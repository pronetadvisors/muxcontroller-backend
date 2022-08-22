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
			res.send(upload.url);
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


export {
	createUpload,
	listUploads,
	deleteUpload,
};