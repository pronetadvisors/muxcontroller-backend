import passport from 'passport';
import config from '../config/config';
import { allowOnly } from '../services/routesHelper';
import { create, login, findAllUsers, findAllUsersInOrg, returnSelf, update, deleteUser } from '../controllers/user';

module.exports = (app) => {
	// create a new user
	app.post(
		'/api/users/create',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, create)
	);

	// user login
	app.post('/api/users/login', login);

	//retrieve all users
	app.get(
		'/api/users',
		passport.authenticate('jwt', {
			session: false
		}),
		allowOnly(config.accessLevels.admin, findAllUsers)
	);

	//retrieve all users belonging to organization
	app.get('/api/users/:orgId',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.user, findAllUsersInOrg)
	);

	// retrieve user by JWT
	app.get(
		'/api/user',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.admin, returnSelf)
	);

	// update a user with id
	app.put(
		'/api/users/:userId',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.user, update)
	);

	// delete a user
	app.delete(
		'/api/users/:userId',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.admin, deleteUser)
	);

};