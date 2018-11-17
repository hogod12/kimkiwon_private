const getData = require('../model/getData')
const addData = require('../model/addData')
const updateData = require('../model/updateData')
const deleteData = require('../model/deleteData')
const xlsx = require('xlsx')

exports.addExam = async (req, res) => {
	exam_name = req.body.exam_name
	exam_problemcount = req.body.exam_problemcount
	exam_time = req.body.exam_time
	exam_desc = req.body.exam_desc
	exam_label = req.body.exam_label
	exam_score = req.body.exam_score
	exam_dist = JSON.stringify(Array(10).fill(0))
	result = await addData.addExam(exam_name, exam_problemcount, exam_time, exam_label, exam_score, exam_desc, exam_dist, 0, 0, 0)

	res.redirect("/adminPage")
}

exports.addUser = async (req, res) => {
	user_name = req.body.user_name
	user_school = req.body.user_school
	user_phonenumber = req.body.user_phonenumber
	user_authority = req.body.user_authority
	
	result = await addData.addUser(user_name, 1, user_authority, user_phonenumber, user_school, user_phonenumber)

	res.redirect("/adminPage_showUser")
}

exports.addUserExcel = async (req, res) => {
	console.log(req)
	console.log(req.file)

	workbook = xlsx.readFile(req.file.path)
	sheet_list = workbook.SheetNames
	user_list = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]])

	for (var i in user_list) {
		var user_name = user_list[i]["학생이름"]
		var user_school = user_list[i]["학교"]
		var user_phonenumber = user_list[i]["전화번호"]

		result = await getData.findUser(user_name, user_phonenumber)

		if (result.length == 0) {
			console.log(user_name)
			console.log(user_school)
			console.log(user_phonenumber)

			result = await addData.addUser(user_name, 1, 1, user_phonenumber, user_school, user_phonenumber)
		}
		else {
			console.log(`result length ${result.length}`)
		}
	}

	res.send(user_list)
}

exports.addResultExcel = async (req, res) => {
	console.log(req)
	console.log(req.file)

	exam_index = req.body.exam_index

	workbook = xlsx.readFile(req.file.path)
	sheet_list = workbook.SheetNames
	result_list = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]])
	result_result = new Array()

	exam = await getData.getExam(exam_index)

	var exam_problemcount = exam[0]["exam_problemcount"]
	var exam_label = JSON.parse(exam[0]["exam_label"])

	for (var i in result_list) {
		var user_name = result_list[i]["이름"] // 나중에 학생 이름으로 체크
		var user_school = result_list[i]["학교"]
		var user_phonenumber = result_list[i]["전화번호"]
		var result_std = result_list[i]["표준점수"]
		var result_rank = result_list[i]["등수"]

		var user = await getData.findUser(user_name, user_phonenumber)

		if (user.length == 1) {
			var user_index = user[0]["user_index"]
			// var result_result = result_list[i].slice(3,10)
			for (var j in exam_label) {
				result_result[j] = result_list[i][exam_label[j]]
			}

			console.log(user_index)
			console.log(user_name)
			console.log(user_school)
			console.log(user_phonenumber)
			console.log(exam_problemcount)
			console.log(exam_label)
			console.log(result_result)
			console.log(result_std)
			console.log(result_rank)

			result = await addData.addResult("temp", user_index, exam_index, JSON.stringify(result_result), result_std, result_rank)

			console.log(`${user_index} ${user_name} ${user_phonenumber} 성공`)
		}

		else if (user.length == 0) {
			console.log("없는사람임")
		}

		else {
			console.log("얘 왜 여러명임??")
		}
	}

	res.send(result_list)
}

exports.addResult = async (req, res) => {
	user_index = req.body.user_index
	exam_index = req.body.exam_index

	exam = await getData.getExam(exam_index)
	exam_problemcount = exam[0]["exam_problemcount"]

	result_result = Array(exam_problemcount).fill(0)
	result_result_json = JSON.stringify(result_result)

	result = await addData.addResult("temp", user_index, exam_index, result_result_json, 0, 0)
	res.redirect("/adminPage_showResult")
}

exports.updateExam = async (req, res) => {
	exam_index = req.body.exam_index
	exam_name = req.body.exam_name
	exam_problemcount = req.body.exam_problemcount
	exam_label = req.body.exam_label
	exam_score = req.body.exam_score
	exam_time = req.body.exam_time
	exam_desc = req.body.exam_desc
	exam_dist = req.body.exam_dist
	exam_people = req.body.exam_people
	exam_std = req.body.exam_std
	exam_avg = req.body.exam_avg
	result = await updateData.updateExam(exam_index, exam_name, exam_problemcount, exam_label, exam_score, exam_time, exam_desc, exam_dist, exam_people, exam_std, exam_avg)

	res.redirect("/adminPage")
}

exports.updateUser = async (req, res) => {
	user_index = req.body.user_index
	user_name = req.body.user_name
	user_school = req.body.user_school
	user_phonenumber = req.body.user_phonenumber
	user_authority = req.body.user_authority
	user_password = req.body.user_password
	result = await updateData.updateUser(user_index, user_name, user_school, user_phonenumber, user_authority, user_password)

	res.redirect("/adminPage_showUser")
}

exports.updateResult = async (req, res) => {
	result_index = req.body.result_index
	user_index = req.body.user_index
	exam_index = req.body.exam_index
	result_result = new Array()

	for (var i in req.body['score[]']) {
		result_result[i] = parseInt(req.body['score[]'][i])
	}

	console.log(JSON.stringify(result_result))

	res.redirect("/adminPage_showResult")
}

exports.deleteExam = async (req, res) => {
	exam_index = req.query.exam_index
	result = await deleteData.deleteExam(exam_index)
	res.redirect("/adminPage")
}

exports.deleteUser = async (req, res) => {
	user_index = req.query.user_index
	console.log(user_index)
	result = await deleteData.deleteUser(user_index)
	res.redirect("/adminPage_showUser")
}