const database = require('./database')
const mysql = require('mysql')

exports.allUserData = async () => {
	const query = `select * from user`
	const result = await database.getQuery(query)
	return result
}

exports.allClassData = async () => {
	const query = `select * from class`
	const result = await database.getQuery(query)
	return result
}

exports.allCurriculumData = async () => {
	const query = `select * from curriculum`
	const result = await database.getQuery(query)
	return result
}

exports.getUserDataByIndex = async (user_index) => {
	const query = `select * from user where user_index = ${mysql.escape(user_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getUserDataByAuthority = async (user_authority) => {
	const query = `select * from user where user_authority = ${mysql.escape(user_authority)}`
	const result = await database.getQuery(query)
	return result
}

exports.allCurriculumData = async (year) => {
	const query = `select * from curriculum`
	const result = await database.getQuery(query)
	return result
}

exports.getCurriculumYearByIndex = async (curriculum_index) => {
	const query = `select curriculum_year from curriculum where curriculum_index = ${mysql.escape(curriculum_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getCurriculumIndexByName = async (curriculum_name) => {
	const query = `select curriculum_index from curriculum where curriculum_name = ${mysql.escape(curriculum_name)}`
	const result = await database.getQuery(query)
	return result
}

exports.getCurriculumNameByIndex = async (curriculum_index) => {
	const query = `select curriculum_name from curriculum where curriculum_index = ${mysql.escape(curriculum_index)}` 
	const result = await database.getQuery(query)
	return result
}

exports.allExamData = async () => {
	const query = `select * from exam`
	const result = await database.getQuery(query)
	return result
}

exports.getResultDataByExamIndex = async (exam_index) => {
	const query = `select * from result where exam_index = ${mysql.escape(exam_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getExamProblemLabelByExamIndex = async (exam_index) => {
	const query = `select exam_problem_label from exam where exam_index = ${mysql.escape(exam_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getUserIndexByNamePhonenumber = async (user_name, user_phonenumber) => {
	const query = `select user_index from user where user_name=${mysql.escape(user_name)} and user_phonenumber=${mysql.escape(user_phonenumber)}`
	const result = await database.getQuery(query)
	return result
}

exports.getUserIndexByIdPassword = async (user_id, user_password) => {
	const query = `select user_index from user where user_id=${mysql.escape(user_id)} and user_password=${mysql.escape(user_password)}`
	const result = await database.getQuery(query)
	return result
}

exports.getUserIndexByUserNameUserPhonenumber = async (user_name, user_phonenumber) => {
	const query = `select user_index from user where user_name=${mysql.escape(user_name)} and user_phonenumber=${mysql.escape(user_phonenumber)}`
	const result = await database.getQuery(query)
	return result
}

exports.getUserDataByUserIndex = async (user_index) => {
	const query = `select * from user where user_index = ${mysql.escape(user_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getUserAuthorityByUserIndex = async (user_index) => {
	const query = `select user_authority from user where user_index=${mysql.escape(user_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getResultIndexByUserIndexExamIndex = async (user_index, exam_index) => {
	const query = `select result_index from result where user_index = ${mysql.escape(user_index)} and exam_index = ${mysql.escape(exam_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getExamNameByExamIndex = async (exam_index) => {
	const query = `select exam_name from exam where exam_index = ${mysql.escape(exam_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getResultDataByUserIndex = async (user_index) => {
	const query = `select * from result where user_index = ${mysql.escape(user_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getResultDataByResultIndex = async (result_index) => {
	const query = `select * from result where result_index = ${mysql.escape(result_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getExamIndexByResultIndex = async (result_index) => {
	const query = `select exam_index from result where result_index = ${mysql.escape(result_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getExamIndexByExamName = async (exam_name) => {
	const query = `select exam_index from exam where exam_name = ${mysql.escape(exam_name)}`
	const result = await database.getQuery(query)
	return result
}

exports.getExamDataByExamIndex = async (exam_index) => {
	const query = `select * from exam where exam_index = ${mysql.escape(exam_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getResultDataByExamIndexUserIndex = async (exam_index, user_index) => {
	const query = `select * from result where exam_index=${mysql.escape(exam_index)} and user_index=${mysql.escape(user_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getQuestionDataByResultIndex = async (result_index) => {
	const query = `select * from question where result_index=${mysql.escape(result_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getResultDataByExamIndex = async (exam_index) => {
	const query = `select * from result where exam_index=${mysql.escape(exam_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getQuestionDataByQuestionIndex = async (question_index) => {
	const query = `select * from question where question_index=${mysql.escape(question_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.allUniversityData = async () => {
	const query = `select * from university`
	const result = await database.getQuery(query)
	return result
}

exports.getUniversityDataByUniversityIndex = async (university_index) => {
	const query = `select * from university where university_index=${mysql.escape(university_index)}`
	const result = await database.getQuery(query)
	return result
}

exports.getExamDataByExamCategoryLabel = async(exam_category_label) => {
	const query = `select * from exam where exam_category_label=${mysql.escape(exam_category_label)}`
	const result = await database.getQuery(query)
	return result
}

exports.getUniversityCategoryLabelByUniversityIndex = async(university_index) =>{
	const query = `select university_category_label from university where university_index=${mysql.escape(university_index)}`
	const result = await database.getQuery(query)
	return result
}