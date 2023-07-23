import db from '../models';
const Organization = db.Organization;
const User = db.User;

// load input validation
import validateCreateOrganizationForm from '../validation/createOrganization';

// create organization
const create = (req, res) => {
	const { errors, isValid } = validateCreateOrganizationForm(req.body);
	let {
		name,
		email,
		mux_accessToken,
		mux_secret,
	} = req.body;

	// check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}

	Organization.findAll({ where: { email } }).then(organization => {
		if (organization.length) {
			return res.status(400).json({ msg: 'Email already exists!' });
		} else {
			let newOrganization = {
				name,
				email,
				mux_accessToken,
				mux_secret,
			};
			Organization.create(newOrganization)
				.then(organization => {
					res.json({ organization });
				})
				.catch(err => {
					res.status(500).json({ err });
				});
		}
	});
};

// fetch all organizations
const findAllOrganizations = (req, res) => {
	Organization.findAll()
		.then(organization => {
			res.json({ organization });
		})
		.catch(err => res.status(500).json({ err }));
};

// fetch organization by ID
const findById = (req, res) => {
	const id = req.params.organizationId;

	Organization.findAll({ where: { id } })
		.then(organization => {
			if(!organization.length) {
				return res.json({ msg: 'Organization not found'});
			}
			res.json({ organization });
		})
		.catch(err => res.status(500).json({ err }));
};

// update an organization's info
const update = (req, res) => {
	let { name, email, mux_accessToken, mux_secret } = req.body;
	const id = req.params.Id;

	Organization.update(
		{
			name,
			email,
			mux_accessToken,
			mux_secret,
		},
		{ where: { id } }
	)
		.then(org => res.status(200).json({ org }))
		.catch(err => res.status(500).json({ err }));
};

// delete an organization
const deleteOrganization = (req, res) => {
	const id = req.params.Id;

	Organization.destroy({ where: { id } })
		.then(() => {
			User.destroy({ where: { organizationId: id } })
				.then(() => {
					res.status(200).json({ msg: 'Organization has been deleted successfully!' });
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({msg: 'Failed to delete!'});
				});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({msg: 'Failed to delete!'});
		});
};

export {
	create,
	findAllOrganizations,
	findById,
	update,
	deleteOrganization
};