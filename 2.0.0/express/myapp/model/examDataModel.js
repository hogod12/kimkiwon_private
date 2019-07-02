const database = require('./databaseModel');
const mysql = require('mysql');

exports.addExam = async (exam_name, exam_domain_index, exam_year, exam_desc, exam_problem_number, exam_problem_label, exam_problem_desc, exam_problem_score, exam_date) => {
	const query = `insert into exam 
				(exam_name,
				exam_domain_index,
				exam_year,
				exam_desc,
				exam_problem_number,
				exam_problem_label,
				exam_problem_desc,
				exam_problem_score,
				exam_date) values 
				(${mysql.escape(exam_name)},
				${mysql.escape(exam_domain_index)},
				${mysql.escape(exam_year)},
				${mysql.escape(exam_desc)},
				${mysql.escape(exam_problem_number)},
				${mysql.escape(exam_problem_label)},
				${mysql.escape(exam_problem_desc)},
				${mysql.escape(exam_problem_score)},
				${mysql.escape(exam_date)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.addExamDomain = async (exam_domain_name, exam_domain_type1, exam_domain_type2, exam_domain_date) => {
	const query = `insert into exam_domain 
				(exam_domain_name,
				exam_domain_type1,
				exam_domain_type2,
				exam_domain_date) values
				(${mysql.escape(exam_domain_name)},
				${mysql.escape(exam_domain_type1)},
				${mysql.escape(exam_domain_type2)},
				${mysql.escape(exam_domain_date)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.getExamData = async () => {
	const query = `select * from exam`;
	const result = await database.getQuery(query);
	return result;
}

exports.getExamDataByExamIndex = async (exam_index) => {
	const query = `select * from exam where exam_index=${mysql.escape(exam_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getExamDataByExamYear = async (exam_year) => {
	const query = `select * from exam where exam_year=${mysql.escape(exam_year)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.updateExamStatisticsByExamIndex = async (exam_index, exam_statistic_distribution, exam_statistic_average, exam_statistic_std, exam_statistic_count) => {
	const query = `update exam set 
				exam_statistic_distribution = ${mysql.escape(exam_statistic_distribution)}, 
				exam_statistic_average = ${mysql.escape(exam_statistic_average)}, 
				exam_statistic_std = ${mysql.escape(exam_statistic_std)},
				exam_statistic_count = ${mysql.escape(exam_statistic_count)} 
				where exam_index = ${mysql.escape(exam_index)}`;
	const result = await database.updateQuery(query);
	return result;
}

exports.getExamDomainDataByExamDomainIndex = async (exam_domain_index) => {
	const query = `select * from exam_domain where exam_domain_index = ${mysql.escape(exam_domain_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getExamDomainData = async () => {
	const query = `select * from exam_domain`;
	const result = await database.getQuery(query);
	return result;
}

exports.getExamTypeDataByExamTypeIndex = async (exam_type_index) => {
	const query = `select * from exam_type where exam_type_index=${mysql.escape(exam_type_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.addExamType = async (exam_type_name, exam_type_date) => {
	const query = `insert into exam_type 
				(exam_type_name,
				exam_type_date) values 
				(${mysql.escape(exam_type_name)},
				${mysql.escape(exam_type_date)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.getExamTypeData = async () => {
	const query = `select * from exam_type`;
	const result = await database.getQuery(query);
	return result;
}

exports.updateExamDataByExamIndex = async (exam_index, exam_name, exam_problem_number, exam_problem_label, exam_problem_desc, exam_problem_score, exam_desc) => {
	const query = `update exam set 
				exam_name = ${mysql.escape(exam_name)}, 
				exam_problem_number = ${mysql.escape(exam_problem_number)}, 
				exam_problem_label = ${mysql.escape(exam_problem_label)},
				exam_problem_desc = ${mysql.escape(exam_problem_desc)},
				exam_problem_score = ${mysql.escape(exam_problem_score)},
				exam_desc = ${mysql.escape(exam_desc)} 
				where exam_index = ${mysql.escape(exam_index)}`;
	const result = await database.updateQuery(query);
	return result;
}

exports.deleteExam = async (exam_index) => {
	const query = `delete from exam where exam_index = ${mysql.escape(exam_index)}`;
	const result = await database.updateQuery(query);
	return result;
}