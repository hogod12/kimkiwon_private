const database = require('./databaseModel');
const mysql = require('mysql');

exports.addResult = async (user_index, lesson_index, exam_index, result_sum, result_score, result_grader, result_date) => {
	const query = `insert into result 
				(user_index, 
				lesson_index,
				exam_index,
				result_score,
				result_sum,
				result_grader,
				result_date) values 
				(${mysql.escape(user_index)},
				${mysql.escape(lesson_index)},
				${mysql.escape(exam_index)},
				${mysql.escape(result_score)},
				${mysql.escape(result_sum)},
				${mysql.escape(result_grader)},
				${mysql.escape(result_date)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.getResultDataByResultIndex = async (result_index) => {
	const query = `select * from result where result_index = ${mysql.escape(result_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getResultDataByUserIndexExamIndex = async (user_index, exam_index) => {
	const query = `select * from result where (user_index = ${mysql.escape(user_index)} and exam_index = ${mysql.escape(exam_index)})`;
	const result = await database.getQuery(query);
	return result;
}

exports.getResultDataByExamIndex = async (exam_index) => {
	const query = `select * from result where exam_index = ${mysql.escape(exam_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getResultDataByUserIndex = async (user_index) => {
	const query = `select * from result where user_index = ${mysql.escape(user_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.showResult = async () => {
	const query = `select * from result`;
	const result = await database.getQuery(query);
	return result;
}

exports.updateResult = async (result_index, result_score, result_sum) => {
	const query = `update result set 
				result_score = ${mysql.escape(result_score)}, 
				result_sum = ${mysql.escape(result_sum)} 
				where result_index = ${mysql.escape(result_index)}`;
	const result = await database.updateQuery(query);
	return result;
}

exports.updateResultStatisticsByResultIndex = async (result_index, result_rank, result_std) => {
	const query = `update result set 
				result_rank = ${mysql.escape(result_rank)}, 
				result_std = ${mysql.escape(result_std)} 
				where result_index = ${mysql.escape(result_index)}`;
	const result = await database.updateQuery(query);
	return result;
}