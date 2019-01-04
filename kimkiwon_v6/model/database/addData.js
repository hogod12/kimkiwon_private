const database = require('./connectDatabase')
const logging = require('../etc/logging')
const mysql = require('mysql')

// 유저 정보 추가 *
exports.addUser = async (user_name, user_school, user_phonenumber, user_authority, user_password) => {
	const query = `insert into user 
				(user_name, 
				user_school, 
				user_phonenumber, 
				user_authority, 
				user_password) values 
				(${mysql.escape(user_name)}, 
				${mysql.escape(user_school)}, 
				${mysql.escape(user_phonenumber)}, 
				${mysql.escape(user_authority)}, 
				${mysql.escape(user_password)})`
	logging.writeTimestampLog("DB QUERY", query)

	const result = await database.addQuery(query)
	logging.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 시험 정보 추가
exports.addExam = async (exam_name, 
		exam_problem_label, exam_problem_mark, exam_problem_desc, exam_problem_num, 
		exam_result_distribution, exam_result_std, exam_result_avg, exam_result_people) => {

	const query = `insert into exam
				(exam_name,
				exam_problem_label,
				exam_problem_mark,
				exam_problem_desc,
				exam_problem_num,
				exam_result_distribution,
				exam_result_std,
				exam_result_avg,
				exam_result_people) values
				(${mysql.escape(exam_name)},
				${mysql.escape(JSON.stringify(exam_problem_label))},
				${mysql.escape(JSON.stringify(exam_problem_mark))},
				${mysql.escape(JSON.stringify(exam_problem_desc))},
				${mysql.escape(exam_problem_num)},
				${mysql.escape(JSON.stringify(exam_result_distribution))},
				${mysql.escape(exam_result_std)},
				${mysql.escape(exam_result_avg)},
				${mysql.escape(exam_result_people)})`
	logging.writeTimestampLog("DB QUERY", query)

	const result = await database.addQuery(query)
	logging.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 성적 정보 추가
exports.addResult = async (user_index, exam_index, result_score, result_tag, result_sum, result_std, result_rank) => {
	const query = `insert into result
				(user_index,
				exam_index,
				result_score,
				result_tag,
				result_sum,
				result_std,
				result_rank) values
				(${mysql.escape(user_index)},
				${mysql.escape(exam_index)},
				${mysql.escape(JSON.stringify(result_score))},
				${mysql.escape(result_tag)},
				${mysql.escape(result_sum)},
				${mysql.escape(result_std)},
				${mysql.escape(result_rank)})`
	logging.writeTimestampLog("DB QUERY", query)

	const result = await database.addQuery(query)
	logging.writeTimestampLog("DB RESULT", `${result}`)

	return result
}