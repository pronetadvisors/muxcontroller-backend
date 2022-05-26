import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

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
    } = req.body;

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

            let originalPassword = user[0].dataValues.password

            //check for password
            bcrypt
                .compare(password, originalPassword)
                .then(isMatch => {
                    if (isMatch) {
                        // user matched
                        console.log('matched!')
                        const { user_id, username } = user[0].dataValues;
                        const payload = { user_id, username }; //jwt payload
                        // console.log(payload)
                        // console.log(payload)

                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                                role: user[0].dataValues.role
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
        .then(user => {
            res.json({ user });
        })
        .catch(err => res.status(500).json({ err }));
};

// fetch user by userId
const findById = (req, res) => {
    const user_id = req.params.userId;

    User.findAll({ where: { user_id } })
        .then(user => {
            if(!user.length) {
                return res.json({ msg: 'user not found'})
            }
            res.json({ user })
        })
        .catch(err => res.status(500).json({ err }));
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

export {
    create,
    login,
    findAllUsers,
    findById,
    update,
    deleteUser
}