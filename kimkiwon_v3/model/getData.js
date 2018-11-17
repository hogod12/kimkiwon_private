const database = require('./dbController')
const logger = require('./writeLog')
const mysql = require('mysql')

// Company 소속..? 전체 정보 받아오는 코드
exports.getCompany = async (company_index) => {
	const query = `select * from company where company_index = ${mysql.escape(company_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 유저 전체 정보 받아오는 코드
exports.getUser = async (user_index) => {
	const query = `select * from user where user_index = ${mysql.escape(user_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.findUser = async (user_name, user_phonenumber) => {
	const query = `select * from user where user_name = ${mysql.escape(user_name)} and user_phonenumber = ${mysql.escape(user_phonenumber)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 지정 인덱스 시험 정보 받아오는 코드
exports.getAllUser = async () => {
	const query = `select * from user`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 지정 인덱스 시험 정보 받아오는 코드
exports.getExam = async (exam_index) => {
	const query = `select * from exam where exam_index = ${exam_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 지정 인덱스 시험 정보 받아오는 코드
exports.getAllExam = async () => {
	const query = `select * from exam`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 결과 전체 정보 받아오는 코드
exports.getResult = async (result_index) => {
	const query = `select * from result where result_index = ${result_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 특정 학생 성적 받아오는 코드
exports.findResult = async (user_index) => {
	const query = `select * from result where user_index = ${user_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.joinResultExam = async (user_index) => {
	const query = `select E.exam_name, E.exam_index, E.exam_problemcount, E.exam_label, E.exam_score, E.exam_dist, E.exam_std, E.exam_avg, E.exam_people, R.result_result, R.result_std, R.result_rank, U.user_name from result R, exam E, user U where E.exam_index = R.exam_index and R.user_index = U.user_index and R.user_index = ${user_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 지정 인덱스 시험 정보 받아오는 코드
exports.getAllResult = async () => {
	const query = `select * from result`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}