import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import db from '../models';
const User = db.User;

// load input validation
import validateRegisterForm from '../validation/register';
import validateLoginForm from '../validation/login';

// create user
const create = (req, res) => {
	const { errors, isValid } = validateRegisterForm(req.body);
	let {
		firstname,
		lastname,
		username,
		role,
		email,
		password,
		organization_id,
	} = req.body;

	let avatar_src = '/images/default.png';
	// check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}

	User.findAll({ where: { email } }).then(user => {
		if (user.length) {
			return res.status(400).json({ email: 'Email already exists!' });
		} else {
			let newUser = {
				firstname,
				lastname,
				username,
				role,
				email,
				password,
				organization_id,
				avatar_src
			};
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					User.create(newUser)
						.then(user => {
							res.json({ user });
						})
						.catch(err => {
							res.status(500).json({ err });
						});
				});
			});
		}
	});
};

const login = (req, res) => {
	const { errors, isValid } = validateLoginForm(req.body);
	// check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}

	const { email, password } = req.body;

	User.findAll({
		where: {
			email
		}
	})
		.then(user => {

			//check for user
			if (!user.length) {
				errors.email = 'User not found!';
				return res.status(404).json(errors);
			}

			let originalPassword = user[0].dataValues.password;

			//check for password
			bcrypt
				.compare(password, originalPassword)
				.then(isMatch => {
					if (isMatch) {
						const { user_id, username, role } = user[0].dataValues;
						const payload = { user_id, username, role }; //jwt payload

						jwt.sign(payload, 'secret', {
							expiresIn: 3600
						}, (err, token) => {
							res.json({
								success: true,
								token: 'Bearer ' + token,
							});
						});
					} else {
						errors.password = 'Password not correct';
						return res.status(400).json(errors);
					}
				}).catch(err => console.log(err));
		}).catch(err => res.status(500).json({err}));
};

// fetch all users
const findAllUsers = (req, res) => {
	User.findAll()
		.then(users => {
			res.json({ users });
		})
		.catch(err => res.status(500).json({ err }));
};

// fetch all users in X organization
const findAllUsersInOrg = (req, res) => {
	const org_id = req.params.orgId;

	User.findAll({
		where: {
			organization_id: org_id
		}
	})
		.then(users => {
			res.json({ users });
		})
		.catch(err => res.status(500).json({ err }));
};

// fetch all users in Self organization
const findAllUsersSelf = (req, res) => {
	const organization_id = req.user[0].dataValues.organization_id;

	User.findAll({
		where: {
			organization_id
		}
	})
		.then(users => {
			res.json({ users });
		})
		.catch(err => res.status(500).json({ err }));
};

// fetch user info using jwt
const returnSelf = (req, res) => {
	const user = {
		user_id: req.user[0].dataValues.user_id,
		firstname: req.user[0].dataValues.firstname,
		lastname: req.user[0].dataValues.lastname,
		username: req.user[0].dataValues.username,
		email: req.user[0].dataValues.email,
		org_id: req.user[0].dataValues.organization_id,
		avatar_src: req.user[0].dataValues.avatar_src,
		role: req.user[0].dataValues.role,
	};

	res.json(user);
};

// update a user's info
const update = (req, res) => {
	let { firstname, lastname, role } = req.body;
	const user_id = req.params.userId;

	User.update(
		{
			firstname,
			lastname,
			role,
		},
		{ where: { user_id } }
	)
		.then(user => res.status(200).json({ user }))
		.catch(err => res.status(500).json({ err }));
};

// delete a user
const deleteUser = (req, res) => {
	const user_id = req.params.userId;

	User.destroy({ where: { user_id } })
		.then(() => res.status.json({ msg: 'User has been deleted successfully!' }))
		.catch(err => res.status(500).json({ msg: 'Failed to delete!' }));
};

const fs = require('fs');
import path from "path";

const avatar = (req, res) => {
	const old_file_name = req.user[0].dataValues.avatar_src;

	const user_id = req.user[0].dataValues.user_id;
	const avatar_src = `/images/${req.file.filename}`;
	User.update(
		{
			avatar_src
		},
		{ where: { user_id } }
	)
		.then(user => res.status(200).json({ user }))
		.catch(err => res.status(500).json({ err}));

	//Delete Old File
	fs.unlink(path.join(__dirname, "../multer", old_file_name), (err) => {
		if(err){
			console.error(err);
		}
	});
};

export {
	create,
	login,
	findAllUsers,
	findAllUsersInOrg,
	findAllUsersSelf,
	returnSelf,
	update,
	deleteUser,
	avatar
};