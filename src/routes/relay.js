const passport = require("passport");
const { allowOnly } = require("../services/routesHelper");
const config = require("../config/config");
import {
	createRelay,
	deleteRelay,
	getRelaysInOrg
} from '../controllers/relay';


module.exports = (app) => {
	app.post(
		'/api/relay',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, createRelay)
	);

	app.delete(
		'/api/relay',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, deleteRelay)
	);

	app.get(
		'/api/relays',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.user, getRelaysInOrg)
	);
};