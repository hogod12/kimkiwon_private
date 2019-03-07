const adminDataController = require('./adminDataController')
const studentDataController = require('./studentDataController')
const mentorDataController = require('./mentorDataController')
const getData = require('../model/getData')

exports.addUserView = async (req,res) => {
	res.render('admin/admin_adduser.ejs')
}

exports.addClassView = async (req,res) => {
	data = await adminDataController.AddClassViewData()
	res.render('admin/admin_addclass.ejs', {data:data})
}

exports.addExamView = async (req,res) => {
	data = await adminDataController.AddExamViewData()
	res.render('admin/admin_addexam.ejs', {data:data})
}

exports.addResultView = async (req,res) => {
	data = await adminDataController.AddResultViewData()
	res.render('admin/admin_addresult.ejs', {data:data})
}

exports.addAcceptanceView = async (req,res) => {
	user_index = req.query.user_index
	data = await adminDataController.AddAcceptanceViewData(user_index)
	res.render('admin/admin_addacceptance.ejs')
}

exports.addCurriculumView = async (req,res) => {
	res.render('admin/admin_addcurriculum.ejs')
}

exports.addUniversityView = async (req,res) => {
	res.render('admin/admin_adduniversity.ejs')
}

exports.showUserView = async (req,res) => {
	data = await adminDataController.ShowUserViewData()
	res.render('admin/admin_showuser.ejs', {data:data})
}

exports.showCurriculumView = async (req,res) => {
	data = await adminDataController.ShowCurriculumViewData()
	res.render('admin/admin_showcurriculum.ejs', {data:data})
}

exports.showClassView = async (req,res) => {
	data = await adminDataController.ShowClassViewData()
	res.render('admin/admin_showclass.ejs', {data:data})
}

exports.showExamView = async (req,res) => {
	data = await adminDataController.ShowExamViewData()
	res.render('admin/admin_showexam.ejs', {data:data})
}

exports.showResultView = async (req,res) => {
	var exam_index = req.query.exam_index

	// 시험이 지정되지 않았을 경우, 시험의 가장 첫번째 인덱스로 한다.
	if (exam_index == undefined) {
		exam_index = (await getData.allExamData())[0]["exam_index"]
	}
	data = await adminDataController.ShowResultViewData(exam_index)

	res.render('admin/admin_showresult.ejs', {data:data})
}

exports.adminMainView = async (req,res) => {
	res.render('admin/admin_main.ejs')
}

exports.studentMainView = async (req,res) => {
	data = {}

	user_id = req.session.user_id
	user_password = req.session.user_password
	user_index = (await getData.getUserIndexByIdPassword(user_id, user_password))[0]['user_index']
	
	nav_result_list = await studentDataController.NavSideViewData(user_index)
	data["nav_result_list"] = nav_result_list

	res.render('student/student_main.ejs', {data:data})
}

exports.studentReportView = async (req,res) => {
	data = {}

	user_id = req.session.user_id
	user_password = req.session.user_password
	user_index = (await getData.getUserIndexByIdPassword(user_id, user_password))[0]['user_index']

	console.log(user_index)

	// 사이드바
	nav_result_list = await studentDataController.NavSideViewData(user_index)
	data["nav_result_list"] = nav_result_list

	// 성적표 데이터
	result_index = req.query.result_index
	report_data = await studentDataController.ReportViewData(result_index)
	data["report_data"] = report_data

	res.render('student/student_report.ejs', {data:data})
}

exports.studentQuestionView = async (req,res) => {
	data = {}

	user_id = req.session.user_id
	user_password = req.session.user_password
	user_index = (await getData.getUserIndexByIdPassword(user_id, user_password))[0]['user_index']

	// 사이드바
	nav_result_list = await studentDataController.NavSideViewData(user_index)
	data["nav_result_list"] = nav_result_list

	question_answer_data = await getData.getQuestionDataByResultIndex(result_index)
	data["question_data"] = await studentDataController.QuestionViewData(result_index)

	if (question_answer_data.length == 0) {
		// 질문창 데이터
		res.render('student/student_question.ejs', {data:data})
	} else {
		// 질문 데이터
		data["answer_data"] = question_answer_data[0]
		res.render('student/student_answer.ejs', {data:data})
	}
}

exports.studentAnalysisView = async (req,res) => {
	var result_index = req.query.result_index
	var university_index = req.query.university_index
	
	user_id = req.session.user_id
	user_password = req.session.user_password
	var user_index = (await getData.getUserIndexByIdPassword(user_id, user_password))[0]['user_index']
	console.log("A")
	console.log(user_index)

	// 대학 정보
	data = await studentDataController.AnalysisViewData(result_index, university_index)

	// 시발 리절트 인덱스
	data["result_index"] = result_index

	// 사이드바
	console.log("B")
	console.log(user_index)
	nav_result_list = await studentDataController.NavSideViewData(user_index)
	data["nav_result_list"] = nav_result_list

	res.render('student/student_analysis.ejs', {data:data})
}

exports.mentorMainView = async (req,res) => {
	data = {}

	nav_exam_list = await mentorDataController.NavSideViewData()
	data["nav_exam_list"] = nav_exam_list

	res.render('mentor/mentor_main.ejs', {data:data})
}

exports.mentorQuestionTableView = async (req,res) => {
	data = {}

	exam_index = req.query.exam_index
	// 질문게시판 데이터
	question_data_list = await mentorDataController.QuestionTableViewData(exam_index)
	data["question_data_list"] = question_data_list

	// 사이드바 데이터
	nav_exam_list = await mentorDataController.NavSideViewData()
	data["nav_exam_list"] = nav_exam_list

	res.render('mentor/mentor_questiontable.ejs', {data:data})
}

exports.mentorAnswerView = async (req,res) => {
	data = {}

	question_index = req.query.question_index
	question_data, exam_name = await mentorDataController.AnswerViewData(question_index)
	data["question_data"] = question_data
	data["exam_name"] = exam_name

	// 사이드바 데이터
	nav_exam_list = await mentorDataController.NavSideViewData()
	data["nav_exam_list"] = nav_exam_list

	
	res.render('mentor/mentor_answer.ejs', {data:data})
}

exports.loginView = async (req,res) => {
	res.render('none_login.ejs')
}
