const database = require('./connectDatabase')
const logger = require('../etc/logging')
const mysql = require('mysql')

// ====== USER

// 인덱스 정보를 활용하여 유저 탐색
exports.getUserByIndex = async (user_index) => {
	const query = `select * from user where user_index = ${mysql.escape(user_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 데이터베이스 내 모든 유저 탐색
exports.getAllUser = async (request_data) => {
	request_query = `${request_data[0]} `
	for (var i = 1 ; i < request_data.length ; i++) {
		request_query += `,${request_data[i]} ` 
	} 

	const query = `select ${request_query} from user`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 유저탐색 쿼리(검색)를 활용하여 유저 탐색
exports.getUserBySearchQuery = async (user_name, user_school, user_phonenumber, user_authority) => {
	var query = `select * from user where`
	var count = 0
	
	if (user_name != "") {
		query = query + ` user_name like ${mysql.escape("%" + user_name + "%")}`
	}

	if (user_school != "") {
		if (count != 0) {
			query = query + ` and`
		}
		query = query + ` user_school like ${mysql.escape("%" + user_school + "%")}`
	}

	if (user_phonenumber != "") {
		if (count != 0) {
			query = query + ` and`
		}
		query = query + ` user_phonenumber like ${mysql.escape("%" + user_phonenumber + "%")}`
	}

	if (user_authority != "") {
		if (count != 0) {
			query = query + ` and`
		}
		query = query + ` user_authority = ${mysql.escape(user_authority)}`
	}

	if (user_name == "" && user_school == "" && user_phonenumber == "" && user_authority == "") {
		const query = `select * from user where user_name="" and user_school="" and user_phonenumber="" and user_authority=""`
		logger.writeTimestampLog("DB QUERY", query)

		const result = await database.query(query)
		logger.writeTimestampLog("DB RESULT", `${result}`)

		return result
	}

	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 유저를 특정 지을 수 있는 user_name과 user_phonenumber를 활용하여 탐색
exports.getUserByInfo = async (user_name, user_phonenumber) => {
	const query = `select * from user where user_name = ${mysql.escape(user_name)} and user_phonenumber = ${mysql.escape(user_phonenumber)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// ====== EXAM

// 지정 인덱스 시험 정보 받아오는 코드
exports.getExamByIndex = async (exam_index) => {
	const query = `select * from exam where exam_index = ${mysql.escape(exam_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 데이터베이스 내 모든 시험 탐색
exports.getAllExam = async (request_data) => {
	request_query = `${request_data[0]} `
	for (var i = 1 ; i < request_data.length ; i++) {
		request_query += `,${request_data[i]} ` 
	} 

	const query = `select ${request_query} from exam`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 검색 쿼리를 활용한 시험 탐색
exports.getExamBySearchQuery = async (search_exam_name) => {
	const query = `select * from exam where exam_name like ${mysql.escape("%" + search_exam_name + "%")}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// ====== RESULT

// 결과 인덱스를 활용하여 결과 탐색
exports.getResultByIndex = async (result_index) => {
	const query = `select * from result where result_index = ${mysql.escape(result_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 전체 시험 정보 받아오는 코드
exports.getAllResult = async (request_data) => {
	request_query = `${request_data[0]} `
	for (var i = 1 ; i < request_data.length ; i++) {
		request_query += `,${request_data[i]} ` 
	} 

	const query = `select ${mysql.escape(request_query)} from result`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 특정 유저의 학생 성적 받아오는 코드
exports.getResultByUser = async (user_index) => {
	const query = `select * from result where user_index = ${mysql.escape(user_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 특정 시험의 학생 성적 받아오는 코드
exports.getResultByExam = async (exam_index) => {
	const query = `select * from result where exam_index = ${mysql.escape(exam_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 특정 시험에 특정 유저가 존재하는지를 확인하기 위한 데이터 요청
exports.getResultByExamUser = async (exam_index, user_index) => {
	const query = `select * from result where exam_index = ${mysql.escape(exam_index)} and user_index = ${mysql.escape(user_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// 특정 유저의 시험결과 분류 태그를 활용하여 성적을 받아오는 코드
exports.getResultByTag = async (result_tag) => {
	const query = `select * from result where result_tag = ${mysql.escape(result_tag)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

// ====== 복합 데이터
exports.getExamResultByUser = async (user_index) => {
	const query = `select * from exam e, result r 
				where r.exam_index = e.exam_index and r.user_index=${mysql.escape(user_index)}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}
