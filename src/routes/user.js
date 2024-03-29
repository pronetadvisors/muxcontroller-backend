import passport from 'passport';
import config from '../config/config';
import { allowOnly } from '../services/routesHelper';
import { create, login, findAllUsers, findAllUsersInOrg, findAllUsersSelf, returnSelf, update, deleteUser, avatar } from '../controllers/user';
import { upload } from '../multer/index';


module.exports = (app) => {
	// create a new user from admin
	app.post(
		'/api/users',
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
		allowOnly(config.accessLevels.admin, findAllUsersInOrg)
	);

	//retrieve all users in own organization
	app.get('/api/usersSelf',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.user, findAllUsersSelf)
	);

	// retrieve user by JWT
	app.get(
		'/api/user',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.user, returnSelf)
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

	// update users avatar_src
	app.post(
		'/api/users/avatar',
		[
			passport.authenticate('jwt', {
				session: false,
			}),
			upload.single('image')
		],
		allowOnly(config.accessLevels.user, avatar)
	);

};