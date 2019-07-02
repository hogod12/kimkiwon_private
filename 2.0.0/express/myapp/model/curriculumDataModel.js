const database = require('./databaseModel');
const mysql = require('mysql');

exports.getCurriculumDomainData = async () => {
	const query = `select * from curriculum_domain`;
	const result = await database.getQuery(query);
	return result;
}

exports.getCurriculumDomainDataByCurriculumDomainIndex = async (curriculum_domain_index) => {
	const query = `select * from curriculum_domain where curriculum_domain_index=${mysql.escape(curriculum_domain_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getCurriculumDataByYearIndex = async (year_index) => {
	const query = `select * from curriculum where year_index=${mysql.escape(year_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.getCurriculumDataByCurriculumIndex = async (curriculum_index) => {
	const query = `select * from curriculum where curriculum_index=${mysql.escape(curriculum_index)}`;
	const result = await database.getQuery(query);
	return result;
}

exports.addCurriculum = async (curriculum_name, curriculum_type, year_index, curriculum_desc, curriculum_date) => {
	const query = `insert into curriculum
				(curriculum_name,
				curriculum_type,
				year_index,
				curriculum_desc,
				curriculum_date) values 
				(${mysql.escape(curriculum_name)},
				${mysql.escape(curriculum_type)},
				${mysql.escape(year_index)},
				${mysql.escape(curriculum_desc)},
				${mysql.escape(curriculum_date)})`;
	const result = await database.addQuery(query);
	
	return result;
}

exports.addCurriculumDomain = async (curriculum_domain_name, curriculum_domain_date) => {
	const query = `insert into curriculum_domain
				(curriculum_domain_name,
				curriculum_domain_date) values 
				(${mysql.escape(curriculum_domain_name)},
				${mysql.escape(curriculum_domain_date)})`;
	const result = await database.addQuery(query);

	return result;
}

exports.updateCurriculumDataByCurriculumIndex = async (curriculum_index, curriculum_name, curriculum_desc) => {
	const query = `update curriculum set 
				curriculum_name = ${mysql.escape(curriculum_name)},
				curriculum_desc = ${mysql.escape(curriculum_desc)} 
				where curriculum_index = ${mysql.escape(curriculum_index)}`;
	const result = await database.updateQuery(query);
	return result;
}

exports.deleteCurriculumDataByCurriculumIndex = async (curriculum_index) => {
	const query = `delete from curriculum where curriculum_index = ${mysql.escape(curriculum_index)}`;
	const result = await database.updateQuery(query);
	return result;
}