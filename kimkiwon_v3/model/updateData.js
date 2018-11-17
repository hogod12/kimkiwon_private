const database = require('./dbController')
const logger = require('./writeLog')
const mysql = require('mysql')

exports.updateExam = async (exam_index, exam_name, exam_problemcount, exam_label, exam_score, exam_time, exam_desc, exam_dist, exam_people, exam_std, exam_avg) => {
	// TODO : examset_desc 나중에 추가개발 필요함
	const query = `update exam set 
				exam_name=${mysql.escape(exam_name)},
				exam_problemcount=${mysql.escape(exam_problemcount)},
				exam_label=${mysql.escape(exam_label)},
				exam_score=${mysql.escape(exam_score)},
				exam_time=${mysql.escape(exam_time)},
				exam_desc=${mysql.escape(exam_desc)},
				exam_dist=${mysql.escape(exam_dist)},
				exam_people=${exam_people},
				exam_std=${exam_std},
				exam_avg=${exam_avg}
				where exam_index=${exam_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.updateUser = async (user_index, user_name, user_school, user_phonenumber, user_authority, user_password) => {
	// TODO : examset_desc 나중에 추가개발 필요함
	const query = `update user set 
				user_name=${mysql.escape(user_name)},
				user_school=${mysql.escape(user_school)},
				user_phonenumber=${mysql.escape(user_phonenumber)},
				user_authority=${mysql.escape(user_authority)},
				user_password=${mysql.escape(user_password)}
				where user_index=${user_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}