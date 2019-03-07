const getData = require('../model/getData')
const addData = require('../model/addData')
const updateData = require('../model/updateData')

exports.NavSideViewData = async () => {
	exam_data = await getData.allExamData()

	nav_exam_list = new Array()
	for (var i=0 ; i<exam_data.length ; i++) {
		nav_exam_list[i] = {
			exam_index : exam_data[i]["exam_index"],
			exam_name : exam_data[i]["exam_name"]
		}
	}

	return nav_exam_list
}

exports.QuestionTableViewData = async (exam_index) => {
	result_data = await getData.getResultDataByExamIndex(exam_index)

	question_data_list = new Array()
	for (var i=0 ; i<result_data.length ; i++) {
		result_index = result_data[i]["result_index"]
		question_data = await getData.getQuestionDataByResultIndex(result_index)
		
		if (question_data.length != 0) {
			if (question_data[0]["answer_text"] == null) {
				is_answer = "x"
			} else {
				is_answer = "o"
			}
			questioner_data = await getData.getUserDataByUserIndex(question_data[0]["questioner_index"])
			question_data_list[i] = {
				question_index : question_data[0]["question_index"],
				questioner_name : questioner_data[0]["user_name"],
				questioner_school : questioner_data[0]["user_school"],
				question_date_time : question_data[0]["question_date_time"],
				is_answer : is_answer
			}
		}
	}

	return question_data_list
}

exports.AnswerViewData = async (question_index) => {
	question_data = (await getData.getQuestionDataByQuestionIndex(question_index))[0]

	result_index = question_data["result_index"]
	result_data = await getData.getResultDataByResultIndex(result_index)

	exam_name = (await getData.getExamNameByExamIndex(result_data[0]["exam_index"]))[0]["exam_name"]

	return question_data, exam_name
}

exports.UpdateAnswer = async (req,res) => {
	exam_name = req.body.exam_name
	result_index = req.body.result_index
	question_index = req.body.question_index
	answer_text = req.body.answer_text

	console.log(question_index)
	console.log(answer_text)

	result = await updateData.updateQuestion(question_index, answer_text)

	res.redirect("/")
}