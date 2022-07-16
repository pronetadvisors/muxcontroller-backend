import {getStreamsInOrg} from "../controllers/muxStream";

const passport = require("passport");
const { allowOnly } = require("../services/routesHelper");
const config = require("../config/config");
import {
	uploadAsset,
	createAsset,
	deleteAsset,
	createAssetPlaybackId,
	deleteAssetPlaybackId,
	getAssets,
	getAssetsInOrg,
	getAssetById,
	getAssetPlaybackId
} from '../controllers/muxAsset';

module.exports = (app) => {
	app.post(
		'/api/mux/assets/upload',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, uploadAsset)
	);

	app.post(
		'/api/mux/assets',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, createAsset)
	);

	app.delete(
		'/api/mux/assets/:assetId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, deleteAsset)
	);

	app.post(
		'/api/mux/assets/:assetId/playback',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, createAssetPlaybackId)
	);

	app.delete(
		'/api/mux/assets/:assetId/playback/:playbackId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, deleteAssetPlaybackId)
	);

	app.get(
		'/api/mux/assets',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getAssets)
	);

	app.get(
		'/api/mux/assets/org/:orgId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getAssetsInOrg)
	);

	app.get(
		'/api/mux/assets/:assetId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getAssetById)
	);

	app.get(
		'/api/mux/assets/:assetId/playback/:playbackId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getAssetPlaybackId)
	);
};