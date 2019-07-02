const database = require("./databaseModel");
const mysql = require('mysql');

exports.addLesson = async (class_index, lesson_number, exam_index, lesson_year, lesson_desc, lesson_date) => {
	const query = `insert into lesson 
				(class_index, 
				lesson_number,
				exam_index,
				lesson_year,
				lesson_desc,
				lesson_date) values 
				(${mysql.escape(class_index)},
				${mysql.escape(lesson_number)},
				${mysql.escape(exam_index)},
				${mysql.escape(lesson_year)},
				${mysql.escape(lesson_desc)},
				${mysql.escape(lesson_date)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.getLessonData = async () => {
	const query = `select * from lesson`;
	const result = await database.getQuery(query);
	return result;
}

exports.getLessonDataByLessonIndex = async (lesson_index) => {
	const query = `select * from lesson where lesson_index = ${mysql.escape(lesson_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getLessonDataByClassIndex = async (class_index) => {
	const query = `select * from lesson where class_index = ${mysql.escape(class_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getLessonDataByLessonYear = async (lesson_year) => {
	const query = `select * from lesson where lesson_year = ${mysql.escape(lesson_year)}`;
	const result = await database.getQuery(query);
	return result;
}