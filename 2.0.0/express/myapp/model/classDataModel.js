const database = require('./databaseModel');
const mysql = require('mysql');

exports.addClass = async (class_name, curriculum_index, mentor_index, class_desc, class_date, class_state) => {
	const query = `insert into class 
				(class_name,
				curriculum_index,
				mentor_index,
				class_desc,
				class_date,
				class_state) values
				(${mysql.escape(class_name)},
				${mysql.escape(curriculum_index)},
				${mysql.escape(mentor_index)},
				${mysql.escape(class_desc)},
				${mysql.escape(class_date)},
				${mysql.escape(class_state)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.getClassData = async () => {
	const query = `select * from class`;
	const result = await database.getQuery(query);
	return result;
}

exports.getClassDataByClassIndex = async (class_index) => {
	const query = `select * from class where class_index=${mysql.escape(class_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getClassDataByYearIndex = async (year_index) => {
	const query = `select * from class where year_index=${mysql.escape(year_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getClassDataByClassState = async (class_state) => {
	const query = `select * from class where class_state = ${mysql.escape(class_state)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getClassDataByMentorIndexClassState = async (mentor_index, class_state) => {
	const query = `select * from class where class_state = ${mysql.escape(class_state)} and mentor_index = ${mysql.escape(mentor_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.updateClassState = async (class_index, class_state) => {
	const query = `update class set 
				class_state = ${mysql.escape(class_state)} 
				where class_index = ${mysql.escape(class_index)}`;
	var result = await database.updateQuery(query);

	return result;
}

exports.updateClassDataByClassIndex = async (class_index, class_name, mentor_index, class_desc) => {
	const query = `update class set 
				class_name = ${mysql.escape(class_name)}, 
				mentor_index = ${mysql.escape(mentor_index)},
				class_desc = ${mysql.escape(class_desc)} 
				where class_index = ${mysql.escape(class_index)}`;
	var result = await database.updateQuery(query);

	return result;
}

exports.deleteClass = async (class_index) => {
	const query = `delete from class where class_index = ${mysql.escape(class_index)}`;
	var result = await database.updateQuery(query);
	return result;
}