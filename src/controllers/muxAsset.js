const Mux = require('@mux/mux-node');
import { muxInfo } from "../services/muxHelper";

import db from '../models';
const Asset = db.Asset;

const uploadAsset = async (req, res) => {
	const organization_id = req.user[0].dataValues.organization_id;
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	// More stuff here...
};

const createAsset = async (req, res) => {
	const {
		data
	} = req.body;

	const organization_id = req.user[0].dataValues.organization_id;
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(organization_id);

	const { Video } = new Mux(mux_accessToken, mux_secret);

	const asset = await Video.Assets.create(data);

	let newAsset = {
		asset_id: asset.id,
		organization_id
	};
	Asset.create(newAsset)
		.then(() => {
			res.send(asset);
		})
		.catch(err => {
			res.status(500).json({ err });
		});

};

const deleteAsset = async (req, res) => {
	const assetId = req.params.assetId;

	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	Asset.destroy({ where: { asset_id: assetId } })
		.then(async () => {
			const result = await Video.Assets.del(assetId);
			res.send(result);
		})
		.catch(() => res.status(500).json({ msg: 'Failed to delete!' }));
};

// Create playbackId for given assetId
const createAssetPlaybackId = async (req, res) => {
	const {
		visibility,
	} = req.body;
	const assetId = req.params.assetId;

	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const playbackId = await Video.Assets.createPlaybackId(assetId, { policy: visibility });
	res.send(playbackId);
};

// Delete playbackId
const deleteAssetPlaybackId = async (req, res) => {
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const assetId = req.params.assetId;
	const playbackId = req.params.playbackId;
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const result = await Video.Assets.deletePlaybackId(assetId, playbackId);
	res.send(result);
};

// Get all assets in user Organization
const getAssets = async (req, res) => {
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const assets = await Video.Assets.list();
	res.send(assets);
};

// Get all assets in Organization
const getAssetsInOrg = async (req, res) => {
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const assets = await Video.Assets.list({ limit: 100, page: 2 });
	res.send(assets);
};

// Get Asset by Id
const getAssetById = async (req, res) => {
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const assetId = req.params.assetId;
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const asset = await Video.Assets.get(assetId);
	res.send(asset);
};

// Get playbackId info
const getAssetPlaybackId = async (req, res) => {
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const assetId = req.params.assetId;
	const playbackId = req.params.playbackId;
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const playbackIdInfo = await Video.Assets.playbackId(assetId, playbackId);
	res.send(playbackIdInfo);
};

const enableMP4Support = async (req, res) => {
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const assetId = req.params.assetId;
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const Mp4Data = await Video.Assets.updateMp4Support(assetId, {mp4_support: "standard"});
	res.send(Mp4Data);
};


export {
	uploadAsset,
	createAsset,
	deleteAsset,
	createAssetPlaybackId,
	deleteAssetPlaybackId,
	getAssets,
	getAssetsInOrg,
	getAssetById,
	getAssetPlaybackId,
	enableMP4Support
};