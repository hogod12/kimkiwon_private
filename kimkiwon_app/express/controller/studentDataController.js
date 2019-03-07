const getData = require('../model/getData')
const addData = require('../model/addData')
const etc = require('../model/etc/etc')
const log = require('../model/etc/log')
const xlsx = require('xlsx')
const math = require('../model/analysis/math')
const statistics = require('../model/analysis/statistics')
const updateData = require('../model/updateData')

exports.AddQuestion = async (req,res) => {
	exam_name = req.body.exam_name
	question_text = req.body.question_text // 1

	user_id = req.session.user_id
	user_password = req.session.user_password
	user_index = (await getData.getUserIndexByIdPassword(user_id, user_password))[0]['user_index']

	exam_index = (await getData.getExamIndexByExamName(exam_name))[0]["exam_index"]

	result_data = (await getData.getResultDataByExamIndexUserIndex(exam_index, user_index))[0]

	questioner_index = user_index // 2
	answerer_index = result_data["result_grader"] // 3
	result_index = result_data["result_index"] // 4
	question_type = 1 // 5
	question_date_time = await etc.TimeStamp() // 6

	result = await addData.AddQuestion(
		questioner_index,
		answerer_index,
		result_index,
		question_type,
		question_text,
		question_date_time)

	res.redirect("/")
}

exports.NavSideViewData = async (user_index) => {
	result_data = await getData.getResultDataByUserIndex(user_index)

	nav_result_list = new Array()
	for (var i=0 ; i<result_data.length ; i++) {
		exam_name = (await getData.getExamNameByExamIndex(result_data[i]["exam_index"]))[0]["exam_name"]
		nav_result_list[i] = {
			result_index : result_data[i]["result_index"],
			exam_name : exam_name
		}
	}

	return nav_result_list
}

exports.ReportViewData = async (result_index) => {
	result_data = (await getData.getResultDataByResultIndex(result_index))[0]

	exam_index = (await getData.getExamIndexByResultIndex(result_index))[0]["exam_index"]
	exam_data = (await getData.getExamDataByExamIndex(exam_index))[0]

	exam_problem_mark_sum = await math.StringArraySum(JSON.parse(exam_data["exam_problem_mark"]))	

	result_std_score = 100 + (result_data["result_sum"] - exam_data["exam_result_avg"])*20/(exam_data["exam_result_std"] + 0.0000000000001)

	report_data = {
		result_index : result_index,
		result_score : JSON.parse(result_data["result_score"]),
		result_sum : result_data["result_sum"],
		result_rank : result_data["result_rank"],
		exam_name : exam_data["exam_name"],
		exam_type : exam_data["exam_type"],
		exam_category_1 : exam_data["exam_category_1"],
		exam_problem_num : exam_data["exam_problem_num"],
		exam_problem_label : JSON.parse(exam_data["exam_problem_label"]),
		exam_problem_desc : JSON.parse(exam_data["exam_problem_desc"]),
		exam_problem_mark : JSON.parse(exam_data["exam_problem_mark"]),
		exam_problem_mark_sum : exam_problem_mark_sum,
		exam_result_dist : JSON.parse(exam_data["exam_result_dist"]),
		exam_result_std : exam_data["exam_result_std"],
		exam_result_avg : exam_data["exam_result_avg"],
		exam_result_people : exam_data["exam_result_people"],
		result_std_score : result_std_score
	}

	return report_data
}

exports.QuestionViewData = async (result_index) => {
	result_data = (await getData.getResultDataByResultIndex(result_index))[0]
	exam_index = (await getData.getExamIndexByResultIndex(result_index))[0]["exam_index"]
	exam_name = (await getData.getExamNameByExamIndex(exam_index))[0]["exam_name"]

	question_data = {
		result_index : result_index,
		exam_index : exam_index,
		exam_name : exam_name
	}

	return question_data
}

exports.AnalysisViewData = async (result_index, university_index) => {
	data = {}

	// 대학 리스트받아오기
	university_list = await getData.allUniversityData()
	data["university_list"] = university_list

	// 초기 화면 만약 대학인덱스가 입력되지 않은 경우
	if (university_index == undefined) {
		university_category_label = data["university_list"][0]["university_category_label"]
		university_data = await getData.getUniversityDataByUniversityIndex(data["university_list"][0]["university_index"])
	} else {
		university_category_label = (await getData.getUniversityDataByUniversityIndex(university_index))[0]["university_category_label"]
		university_data = await getData.getUniversityDataByUniversityIndex(university_index)
	}

	// 시험분류라벨
	result_data = (await getData.getResultDataByResultIndex(result_index))[0]
	exam_index = result_data["exam_index"]
	user_result_sum = result_data["result_sum"]
	exam_category_label = (await getData.getExamDataByExamIndex(exam_index))[0]["exam_category_label"]

	var result_sum_list = new Array()

	var count = 0;
	var sum = 0;
	var max = 0;
	var min = 1000;

	exam_data = await getData.getExamDataByExamCategoryLabel(exam_category_label)
	for (var i=0 ; i < exam_data.length ; i++) {
		// 시험 응시년도가 2019년보다 작아야함(과거 데이터)
		curriculum_year = (await getData.getCurriculumYearByIndex(exam_data[i]["curriculum_index"]))[0]["curriculum_year"]
		if (parseInt(curriculum_year) < 2019) {
			var exam_index = exam_data[i]["exam_index"]
			result_data_list = await getData.getResultDataByExamIndex(exam_index)

			for (var j=0 ; j<result_data_list.length ; j++) {
				result_sum = result_data_list[j]["result_sum"]
				user_index = result_data_list[j]["user_index"]

				user_data = (await getData.getUserDataByIndex(user_index))[0]

				acceptance_index_1 = user_data["acceptance_index_1"]
				acceptance_index_2 = user_data["acceptance_index_2"]
				acceptance_index_3 = user_data["acceptance_index_3"]




				acceptance_university_category_label = await getData.getUniversityCategoryLabelByUniversityIndex(acceptance_index_1)

				if (acceptance_university_category_label.length != 0) {
					if (acceptance_university_category_label[0]["university_category_label"] == university_category_label) {
						count = count + 1
						sum = sum+result_sum

						if (max < result_sum) {
							max = result_sum 
						}

						if (min > result_sum) {
							min = result_sum
						}
					} 
				}
				
				acceptance_university_category_label = await getData.getUniversityCategoryLabelByUniversityIndex(acceptance_index_2)

				if (acceptance_university_category_label.length != 0) {
					if (acceptance_university_category_label[0]["university_category_label"] == university_category_label) {
						count = count + 1
						sum = sum+result_sum

						if (max < result_sum) {
							max = result_sum 
						}

						if (min > result_sum) {
							min = result_sum
						}
					}
				}

				acceptance_university_category_label = await getData.getUniversityCategoryLabelByUniversityIndex(acceptance_index_3)

				if (acceptance_university_category_label.length != 0) {
					if ((await getData.getUniversityCategoryLabelByUniversityIndex(acceptance_index_3))[0]["university_category_label"] == university_category_label) {
						count = count + 1
						sum = sum+result_sum

						if (max < result_sum) {
							max = result_sum 
						}

						if (min > result_sum) {
							min = result_sum
						}
					}
				}
			}
		}
	}

	if (count == 0) {
		data["university_statistics"] = {
			count : count,
			university_name : university_data[0]["university_name"],
			university_department : university_data[0]["university_department"],
			result_sum : user_result_sum,
			average : 0,
			max : 0,
			min : 0
		}
	} else {
		data["university_statistics"] = {
			count : count,
			university_name : university_data[0]["university_name"],
			university_department : university_data[0]["university_department"],
			result_sum : user_result_sum,
			average : sum/count,
			max : max,
			min : min
		}
	}

	return data
}