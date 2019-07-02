const database = require('./databaseModel');
const mysql = require('mysql');

exports.addUniversity = async (university_name, department_name, entrance_limit, year_index, university_department_date) => {
	const query = `insert into university_department 
				(university_name, 
				department_name,
				entrance_limit,
				entrance_year,
				university_department_date) values
				(${mysql.escape(university_name)},
				${mysql.escape(department_name)},
				${mysql.escape(entrance_limit)},
				${mysql.escape(year_index)},
				${mysql.escape(university_department_date)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.getUniversityDataByEntranceYear = async (year_index) => {
	const query = `select * from university_department where entrance_year = ${mysql.escape(year_index)}`;
	const result = await database.getQuery(query);

	return result;
}