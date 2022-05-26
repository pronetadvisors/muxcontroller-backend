import passport from 'passport';
import config from '../config/config';
import { allowOnly } from '../services/routesHelper';
import { create, findAllUsers, findAllOrganizations,
	findById, update, deleteOrganization
} from '../controllers/organization';

module.exports = (app) => {
	// create a new user
	app.post(
		'/api/organizations/create',
		passport.authenticate('jwt', { session: false }),
		allowOnly(config.accessLevels.admin, create)
	);

	//retrieve all users belonging to organization Id
	app.get(
		'/api/organizations/users/:Id',
		passport.authenticate('jwt', {
			session: false
		}),
		allowOnly(config.accessLevels.admin, findAllUsers)
	);

	//retrieve all Organizations
	app.get(
		'/api/organizations',
		passport.authenticate('jwt', {
			session: false
		}),
		allowOnly(config.accessLevels.admin, findAllOrganizations)
	);

	// retrieve organization by id
	app.get(
		'/api/organizations/:Id',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.admin, findById)
	);

	// update an organization with id
	app.put(
		'/api/organizations/:Id',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.user, update)
	);

	// delete a user
	app.delete(
		'/api/organizations/:Id',
		passport.authenticate('jwt', {
			session: false,
		}),
		allowOnly(config.accessLevels.admin, deleteOrganization)
	);

};