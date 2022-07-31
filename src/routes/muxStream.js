const passport = require("passport");
const { allowOnly } = require("../services/routesHelper");
const config = require("../config/config");
import {
	createStream,
	deleteStream,
	createStreamPlaybackId,
	deleteStreamPlaybackId,
	getStreams,
	getStreamsInOrg,
	getStreamById,
	resetStreamKey,
	enableStream,
	disableStream,
	completeStream
} from '../controllers/muxStream';


module.exports = (app) => {

	app.post(
		'/api/mux/streams',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, createStream)
	);

	app.delete(
		'/api/mux/streams/:streamId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, deleteStream)
	);

	app.post(
		'/api/mux/streams/:streamId/playback',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, createStreamPlaybackId)
	);

	app.delete(
		'/api/mux/streams/:streamId/playback/:playbackId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, deleteStreamPlaybackId)
	);

	app.get(
		'/api/mux/streams',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, getStreams)
	);

	app.get(
		'/api/mux/streams/org/:orgId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getStreamsInOrg)
	);

	app.get(
		'/api/mux/streams/:streamId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, getStreamById)
	);

	app.post(
		'/api/mux/streams/reset/:streamId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, resetStreamKey)
	);

	app.post(
		'/api/mux/streams/enable/:streamId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, enableStream)
	);

	app.post(
		'/api/mux/streams/disable/:streamId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, disableStream)
	);

	app.post(
		'/api/mux/streams/complete/:streamId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, completeStream)
	);
};