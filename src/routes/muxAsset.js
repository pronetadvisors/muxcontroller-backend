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
	getAssetPlaybackId,
	enableMP4Support,
	resync
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
		allowOnly(config.accessLevels.user, createAsset)
	);

	app.delete(
		'/api/mux/assets/:assetId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, deleteAsset)
	);

	app.post(
		'/api/mux/assets/playback/:assetId',
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
		allowOnly(config.accessLevels.user, getAssets)
	);

	app.get(
		'/api/mux/assets/org/:orgId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getAssetsInOrg)
	);

	app.get(
		'/api/mux/asset/:assetId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getAssetById)
	);

	app.get(
		'/api/mux/assets/:assetId/playback/:playbackId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getAssetPlaybackId)
	);

	app.post(
		'/api/mux/assets/:assetId/mp4support',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, enableMP4Support)
	);

	app.get(
		'/api/mux/assets/sync',
		// passport.authenticate('jwt', { session: false }),
		resync
	);
};