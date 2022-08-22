const passport = require("passport");
const { allowOnly } = require("../services/routesHelper");
const config = require("../config/config");
import {
	createUpload,
	listUploads,
	deleteUpload,
	assetCreated,
} from '../controllers/muxUpload';

module.exports = (app) => {
	app.post(
		'/api/mux/upload',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, createUpload)
	);

	app.get(
		'/api/mux/uploads',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, listUploads)
	);

	app.delete(
		'/api/mux/upload/:uploadId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, deleteUpload)
	);

	app.get(
		'/api/mux/upload/:uploadId/update',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, assetCreated)
	);

};