const viewController = require('../controller/viewController');

const userDataModel = require('../model/userDataModel');

// We Check User's "Token" and Take Him to propper Area
exports.Entrance = async (req, res) => {
	console.log("Entrance");
	console.log(req.session);

	if (req.session == undefined) {
		// non-authority
		res.redirect('/loginpage')
	}
	else {
		var session_user_index = req.session.user_index;
		var session_user_authority = req.session.user_authority;

		if (session_user_authority == 1) {
			// admin
			res.redirect('/admin');
		} 
		else if (session_user_authority == 2) {
			// teacher
			res.redirect("/teacher");
		}
		else if (session_user_authority == 3) {
			// mentor
			res.redirect('/mentor');
		}
		else if (session_user_authority == 4) {
			// student
			res.redirect("/student");
		}
		else {
			// exception
			res.redirect('/loginpage');
		}
	}
}

// User Get Authority We Call it "Token"
exports.GiveToken = async (req, res) => {
	console.log("GiveToken");

	var input_user_id = req.body.user_id;
	var input_user_password = req.body.user_password;

	var matched_user = await userDataModel.getUserDataByAuthenticationInfo(input_user_id, input_user_password);

	if (matched_user.length == 0) {
		// No user that matched with input information
		console.log("! No User Matched");
	}
	else if (matched_user.length == 1) {
		// find only-one user that matched with input informationx
		// Expected Process
		console.log("Find only 1 User")

		var sess = req.session;

		sess.user_index = matched_user[0]["user_index"];
		sess.user_authority = matched_user[0]["user_authority"];

		// Temp@
		console.log(sess.user_index);

		res.redirect('/');
	}
	else {
		// find users that matched with input information
		// ! Critical Bug - GiveToken and Database should Fixed
		console.log("Find Many User");
	}
}

// User Return Authority By Return "Token"
// Without "Token" User Cannot use our service
// And We also take him to non-athority user area 
exports.CollectToken = async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect('/');
		}
	})
}