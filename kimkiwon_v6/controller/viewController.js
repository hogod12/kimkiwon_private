const databaseController = require('./databaseController')
const getData = require('../model/database/getData')

// 1. 로그인 페이지 뷰

// 1.1. 로그인 페이지
exports.loginPage = async (req, res) => {
	res.render("login/login.ejs")
}

// 2. 유저 페이지 뷰

// 2.1. 메인 페이지
exports.studentPage = async (req, res) => {
	user_index = req.session.user_index
	selected_index = req.query.selected_index

	data = await getData.getExamResultByUser(user_index)

	res.render("student/main.ejs", {data : data, selected_index : selected_index})
}

// 2.2. 학생 성적표 페이지
exports.studentResultPage = async (req, res) => {
	user_index = req.session.user_index
	selected_result = req.query.selected_result

	data = await getData.getExamResultByUser(user_index, 
		["result_index", "result_score", "result_sum", "result_std", "result_rank",
		"exam_name", "exam_problem_label", "exam_problem_desc", "exam_problem_mark",
		"exam_result_distribution", "exam_result_people"])

	res.render("student/result.ejs", {data : data, selected_index : selected_result})
}

// 2.3. 질문 입력 페이지
exports.studentQuestionPage = async (req, res) => {
	var user_index = req.session.user_index
	var selected_result = req.query.selected_result

	var data = await getData.getExamResultByUser(user_index, ["result_index", "exam_name"])

	res.render("student/question.ejs", {data : data, selected_index : selected_result})
}

// 3. 멘토 페이지 뷰

// 3.1. 메인 페이지
exports.mentorPage = async (req, res) => {
	res.render("mentor/main.ejs")
}

// 3.2. 성적 입력 페이지
exports.mentorResultPage = async (req, res) => {
	res.render("mentor/result.ejs")
}

// 3.3. 답변 입력 페이지
exports.mentorAnswerPage = async (req, res) => {
	res.render("mentor/answer.ejs")
}

// 4. 관리자 페이지 뷰

// 4.1. 메인 페이지
exports.adminPage = async (req, res) => {
	res.render("admin/main.ejs")
}

// 4.2. 유저 추가 페이지
exports.adminAddUserPage = async (req, res) => {
	res.render("admin/adduser.ejs")
}

// 4.3. 유저 현황 페이지
exports.adminShowUserPage = async (req, res) => {
	var data = await getData.getAllUser(["user_index", "user_name", "user_school", "user_phonenumber", "user_authority", "user_password"])
	res.render("admin/showuser.ejs", {data : data})
}

// 4.4. 시험 추가 페이지
exports.adminAddExamPage = async (req, res) => {
	res.render("admin/addexam.ejs")
}

// 4.5. 시험 현황 페이지
exports.adminShowExamPage = async (req, res) => {
	var data = await getData.getAllExam(["exam_index", "exam_name", "exam_problem_label", "exam_problem_desc", "exam_problem_mark", "exam_problem_num"])
	res.render("admin/showexam.ejs", {data : data})
}

// 4.6. 성적 추가 페이지
exports.adminAddResultPage = async (req, res) => {
	var data = await getData.getAllExam(["exam_index", "exam_name"])
	res.render("admin/addresult.ejs", {data : data})
}

// 4.7. 성적 현황 페이지
exports.adminShowResultPage = async (req, res) => {
	res.render("admin/showresult.ejs")
}


