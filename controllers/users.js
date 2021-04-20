
const User = require('../models/user'); // require user model
const bcrypt = require('bcrypt'); // require bcrypt module
const SALT_ROUNDS = 10; // the salt round we'll use



function newUser(req, res) {
	res.render('auth/new');
}

function signUp(req, res) {
	req.body.password = bcrypt.hashSync(
		req.body.password,
		bcrypt.genSaltSync(10)
	);
	User.create(req.body, function (error, newUser) {
		res.redirect('/');
	});
}

function signIn(req, res) {
	res.render('users/login');
}

function login(req, res) {
	User.findOne(
		{
			username: req.body.username,
		},
		function (error, foundUser) {
			if (foundUser === null) {
				res.redirect('/users/signin');
			} else {
				const doesPasswordMatch = bcrypt.compareSync(
					req.body.password,
					foundUser.password
				);
				if (doesPasswordMatch) {
					req.session.userId = foundUser._id; // new code right here
					console.log(req.session); // we can also log out the session to see the results
					res.redirect('/');
				} else {
					res.redirect('/users/signin');
				}
			}
		}
	);
}


module.exports = {
	new: newUser,
	signUp,
	signIn,
	login
};