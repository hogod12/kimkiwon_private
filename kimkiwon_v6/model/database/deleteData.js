const database = require('./connectDatabase')
const logger = require('../etc/logging')
const mysql = require('mysql')

// 유저 인덱스를 활용하여 유저 정보 삭제
exports.deleteUser = async (user_index) => {
	const query = `delete from user where user_index=${user_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.addQuery(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 시험 인덱스를 활용하여 시험 정보 삭제
exports.deleteExam = async (exam_index) => {
	const query = `delete from exam where exam_index=${exam_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.addQuery(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 결과 인덱스를 활용하여 결과 정보 삭제
exports.deleteResult = async (result_index) => {
	const query = `delete from result where result_index=${result_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}