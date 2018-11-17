const getData = require('../model/getData')

exports.loginPage = async (req, res) => {
	res.render("loginPage.ejs")
}

exports.studentPage = async (req, res) => {
	user_index = req.session.user_index
	exam_index = req.query.exam_index
	result = await getData.joinResultExam(user_index)

	console.log(exam_index)

	if (exam_index != undefined) {
		for (var i in result) {
			if (result[i]["exam_index"] == exam_index) {
				select_result = result[i]
				break
			}
		}
		res.render("studentPage.ejs", {result : result, select_result : select_result})
	}
	else {
		console.log(JSON.parse(result[0]["result_result"]))
		res.render("studentPage.ejs", {result : result, select_result : result[0]})
	}
}

exports.mentorPage = async (req, res) => {
	res.render("mentorPage.ejs")
}

exports.adminPage = async (req, res) => {
	exam = await getData.getAllExam() 

	console.log(exam[0])

	res.render("adminPage/showExam.ejs", {exam : exam})
}

exports.adminPage_addExam = async (req, res) => {
	res.render("adminPage/addExam.ejs")
}

exports.adminPage_addUser = async (req, res) => {
	res.render("adminPage/addUser.ejs")
}

exports.adminPage_addResult = async (req, res) => {
	res.render("adminPage/addResult.ejs")
}

exports.adminPage_showUser = async (req, res) => {
	user = await getData.getAllUser() 

	console.log(user[0])

	res.render("adminPage/showUser.ejs", {user : user})
}

exports.adminPage_showResult = async (req, res) => {
	result = await getData.getAllResult()

	res.render("adminPage/showResult.ejs", {result : result, exam : exam})
}

exports.badErrorPage = async (req, res) => {
	res.render("badErrorPage.ejs")
}