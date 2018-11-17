const database = require('./dbController')
const logger = require('./writeLog')
const mysql = require('mysql')

exports.addCompany = async (company_name) => {
	const query = `insert into company 
				(company_name) values 
				(${company_name})`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.addUser = async (user_name, company_index, user_authority, user_phonenumber, user_school, user_password) => {
	const query = `insert into user 
				(user_name, 
				company_index, 
				user_authority, 
				user_phonenumber, 
				user_school, 
				user_password) values 
				(${mysql.escape(user_name)}, 
				${mysql.escape(company_index)}, 
				${mysql.escape(user_authority)}, 
				${mysql.escape(user_phonenumber)}, 
				${mysql.escape(user_school)}, 
				${mysql.escape(user_password)})`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// exam_std, exam_avg, exam_people 매번 변동
exports.addExam = async (exam_name, exam_problemcount, exam_time, exam_label, exam_score, exam_desc, exam_dist, exam_std, exam_avg, exam_people) => {
	const query = `insert into exam 
				(exam_name, 
				exam_problemcount, 
				exam_time, 
				exam_label, 
				exam_score, 
				exam_desc,
				exam_dist, 
				exam_std, 
				exam_avg, 
				exam_people) values 
				(${mysql.escape(exam_name)},
				${mysql.escape(exam_problemcount)},
				${mysql.escape(exam_time)},
				${mysql.escape(exam_label)},
				${mysql.escape(exam_score)},
				${mysql.escape(exam_desc)},
				${mysql.escape(exam_dist)},
				${mysql.escape(exam_std)}, 
				${mysql.escape(exam_avg)},
				${mysql.escape(exam_people)})`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 성적 매번 변동
exports.addResult = async (result_name, user_index, exam_index, result_result, result_std, result_rank) => {
	const query = `insert into result 
				(result_name,
				user_index,
				exam_index,
				result_result,
				result_std,
				result_rank) values 
				(${mysql.escape(result_name)},
				${mysql.escape(user_index)},
				${mysql.escape(exam_index)},
				${mysql.escape(result_result)},
				${mysql.escape(result_std)},
				${mysql.escape(result_rank)})`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}