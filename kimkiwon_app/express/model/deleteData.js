const database = require('./database')
const mysql = require('mysql')
const log = require('./etc/log')

exports.DeleteUser = async (user_index) => {
	query = `delete from user where user_index=${mysql.escape(user_index)}`
	const result = await database.addQuery(query)
	return result
}