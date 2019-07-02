const database = require('./databaseModel');
const mysql = require('mysql');

exports.getYearData = async () => {
	const query = `select * from year`;
	const result = await database.getQuery(query);
	return result;
}

exports.getYearDataByYearIndex = async (year_index) => {
	const query = `select * from year where year_index=${mysql.escape(year_index)}`
	const result = await database.getQuery(query);
	return result;
}

exports.addYear = async (year_name, year_year, year_desc, year_date) => {
	const query = `insert into year
				(year_name,
				year_year,
				year_desc,
				year_date,
				year_state) values 
				(${mysql.escape(year_name)},
				${mysql.escape(year_year)},
				${mysql.escape(year_desc)},
				${mysql.escape(year_date)},
				${mysql.escape(0)})`;
	const result = await database.addQuery(query);
	
	return result;
}

exports.getCurrentYear = async() => {
	const query = `select * from year where year_state=${mysql.escape(1)}`
	const result = await database.getQuery(query);
	return result;
}

exports.updateYearState = async(year_index) => {
	var query = `update year set 
				year_state = ${mysql.escape(0)}`;
	var result = await database.updateQuery(query);

	query = `update year set 
			year_state = ${mysql.escape(1)} 
			where year_index = ${mysql.escape(year_index)}`;
	var result = await database.updateQuery(query);

	return result;
}