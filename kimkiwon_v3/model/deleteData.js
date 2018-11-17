const database = require('./dbController')
const logger = require('./writeLog')

exports.deleteExam = async (exam_index) => {
	// TODO : examset_desc 나중에 추가개발 필요함
	const query = `delete from exam where exam_index=${exam_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.deleteUser = async (user_index) => {
	// TODO : examset_desc 나중에 추가개발 필요함
	const query = `delete from user where user_index=${user_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}

exports.deleteResult = async (result_index) => {
	// TODO : examset_desc 나중에 추가개발 필요함
	const query = `delete from user where result_index=${result_index}`
	logger.writeTimestampLog("DB QUERY", query)

	const result = await database.query(query)
	logger.writeTimestampLog("DB RESULT", `${result}`)

	return result
}