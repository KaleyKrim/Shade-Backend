import * as express from "express";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";

const saltRounds = 12;
const router = express.Router();
const sendmail = require('../config/mailer.js');

import { User } from "../models";

router.post('/login', passport.authenticate('local'), (req, res) => {
	return res.json({
		id: req.user.id,
		username: req.user.username,
		success: true
	});
});

router.get('/logout', (req, res) => {
	req.logout();
	res.sendStatus(200);
});

// register new user
router.post('/register', async (req, res) => {
	const { email, username } = req.body;

	let user;
	try {
		user = await User.findOne({
			where: { $or: [{ username }, { email: username }] },
			attributes: { exclude: ["password"] },
		});
	} catch (e) {
		return res.json({
			error: "failed to query user",
		});
	}

	if (user) {
		return res.json({
			error: "username/email already in use",
		});
	}

	const salt = bcrypt.genSalt(saltRounds);
	const hash = bcrypt.hash(req.body.password, salt);

	try {
		const newUser = await User.create({
			username,
			email,
			password: hash,
		});

		return res.json({
			username: newUser.username,
			password: newUser.password,
			email: newUser.email,
			success: true
		});
	} catch (e) {
		return res.json({
			error: "user creation failed",
		});
	}
});

//FORGOT password
router.post('/forgot', (req, res) => {
	let user;
	try {
		user = await User.findOne({ where: { email: req.body.email } });
	} catch (e) {
		return res.json({
			error: "user doesn't exist",
		});
	}

	const buffer = crypto.randomBytes(20);
	const token = buffer.toString("hex");
	const client = nodemailer.createTransport({
		service: "SendGrid",
		auth: {
			user: sendmail.user,
			pass: sendmail.pass,
		}
	});
	const email = {
		to: req.body.email, // sends email to data input
		from: 'passwordreset@shadetheapp.com', //from us
		subject: 'Shade. Mobile App Password Reset',
		text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		"It's no big deal, you forgot your password. Happens all the time, really.\n\n" +
		'Please click on the following link, or paste this into your browser:\n\n' +
		'http://' + req.headers.host + '/reset/' + token + '\n\n' + // this link be from server side, req.headers.host can be our website html
		'If you did not request this, someone forgot a lot more than their password! \n\n' +
		'Simply ignore this email and your password will remain unchanged.\n'
	}; // ^^ rewrite the "text" and make it more specific // customized

	try {
		await client.sendMail(email);
		req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
	} catch (e) {
		console.log(e);
	}

	try {
		await user.update({ // sends the token + expiration date to the user DB
			resetPasswordToken: token,
			resetPasswordExpires: Date.now() + 3600000 // 1 hour
		});
	} catch (e) {
		return res.json({
			error: "failed to update user password",
		});
	}
});

router.put('/reset/:token', (req, res) => {
  return User.findOne({
    where : { resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()} }
  })
  .then(user => { // find the user who has the resetPasswordToken attached to them & whose token hasn't expired.
    if (!user) { // if there is no user, return error and redirect to /forgot
      //req.flash('error', 'Password reset token is invalid or has expired.');
    return console.log("error");
    }
    else {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          user.update({
            resetPasswordToken: null,
            resetPasswordExpires: null,
            password: hash
          })
          .then(newPassword => {
            return res.json({
              success : true
            });
          });
        });
      });
    }
  })
  .catch((err) => {
    return res.json({
      error : 'Oh no! Something went wrong!'
    });
  });
});
