const database = require('./database')
const mysql = require('mysql')
const log = require('./etc/log')

exports.AddUser = async (user_name, user_school, user_phonenumber, user_authority, user_id, user_password, user_date) => {
	const query = `insert into user 
				(user_name,
				user_school,
				user_phonenumber,
				user_authority,
				user_id,
				user_password,
				user_date) values 
				(${mysql.escape(user_name)},
				${mysql.escape(user_school)},
				${mysql.escape(user_phonenumber)},
				${mysql.escape(user_authority)},
				${mysql.escape(user_id)},
				${mysql.escape(user_password)},
				${mysql.escape(user_date)})`

	const result = await database.addQuery(query)

	return result
}

exports.AddCurriculum = async (curriculum_name, curriculum_year, curriculum_desc, curriculum_date) => {
	const query = `insert into curriculum 
				(curriculum_name,
				curriculum_year,
				curriculum_desc,
				curriculum_date) values
				(${mysql.escape(curriculum_name)},
				${mysql.escape(curriculum_year)},
				${mysql.escape(curriculum_desc)},
				${mysql.escape(curriculum_date)})`

	const result = await database.addQuery(query)

	return result
}

exports.AddClass = async (curriculum_index, class_schedule, class_year, class_date) => {
	const query = `insert into class
				(curriculum_index,
				class_schedule,
				class_year,
				class_date) values 
				(${mysql.escape(curriculum_index)},
				${mysql.escape(class_schedule)},
				${mysql.escape(class_year)},
				${mysql.escape(class_date)})`

	const result = await database.addQuery(query)

	return result
}

exports.AddExam = async (curriculum_index, exam_name, exam_type, exam_category_label, exam_problem_num, exam_problem_label, exam_problem_mark, exam_problem_desc, exam_result_dist, exam_result_std, exam_result_avg, exam_result_people, exam_date) => {
	const query = `insert into exam 
				(curriculum_index,
				exam_name,
				exam_type,
				exam_category_label,
				exam_problem_num,
				exam_problem_label,
				exam_problem_mark,
				exam_problem_desc,
				exam_result_dist,
				exam_result_std,
				exam_result_avg,
				exam_result_people,
				exam_date) values 
				(${mysql.escape(curriculum_index)},
				${mysql.escape(exam_name)},
				${mysql.escape(exam_type)},
				${mysql.escape(exam_category_label)},
				${mysql.escape(exam_problem_num)},
				${mysql.escape(exam_problem_label)},
				${mysql.escape(exam_problem_mark)},
				${mysql.escape(exam_problem_desc)},
				${mysql.escape(exam_result_dist)},
				${mysql.escape(exam_result_std)},
				${mysql.escape(exam_result_avg)},
				${mysql.escape(exam_result_people)},
				${mysql.escape(exam_date)})`

	const result = await database.addQuery(query)

	return result
}

exports.AddResult = async (user_index, exam_index, result_score, result_date, result_class, result_grader, result_sum, result_rank) => {
	const query = `insert into result 
				(user_index,
				exam_index,
				result_score,
				result_date,
				result_class,
				result_grader,
				result_sum,
				result_rank) values 
				(${mysql.escape(user_index)},
				${mysql.escape(exam_index)},
				${mysql.escape(result_score)},
				${mysql.escape(result_date)},
				${mysql.escape(result_class)},
				${mysql.escape(result_grader)},
				${mysql.escape(result_sum)},
				${mysql.escape(result_rank)})`

	const result = await database.addQuery(query)

	return result
}

exports.AddQuestion = async (questioner_index, answerer_index, result_index, question_type, question_text, question_date_time, answer_text, answer_date_time) => {
	const query = `insert into question  
				(questioner_index,
				answerer_index,
				result_index,
				question_type,
				question_text,
				question_date_time) values 
				(${mysql.escape(questioner_index)},
				${mysql.escape(answerer_index)},
				${mysql.escape(result_index)},
				${mysql.escape(question_type)},
				${mysql.escape(question_text)},
				${mysql.escape(question_date_time)})`

	const result = await database.addQuery(query)

	return result
}

exports.AddUniversity = async (university_name, university_department, university_year, university_limit, university_category_label, university_score, university_date) => {
	const query = `insert into university 
				(university_name,
				university_department,
				university_year,
				university_limit,
				university_category_label,
				university_score,
				university_date) values 
				(${mysql.escape(university_name)},
				${mysql.escape(university_department)},
				${mysql.escape(university_year)},
				${mysql.escape(university_limit)},
				${mysql.escape(university_category_label)},
				${mysql.escape(university_score)},
				${mysql.escape(university_date)})`

	const result = await database.addQuery(query)

	return result
}

exports.AddAcceptance = async (university_index, user_index, acceptance_date, state_flag) => {
	const query = `insert into acceptance 
				(university_index,
				user_index,
				acceptance_date,
				state_flag) values 
				(${mysql.escape(university_index)},
				${mysql.escape(user_index)},
				${mysql.escape(acceptance_date)},
				${mysql.escape(state_flag)})`

	const result = await database.addQuery(query)

	return result
}
