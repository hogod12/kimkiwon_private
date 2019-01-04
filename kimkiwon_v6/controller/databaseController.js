const addData = require('../model/database/addData')
const getData = require('../model/database/getData')
const statistic = require('../model/analysis/statistic')
const updateData = require('../model/database/updateData')
const deleteData = require('../model/database/deleteData')
const logging = require('../model/etc/logging')
const xlsx = require('xlsx')

// 유저
exports.studentSubmitQuestion = async (req, res) => {
	question_text = req.body.question
	result_index = req.query.result_index

	console.log(result_index)
	console.log(question_text)

	res.redirect("/student/")
}

// 관리자

// * 유저 추가

// 유저 추가 (개별)
exports.adminAddUserData = async (req, res) => {
	var user_name = req.body.user_name
	var user_school = req.body.user_school
	var user_phonenumber = req.body.user_phonenumber
	var user_authority = req.body.user_authority
	var user_password = req.body.user_phonenumber

	result = await addData.addUser(user_name, user_school, user_phonenumber, user_authority, user_password)

	res.redirect("/admin/adduser")
}

// 유저 추가 (단체)
exports.adminAddUserDataBulk = async (req, res) => {
	// 엑셀파일에서 유저 리스트 받아오기 
	const workbook = xlsx.readFile(req.file.path)
	const sheet_list = workbook.SheetNames
	user_list = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]])

	var success_count = 0
	var fail_count_dup = 0
	var fail_count_exist = 0

	for (var i in user_list) {
		var user_name = user_list[i]["이름"]
		var user_school = user_list[i]["학교"]
		var user_phonenumber = user_list[i]["전화번호"]
		var user_authority = 1 // 학교
		var user_password = user_list[i]["전화번호"]

		var user = await getData.getUserByInfo(user_name, user_phonenumber)

		if (user.length == 0) {
			result = await addData.addUser(user_name, user_school, user_phonenumber, user_authority, user_password)
			logging.writeTimestampLog("# 등록성공", `user_name : ${user_name} / user_phonenumber : ${user_phonenumber}`)
			success_count = success_count + 1
		}
		else if (user.length == 1) {
			logging.writeTimestampLog("# 이미 존재하는 유저", `user_name : ${user_name} / user_phonenumber : ${user_phonenumber}`)
			fail_count_exist = fail_count_exist + 1
		}
		else {
			logging.writeTimestampLog("! 중복 유저 발생", `user_name : ${user_name} / user_phonenumber : ${user_phonenumber}`)
			fail_count_dup = fail_count_dup + 1
		}
	}
	
	logging.writeTimestampLog("# 집계", `등록성공 : ${success_count} / 등록실패(존재하는 유저) : ${fail_count_exist} / 등록실패(중복 유저) : ${fail_count_dup}`)
	res.redirect("/admin/adduser")
}

// * 유저 현황

// 유저 수정
exports.adminUpdateUser = async (req, res) => {
	user_index = req.query.user_index
	user_school = req.body.user_school
	user_phonenumber = req.body.user_phonenumber
	user_authority = req.body.user_authority
	user_password = req.body.user_password

	result = await updateData.updateUser(user_index, user_school, user_phonenumber, user_authority, user_password)

	res.redirect('/admin/showuser')
}

// 유저 삭제
exports.adminDeleteUser = async (req, res) => {
	user_index = req.query.user_index

	result = await deleteData.deleteUser(user_index)

	res.redirect('/admin/showuser')
}

// * 시험 추가

// 시험 추가
exports.adminAddExamData = async (req, res) => {
	var exam_name = req.body.exam_name
	
	var exam_problem_label = req.body["exam_problem_label[]"]
	var exam_problem_mark = req.body["exam_problem_mark[]"]
	var exam_problem_desc = req.body["exam_problem_desc[]"]
	var exam_problem_num = exam_problem_mark.length

	var exam_problem_mark_int = new Array()

	for (var i in exam_problem_mark) {
		exam_problem_mark_int[i] = parseInt(exam_problem_mark[i])
	}

	var exam_result_distribution = Array(10).fill(0)
	var exam_result_std = 0
	var exam_result_avg = 0
	var exam_result_people = 0

	result = await addData.addExam(exam_name, 
		exam_problem_label, exam_problem_mark_int, exam_problem_desc, exam_problem_num, 
		exam_result_distribution, exam_result_std, exam_result_avg, exam_result_people)

	logging.writeTimestampLog("# 시험명", `${exam_name}`)
	logging.writeTimestampLog("# 문항", `${exam_problem_label}`)
	logging.writeTimestampLog("# 문항설명", `${exam_problem_desc}`)
	logging.writeTimestampLog("# 배점", `${exam_problem_mark}`)

	res.redirect("/admin/addexam")
}

// * 시험 현황

// 시험 정보 수정
exports.adminUpdateExam = async (req, res) => {

}

// 시험 정보 삭제
exports.adminDeleteExam = async (req, res) => {
	exam_index = req.query.exam_index

	result = await deleteData.deleteExam(exam_index)

	res.redirect('/admin/showexam')
}

// * 결과 추가

// 결과 정보 추가 (개별)
exports.adminAddResultData = async (req, res) => {
	exam_index = req.body.exam_index // 시험 인덱스
	user_index = req.body.user_index // 결과 유저 인덱스

	exam = await getData.getExamByIndex(exam_index)
	exam_problem_num = exam[0]["exam_problem_num"]

	result_score = Array(exam_problem_num).fill(0) // 결과 초기값

	result_tag = req.body.result_tag

	result_sum = 0 // 결과 합계 초기값 
	result_std = 0 // 결과 표준점수 초기값
	result_rank = 0 // 결과 등수 초기값

	result = await addData.addResult(user_index, exam_index, result_score, result_tag, result_sum, result_std, result_rank)

	exam_stat = await statistic.updateExamStat(exam_index)

	exam_result_people = exam_stat["exam_result_people"]
	exam_result_avg = exam_stat["exam_result_avg"]
	exam_result_std = exam_stat["exam_result_std"]
	exam_result_distribution = exam_stat["exam_result_distribution"]

	logging.writeTimestampLog("# 시험 통계 변경", 
		`exam_result_people : ${exam_result_people}, 
		exam_result_avg : ${exam_result_avg}, 
		exam_result_std : ${exam_result_std}, 
		exam_result_distribution : ${exam_result_distribution}`)

	result = await updateData.updateExamStat(
		exam_index,
		exam_result_people, 
		exam_result_avg, 
		exam_result_std, 
		exam_result_distribution )

	result_list = await getData.getResultByExam(exam_index)

	for (var i in result_list) {
		result_index = result_list[i]["result_index"]
		result_stat = await statistic.updateResultStat (result_index, exam_index)

		result = await updateData.updateResultStat(
			result_index,
			result_stat["result_sum"],
			result_stat["result_std"],
			result_stat["result_rank"])
	}

	res.redirect('/admin/addresult')
}

// 결과 정보 추가 (단체)
exports.adminAddResultDataBulk = async (req, res) => {
	exam_index = req.body.exam_index // 2. exam_index
	exam = await getData.getExamByIndex(exam_index)
	exam_problem_label = JSON.parse(exam[0]["exam_problem_label"])

	// 엑셀 파일에서 성적 리스트 받아오기
	workbook = xlsx.readFile(req.file.path)
	sheet_list = workbook.SheetNames
	result_list = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]])

	var result_tag = req.body.result_tag // 5. result_tag

	var result_score = new Array()
	// 엑셀에 입력된 모든 데이터에 대한 처리 진행
	for (var i in result_list) {
		var user_name = result_list[i]["이름"]
		var user_phonenumber = result_list[i]["전화번호"]
		
		var user = await getData.getUserByInfo(user_name, user_phonenumber)
		console.log(user[0])
		var user_index = user[0]["user_index"] // 1. user_index

		// 해당 유저가 해당 시험에 몇명이나 존재하는가?? => 0, 1명이어야 정상임
		var user_in_result = await getData.getResultByExamUser(exam_index, user_index)

		// 해당 유저가 정상적으로 1명 존재함 + 해당 유저의 결과가 해당 시험에 존재하지 않음
		if (user.length == 1 && user_in_result.length == 0) {
			// 3. result_score
			for (var j in exam_problem_label) {
				result_score[j] = result_list[i][exam_problem_label[j]] // 엑셀 시트의 문항별로 점수 받아옴
			}

			var result_sum = result_score.reduce((a,b) => a+b) // 6. result_sum
			var result_std = 0 // 7. result_std 초기값
			var result_rank = 0 // 8. result_rank 초기값

			result = await addData.addResult(user_index, exam_index, result_score, result_tag, result_sum, result_std, result_rank)
		}
		// 존재하지 않는 유저에 대한 성적입력이 시도됨
		else if (user.length == 0) {
			console.log("") // TODO
		}
		// 여러명의 유저가 검색됨
		else {
			console.log("") // TODO
		}
	}

	// 통계값 업데이트
	exam_stat = await statistic.updateExamStat(exam_index)

	exam_result_people = exam_stat["exam_result_people"]
	exam_result_avg = exam_stat["exam_result_avg"]
	exam_result_std = exam_stat["exam_result_std"]
	exam_result_distribution = exam_stat["exam_result_distribution"]

	logging.writeTimestampLog("# 시험 통계 변경", 
		`exam_result_people : ${exam_result_people}, 
		exam_result_avg : ${exam_result_avg}, 
		exam_result_std : ${exam_result_std}, 
		exam_result_distribution : ${exam_result_distribution}`)

	result = await updateData.updateExamStat(
		exam_index,
		exam_result_people, 
		exam_result_avg, 
		exam_result_std, 
		exam_result_distribution )

	result_list = await getData.getResultByExam(exam_index)

	for (var i in result_list) {
		result_index = result_list[i]["result_index"]
		result_stat = await statistic.updateResultStat (result_index, exam_index)

		result = await updateData.updateResultStat(
			result_index,
			result_stat["result_sum"],
			result_stat["result_std"],
			result_stat["result_rank"])
	}

	res.redirect('/admin/addresult')
}
