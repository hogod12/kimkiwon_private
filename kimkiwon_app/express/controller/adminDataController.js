const getData = require('../model/getData')
const addData = require('../model/addData')
const deleteData = require('../model/deleteData')
const etc = require('../model/etc/etc')
const log = require('../model/etc/log')
const xlsx = require('xlsx')
const math = require('../model/analysis/math')
const statistics = require('../model/analysis/statistics')
const updateData = require('../model/updateData')

exports.test = async (req,res) => {
	result = await getData.allUserData()
	console.log(result)
	res.send('김김김')
}

exports.AddUser = async (req,res) => {
	const user_name = req.body.user_name // 데이터 1 - 입력받음
	const user_school = req.body.user_school // 데이터 2 - 입력받음
	const user_phonenumber = req.body.user_phonenumber // 데이터 3 - 입력받음
	const user_authority = req.body.user_authority // 데이터 4 - 입력받음
	const user_id = user_name // 데이터 5
	const user_password = user_phonenumber // 데이터 6
	const user_date = await etc.TimeStamp()

	var result = await addData.AddUser(
		user_name, 
		user_school, 
		user_phonenumber, 
		user_authority, 
		user_id, 
		user_password, 
		user_date)

	log.Log('ADD USER DATA', `RESULT : ${result}`)

	res.redirect("adduser")
}

exports.DeleteUser = async (req,res) => {
	user_index = req.query.user_index
	var result = await deleteData.DeleteUser(user_index)

	log.Log('DELETE USER DATA', `RESULT : ${result}`)
	res.redirect("showuser")
}

exports.AddCurriculum = async (req,res) => {
	const curriculum_name = req.body.curriculum_name
	const curriculum_year = req.body.curriculum_year
	const curriculum_desc = req.body.curriculum_desc
	const curriculum_date = await etc.TimeStamp()

	var result = await addData.AddCurriculum(
		curriculum_name,
		curriculum_year,
		curriculum_desc,
		curriculum_date)

	log.Log('ADD CURRICULUM DATA', `RESULT : ${result}`)

	res.redirect("addcurriculum")
}

exports.AddClass = async (req,res) => {
	const curriculum_index = req.body.curriculum_index
	const class_schedule = req.body.class_schedule
	const class_year = req.body.class_year
	const class_date = await etc.TimeStamp()

	var result = await addData.AddClass(
		curriculum_index,
		class_schedule,
		class_year,
		class_date)

	log.Log('ADD CLASS DATA', `RESULT : ${result}`)

	res.redirect("addclass")
}

exports.AddAcceptance = async (req,res) => {
	const user_name = req.body.user_name
	const user_phonenumber = req.body.user_phonenumber
	var acceptance_index_1 = req.body.acceptance_index_1
	var acceptance_index_2 = req.body.acceptance_index_2
	var acceptance_index_3 = req.body.acceptance_index_3

	if (acceptance_index_1 == "") {
		acceptance_index_1 = -1
	}
	if (acceptance_index_2 == "") {
		acceptance_index_2 = -1
	}
	if (acceptance_index_3 == "") {
		acceptance_index_3 = -1
	}

	uesr_index = await getData.getUserIndexByUserNameUserPhonenumber(user_name, user_phonenumber)

	var result = await updateData.updateAcceptance(user_index, acceptance_index_1, acceptance_index_2, acceptance_index_3)
	log.Log('UPDATE ACCEPTANCE DATA', `RESULT : ${result}`)

	res.redirect('showuser')
}

exports.AddUserBulk = async (req,res) => {

	const workbook = xlsx.readFile(req.file.path)
	const sheet_list = workbook.SheetNames
	var user_list = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]])

	var success_counter = 0
	var fail_counter = 0
	for (var i=0 ; i<user_list.length ; i++) {
		const user_name = user_list[i]['학생명']
		const user_school = user_list[i]['학교명']
		const user_phonenumber = user_list[i]['부모핸드폰']
		
		var user_index = await getData.getUserIndexByNamePhonenumber(user_name, user_phonenumber)

		if (user_index.length == 0) {
			user_authority = 1
			user_id = user_name
			user_password = user_phonenumber
			user_date = await etc.TimeStamp()

			var result = await addData.AddUser(
				user_name, 
				user_school, 
				user_phonenumber, 
				user_authority, 
				user_id, 
				user_password, 
				user_date)

			log.Log('ADD USER DATA', `RESULT : ${result}`)
			success_counter = success_counter + 1
		} else if (user_index.length == 1) {
			log.Log('FAIL', 'EXISTED USER')
			fail_counter = fail_counter + 1
		} else {
			log.Log('ERROR', 'DUPLICATED USER')
			fail_counter = fail_counter + 1
		}
	}

	log.Log('SUMMARY', `SUCCESS : ${success_counter} / FAIL : ${fail_counter}`)

	res.redirect("adduser")
}

exports.AddResultBulk = async (req,res) => {
	const exam_index = req.body.exam_index
	const result_grader = req.body.mentor_index
	const result_class = req.body.result_class

	const workbook = xlsx.readFile(req.file.path)
	const sheet_list = workbook.SheetNames

	var exam_problem_label = JSON.parse((await getData.getExamProblemLabelByExamIndex(exam_index))[0]["exam_problem_label"])

	result_list = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]])
	// 학생단계

	var success_counter = 0
	var fail_counter = 0
	var update_counter = 0
	for (var i=0 ; i<result_list.length ; i++) {
		var user_name = result_list[i]["학생명"]
		var user_phonenumber = result_list[i]["부모핸드폰"]
		
		// 결과점수
		var result_score = new Array()
		for (var j=0 ; j<exam_problem_label.length ; j++) {
			result_score[j] = result_list[i][exam_problem_label[j]]
		}
		result_sum_ = await math.ArraySum(result_score)
		result_score_string = JSON.stringify(result_score)

		const result_date = await etc.TimeStamp()
		var user_index = await getData.getUserIndexByNamePhonenumber(user_name, user_phonenumber)

		if (user_index.length == 1) {
			// 일치하는 유저가 1명 검색됨
			user_index = user_index[0]["user_index"] // 한명의 유저 인덱스 추출
			var is_exist_result = await getData.getResultIndexByUserIndexExamIndex(user_index, exam_index) // 해당 유저, 시험에 해당하는 결과값 탐색

			// 신규 성적입력 - 검색된 시험값이 없음
			if (is_exist_result.length == 0) {
				// 새로 등록
				var result = await addData.AddResult(
					user_index,
					exam_index,
					result_score_string,
					result_date,
					result_class,
					result_grader,
					result_sum_, // 배점보다 점수합이 이상한 등 오류가 발생시 예외처리
					0) // 마지막 랭크값 모든 입력이 마감된 직후 업데이트 진행

				log.Log('SUCCESS', 'ADD RESULT')
				success_counter = success_counter + 1
			} 

			// 기존 성적 업데이트 - 검색된 시험값이 1개 존재
			else if (is_exist_result.length == 1) {
				// 성적 업데이트
				result_index = is_exist_result[0]['result_index']
				var result = await updateData.updateResult(
					result_index, 
					result_score_string,
					result_sum_)

				log.Log('SUCCESS', 'EXISTED RESULT UPDATE RESULT')
				update_counter = update_counter + 1
			} 

			// 성적 중복 오류
			else {
				log.Log('ERROR', 'DUPLICATED RESULT')
				fail_counter = fail_counter + 1
			}

		} else if (user_index.length == 0) {
			// 유저 정보가 존재하지 않음
			log.Log('FAIL', 'USER_INDEX IS NOT EXIST')
			fail_counter = fail_counter + 1
		} else {
			// 에러
			log.Log('ERROR', 'UNHANDLED VALUE')
			fail_counter = fail_counter + 1
		}
	}

	log.Log('ADD RESULT ENDED', `success_counter : ${success_counter} / update_counter : ${update_counter} / fail_counter : ${fail_counter}`)

	// 해당 시험의 데이터 테이블에 변동이 존재할 경우
	if (success_counter != 0 || update_counter != 0) {
		result = await statistics.updateResultRank(exam_index)
		log.Log('UPDATE RESULT RANK', `RESULT : ${result}`)
		result = await statistics.updateExamStatistics(exam_index)
		log.Log('UPDATE EXAM STATISTICS', `RESULT : ${result}`)
	}
	else {
		log.Log('SKIP UPDATE RESULT RANK', 'ENDED')
	}

	res.redirect("addresult")
}

exports.AddExam = async (req,res) => {
	const curriculum_index = req.body.curriculum_index
	const exam_name = req.body.exam_name
	const exam_type = req.body.exam_type
	const exam_category_label = req.body.exam_category_label
	const exam_problem_label = req.body["exam_problem_label[]"]
	const exam_problem_mark = req.body["exam_problem_mark[]"]
	const exam_problem_desc = req.body["exam_problem_desc[]"]
	const exam_problem_num = exam_problem_mark.length
	const exam_result_dist = 0
	const exam_result_std = 0
	const exam_result_avg = 0
	const exam_result_people = 0
	const exam_date = await etc.TimeStamp()

	var exam_problem_mark_int = new Array()
	for (var i=0 ; i<exam_problem_num ; i++) {
		exam_problem_mark_int[i] = parseInt(exam_problem_mark[i])
	}

	var result = await addData.AddExam(
		curriculum_index,
		exam_name,
		exam_type,
		exam_category_label,
		exam_problem_num,
		JSON.stringify(exam_problem_label),
		JSON.stringify(exam_problem_mark),
		JSON.stringify(exam_problem_desc),
		exam_result_dist,
		exam_result_std,
		exam_result_avg,
		exam_result_people,
		exam_date)
	
	log.Log('ADD DATA', `RESULT : ${result}`)

	res.redirect("addexam")
}

exports.AddUniversity = async (req,res) => {
	const university_name = req.body.university_name
	const university_department = req.body.university_department
	const university_year = req.body.university_year
	const university_limit = req.body.university_limit
	const university_category_label = req.body.university_category_label
	const university_score = req.body.university_score
	const university_date = await etc.TimeStamp()

	var result = await addData.AddUniversity (
		university_name,
		university_department,
		university_year,
		university_limit,
		university_category_label,
		university_score,
		university_date)

	log.Log('ADD DATA', `RESULT : ${result}`)

	res.redirect("adduniversity")
}

exports.AddClassViewData = async () => {
	data = {}

	year = 2019
	curriculum_data = await getData.allCurriculumData(year)
	
	var curriculum_list = new Array()
	for (var i=0 ; i<curriculum_data.length ; i++) {
		curriculum_list[i] = 
			{curriculum_index : curriculum_data[i]['curriculum_index'],
			curriculum_name : curriculum_data[i]['curriculum_name'],
			curriculum_year : curriculum_data[i]['curriculum_year']}
	}

	data['curriculum_list'] = curriculum_list
	
	return data
}

exports.AddExamViewData = async () => {
	data = {}

	year = 2019
	curriculum_data = await getData.allCurriculumData()
	
	var curriculum_list = new Array()
	for (var i=0 ; i<curriculum_data.length ; i++) {
		curriculum_list[i] = 
			{curriculum_index : curriculum_data[i]['curriculum_index'],
			curriculum_name : curriculum_data[i]['curriculum_name'],
			curriculum_year : curriculum_data[i]['curriculum_year']}
	}

	data['curriculum_list'] = curriculum_list
	
	return data
}

exports.AddResultViewData = async () => {
	data = {}

	// 시험 리스트
	exam_data = await getData.allExamData()
	var exam_list = new Array()
	for (var i=0 ; i<exam_data.length ; i++) {
		var exam_year = (await getData.getCurriculumYearByIndex(exam_data[i]['curriculum_index']))[0]['curriculum_year']
		
		exam_list[i] =
			{exam_index : exam_data[i]['exam_index'],
			exam_name : exam_data[i]['exam_name'],
			exam_year : exam_year}
	}

	// 멘토 리스트
	mentor_data = await getData.getUserDataByAuthority(2)
	var mentor_list = new Array()
	for (var i=0 ; i<mentor_data.length ; i++) {
		mentor_list[i] =
			{user_index : mentor_data[i]['user_index'],
			user_name : mentor_data[i]['user_name']}
	}

	// 반 리스트
	class_data = await getData.allClassData()
	var class_list = new Array()
	for (var i=0 ; i<class_data.length ; i++) {
		curriculum_name = (await getData.getCurriculumNameByIndex(class_data[i]['curriculum_index']))[0]["curriculum_name"]

		class_list[i] = 
			{class_index : class_data[i]['class_index'],
			class_year : class_data[i]['class_year'],
			class_schedule : class_data[i]['class_schedule'],
			curriculum_name : curriculum_name}
	}

	data['exam_list'] = exam_list
	data['mentor_list'] = mentor_list
	data['class_list'] = class_list

	return data
}

exports.AddAcceptanceViewData = async(user_index) => {
	user_data = (await getData.getUserDataByIndex(user_index))[0]
	university_list = await getData.allUniversityData()

	university_data_1 = await getData.getUniversityDataByUniversityIndex(user_data["acceptance_index_1"])
	university_data_2 = await getData.getUniversityDataByUniversityIndex(user_data["acceptance_index_2"])
	university_data_3 = await getData.getUniversityDataByUniversityIndex(user_data["acceptance_index_3"])

	// 선택대학 1
	if (university_data_1.length == 0) {
		university_data_selected_1 = {
			university_name : "미선택",
			university_department : ""
		}
	} else if (university_data_1.length == 1) {
		university_data_selected_1 = {
			university_year : university_data_1[0]["university_year"],
			university_name : university_data_1[0]["university_name"],
			university_department : university_data_1[0]["university_department"]
		}
	} else {
		log.Log('ERROR', `DUPLICATED ACCEPTANCE DATA`)
	}

	// 선택대학 2
	if (university_data_2.length == 0) {
		university_data_selected_2 = {
			university_name : "미선택",
			university_department : ""
		}
	} else if (university_data_2.length == 1) {
		university_data_selected_2 = {
			university_year : university_data_2[0]["university_year"],
			university_name : university_data_2[0]["university_name"],
			university_department : university_data_2[0]["university_department"]
		}
	} else {
		log.Log('ERROR', `DUPLICATED ACCEPTANCE DATA`)
	}

	// 선택대학 3
	if (university_data_3.length == 0) {
		university_data_selected_3 = {
			university_name : "미선택",
			university_department : ""
		}
	} else if (university_data_3.length == 1) {
		university_data_selected_3 = {
			university_year : university_data_3[0]["university_year"],
			university_name : university_data_3[0]["university_name"],
			university_department : university_data_3[0]["university_department"]
		}
	} else {
		log.Log('ERROR', `DUPLICATED ACCEPTANCE DATA`)
	}

	data = {
		user_name : user_data["user_name"],
		user_school : user_data["user_school"],
		user_phonenumber : user_data["user_phonenumber"],
		acceptance_index_1 : user_data["acceptance_index_1"],
		acceptance_index_2 : user_data["acceptance_index_2"],
		acceptance_index_3 : user_data["acceptance_index_3"],
		university_list : university_list,
		university_data_selected_1 : university_data_selected_1,
		university_data_selected_2 : university_data_selected_2,
		university_data_selected_3 : university_data_selected_3
	}

	return data
}

exports.ShowUserViewData = async () => {
	data = {}

	// 유저 명단
	user_list = await getData.allUserData()

	data['user_list'] = user_list

	return data
}

exports.ShowCurriculumViewData = async () => {
	data = {}

	// 커리큘럼
	curriculum_list = await getData.allCurriculumData()

	data['curriculum_list'] = curriculum_list

	return data
}

exports.ShowClassViewData = async () => {
	data = {}

	// 반
	class_data = await getData.allClassData()

	var class_list = new Array()
	for (var i=0 ; i<class_data.length ; i++) {
		// 검색안될시 에러핸들링 진행
		curriculum_name = (await getData.getCurriculumNameByIndex(class_data[i]["curriculum_index"]))[0]["curriculum_name"]
		class_list[i] = {
			class_index : class_data[i]["class_index"],
			curriculum_name : curriculum_name,
			class_schedule : class_data[i]["class_schedule"],
			class_year : class_data[i]["class_year"],
			class_date : class_data[i]["class_date"]
		}
	}

	data['class_list'] = class_list

	return data
}

exports.ShowExamViewData = async () => {
	data = {}

	// 시험
	exam_data = await getData.allExamData()

	var exam_list = new Array()
	for (var i=0 ; i<exam_data.length ; i++) {
		curriculum_name = (await getData.getCurriculumNameByIndex(exam_data[i]["curriculum_index"]))[0]["curriculum_name"]
		exam_list[i] = {
			exam_index : exam_data[i]["exam_index"],
			curriculum_name : curriculum_name,
			exam_name : exam_data[i]["exam_name"],
			exam_type : exam_data[i]["exam_type"], // 1:겨울특강 2:정규반 양식으로 교체
			exam_category_1 : exam_data[i]["exam_category_1"], // 마찬가지 얘도 바꿔줘야함
			exam_result_people : exam_data[i]["exam_result_people"],
			exam_result_avg : exam_data[i]["exam_result_avg"],
			exam_date : exam_data[i]["exam_date"]
		}
	}

	data['exam_list'] = exam_list

	return data
}

exports.ShowResultViewData = async (exam_index) => {
	data = {}

	// 결과
	result_data = await getData.getResultDataByExamIndex(exam_index)
	cur_exam_name = (await getData.getExamNameByExamIndex(exam_index))[0]["exam_name"]
	exam_data = await getData.allExamData()

	// 성적 데이터
	var result_list = new Array()
	for (var i=0 ; i<result_data.length ; i++) {
		user_data = (await getData.getUserDataByUserIndex(result_data[i]["user_index"]))[0]

		// 유저가 삭제되었을 경우
		if (user_data == undefined) {
			continue;
		}

		// 중복인원체크
		result_list[i] = {
			result_index : result_data[i]["result_index"],
			user_name : user_data["user_name"],
			user_phonenumber : user_data["user_phonenumber"],
			user_school : user_data["user_school"],
			result_sum : result_data[i]["result_sum"],
			result_date : result_data[i]["result_date"]
		}
	}

	// 시험 데이터
	var exam_list = new Array()
	for (var i=0 ; i<exam_data.length ; i++) {
		exam_year = (await getData.getCurriculumYearByIndex(exam_data[i]["curriculum_index"]))[0]["curriculum_year"]
		exam_list[i] = {
			exam_index : exam_data[i]["exam_index"],
			exam_name : exam_data[i]["exam_name"],
			exam_year : exam_year
		}
	}

	data['exam_list'] = exam_list
	data['result_list'] = result_list
	data['cur_exam_name'] = cur_exam_name

	return data
}
