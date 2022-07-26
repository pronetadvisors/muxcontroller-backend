const Mux = require('@mux/mux-node');
import { muxInfo } from "../services/muxHelper";

import db from '../models';
const Asset = db.Asset;

const uploadAsset = async (req, res) => {
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	// More stuff here...
};

const createAsset = async (req, res) => {
	const {
		url,
		visibility
	} = req.body;
	
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const asset = await Video.Assets.create({
		input: url,
		"playback_policy": [
			visibility // Public or Private
		],
	});

	res.send(asset);
};

const deleteAsset = async (req, res) => {
	const assetId = req.params.assetId;

	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const result = await Video.Assets.del(assetId);
	res.send(result);
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

	const assets = Video.Assets.list({ limit: 100, page: 2 });
	res.send(assets);
};

// Get all assets in Organization
const getAssetsInOrg = async (req, res) => {
	const {
		mux_accessToken,
		mux_secret,
	} = await muxInfo(req.user[0].dataValues.organization_id);
	const { Video } = new Mux(mux_accessToken, mux_secret);

	const assets = Video.Assets.list({ limit: 100, page: 2 });
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


export {
	uploadAsset,
	createAsset,
	deleteAsset,
	createAssetPlaybackId,
	deleteAssetPlaybackId,
	getAssets,
	getAssetsInOrg,
	getAssetById,
	getAssetPlaybackId
};