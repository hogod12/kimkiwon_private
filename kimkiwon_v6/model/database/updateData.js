const database = require('./connectDatabase')
const logger = require('../etc/logging')
const mysql = require('mysql')

exports.updateUser = async (user_index, user_school, user_phonenumber, user_authority, user_password) => {
	const query = `update user set
				user_school=${mysql.escape(user_school)},
				user_phonenumber=${mysql.escape(user_phonenumber)},
				user_authority=${mysql.escape(user_authority)},
				user_password=${mysql.escape(user_password)}
				where user_index=${user_index}`

	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.addQuery(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.updateExam = async (req, res) => {
	
}

exports.updateExamStat = async (exam_index, exam_result_people, exam_result_avg, exam_result_std, exam_result_distribution) => {
	const query = `update exam set
				exam_result_people=${mysql.escape(exam_result_people)},
				exam_result_avg=${mysql.escape(exam_result_avg)},
				exam_result_std=${mysql.escape(exam_result_std)},
				exam_result_distribution=${mysql.escape(JSON.stringify(exam_result_distribution))}
				where exam_index=${mysql.escape(exam_index)}`

	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.addQuery(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.updateResultStat = async (result_index, result_sum, result_std, result_rank) => {
	const query = `update result set
				result_sum=${mysql.escape(result_sum)},
				result_std=${mysql.escape(result_std)},
				result_rank=${mysql.escape(result_rank)}
				where result_index=${mysql.escape(result_index)}`

	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.addQuery(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.updateResult = async (result_index, result_score) => {
	const query = `update result set
				result_score=${mysql.escape(JSON.stringify(result_score))}
				where result_index=${mysql.escape(result_index)}`

	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}