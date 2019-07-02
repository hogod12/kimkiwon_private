const database = require ('./databaseModel');
const mysql = require('mysql');

exports.addQuestion = async (result_index) => {
	const query = `insert into question 
				(result_index) values 
				(${mysql.escape(result_index)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.getQuestionData = async () => {
	const query = `select * from question`;
	const result = await database.getQuery(query);
	return result;
}

exports.getQuestionDataByResultIndex = async (result_index) => {
	const query = `select * from question where result_index=${mysql.escape(result_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getQuestionDataByQuestionIndex = async (question_index) => {
	const query = `select * from question where question_index=${mysql.escape(question_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.updateQuestionDataByQuestionIndex = async (question_index, question_text, question_image, question_date) => {
	const query = `update question set 
				question_text = ${mysql.escape(question_text)}, 
				question_image = ${mysql.escape(question_image)}, 
				question_date = ${mysql.escape(question_date)}
				where question_index = ${mysql.escape(question_index)}`;
	const result = await database.updateQuery(query);
	return result;
}

exports.updateQuestionDataByQuestionIndex2 = async (question_index, question_text, question_date) => {
	const query = `update question set 
				question_text = ${mysql.escape(question_text)},  
				question_date = ${mysql.escape(question_date)}
				where question_index = ${mysql.escape(question_index)}`;
	const result = await database.updateQuery(query);
	return result;
}

exports.updateQuestionDataByQuestionIndex3 = async (question_index, answer_text, answer_date) => {
	const query = `update question set 
				answer_text = ${mysql.escape(answer_text)}, 
				answer_date = ${mysql.escape(answer_date)} 
				where question_index = ${mysql.escape(question_index)}`;
	const result = await database.updateQuery(query);
	return result;
}