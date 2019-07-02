const database = require('./databaseModel');
const mysql = require('mysql');

exports.getUserData = async () => {
	const query = `select * from user`;
	const result = await database.getQuery(query);
	return result;
}

exports.getUserDataByAuthenticationInfo = async (user_id, user_password) => {
	const query = `select * from user where (user_id = ${mysql.escape(user_id)} and user_password = ${mysql.escape(user_password)})`;
	const result = await database.getQuery(query);
	return result;
}

exports.getUserDataByUserNameUserPhonenumber = async (user_name, user_phonenumber) => {
	const query = `select * from user where (user_name = ${mysql.escape(user_name)} and user_phonenumber = ${mysql.escape(user_phonenumber)})`;
	const result = await database.getQuery(query);
	return result;
}

exports.addUser = async (user_name, school_name, user_phonenumber, user_authority, user_graduation, user_year, user_desc, user_date) => {
	const query = `insert into user 
				(user_name,
				school_name,
				user_phonenumber,
				user_authority,
				user_graduation,
				user_year,
				user_id,
				user_password,
				user_desc,
				user_date
				) values 
				(${mysql.escape(user_name)},
				${mysql.escape(school_name)},
				${mysql.escape(user_phonenumber)},
				${mysql.escape(user_authority)},
				${mysql.escape(user_graduation)},
				${mysql.escape(user_year)},
				${mysql.escape(user_name)},
				${mysql.escape(user_phonenumber)},
				${mysql.escape(user_desc)},
				${mysql.escape(user_date)})`;

	const result = await database.addQuery(query);

	return result;
}

exports.getUserDataByUserYear = async (user_year) => {
	const query = `select * from user where (user_year = ${mysql.escape(user_year)} or not (user_authority = 4))`;
	const result = await database.getQuery(query);
	return result;
}

exports.getUserDataByUserYearUserAuth = async (user_year, user_auth) => {
	const query = `select * from user where user_year = ${mysql.escape(user_year)} and user_authority = ${mysql.escape(user_auth)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getUserDataByUserIndex = async (user_index) => {
	const query = `select * from user where user_index = ${mysql.escape(user_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getMentorData = async () => {
	const query = `select * from user where user_authority = 3`;
	const result = await database.getQuery(query);
	return result;
}

exports.updateUserDataByUserIndex = async (user_index, school_name, user_authority, user_graduation, user_year, user_desc) => {
	const query = `update user set 
				school_name = ${mysql.escape(school_name)},
				user_authority = ${mysql.escape(user_authority)},
				user_graduation = ${mysql.escape(user_graduation)},
				user_year = ${mysql.escape(user_year)},
				user_desc = ${mysql.escape(user_desc)} 
				where user_index = ${mysql.escape(user_index)}`;
	const result = await database.updateQuery(query);
	return result;
}

exports.updateUserDataByUserIndex2 = async (user_index, user_name, school_name, user_phonenumber, user_authority, user_graduation, user_year, user_desc, acceptance_index_1, acceptance_index_2, acceptance_index_3) => {
	const query = `update user set 
				user_name = ${mysql.escape(user_name)}, 
				school_name = ${mysql.escape(school_name)},
				user_phonenumber = ${mysql.escape(user_phonenumber)},
				user_authority = ${mysql.escape(user_authority)},
				user_graduation = ${mysql.escape(user_graduation)},
				user_year = ${mysql.escape(user_year)},
				user_desc = ${mysql.escape(user_desc)},
				acceptance_index_1 = ${mysql.escape(acceptance_index_1)},
				acceptance_index_2 = ${mysql.escape(acceptance_index_2)},
				acceptance_index_3 = ${mysql.escape(acceptance_index_3)} 
				where user_index = ${mysql.escape(user_index)}`;
	const result = await database.updateQuery(query);
	return result;
}

exports.deleteUser = async (user_index) => {
	const query = `delete from user where user_index = ${mysql.escape(user_index)}`;
	const result = await database.updateQuery(query);
	return result;
}