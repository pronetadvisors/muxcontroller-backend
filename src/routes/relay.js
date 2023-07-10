import {getStreamsInOrg} from "../controllers/muxStream";

const passport = require("passport");
const { allowOnly } = require("../services/routesHelper");
const config = require("../config/config");
import {
	createRelay,
	deleteRelay,
	getRelaysInOrg,
	getRelayExpose,
	getRelaysByOrgId
} from '../controllers/relay';


module.exports = (app) => {
	app.post(
		'/api/relay',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, createRelay)
	);

	app.delete(
		'/api/relay/:relayName',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, deleteRelay)
	);

	app.get(
		'/api/relays',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, getRelaysInOrg)
	);

	app.get(
		'/api/relays/org/:orgId',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, getRelaysByOrgId)
	);

	app.get(
		'/api/relay_ep/:relayName',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, getRelayExpose)
	);
};