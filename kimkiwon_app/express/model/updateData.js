const database = require('./database')
const mysql = require('mysql')
const log = require('./etc/log')

exports.updateResult = async (result_index, result_score, result_sum) => {
	query = `update result set result_score = ${mysql.escape(result_score)}, result_sum = ${mysql.escape(result_sum)} where result_index = ${mysql.escape(result_index)}`
	const result = await database.updateQuery(query)

	return result
}

exports.updateResultRank = async(result_index, result_rank) => {
	query = `update result set result_rank = ${mysql.escape(result_rank)} where result_index = ${mysql.escape(result_index)}`
	const result = await database.updateQuery(query)

	return result
}

exports.updateExamStatistics = async(exam_index, exam_result_people, exam_result_avg, exam_result_std, exam_result_dist) => {
	query = `update exam set 
			exam_result_people = ${mysql.escape(exam_result_people)},
			exam_result_avg = ${mysql.escape(exam_result_avg)},
			exam_result_std = ${mysql.escape(exam_result_std)},
			exam_result_dist = ${mysql.escape(exam_result_dist)} 
			where exam_index = ${mysql.escape(exam_index)}`

	const result = await database.updateQuery(query)

	return result
}

exports.updateQuestion = async(question_index, answer_text) => {
	query = `update question set 
			answer_text = ${mysql.escape(answer_text)} 
			where question_index = ${mysql.escape(question_index)}`

	const result = await database.updateQuery(query)

	return result
}

exports.updateAcceptance = async(user_index, acceptance_index_1, acceptance_index_2, acceptance_index_3) => {
	query = `update user set 
			acceptance_index_1 = ${mysql.escape(acceptance_index_1)},
			acceptance_index_2 = ${mysql.escape(acceptance_index_2)},
			acceptance_index_3 = ${mysql.escape(acceptance_index_3)} 
			where user_index = ${mysql.escape(user_index)}`

	const result = await database.updateQuery(query)

	return result
}