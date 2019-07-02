const userDataModel = require ('../model/userDataModel');
const classDataModel = require ('../model/classDataModel');
const lessonDataModel = require ('../model/lessonDataModel');
const questionDataModel = require ('../model/questionDataModel');
const resultDataModel = require ('../model/resultDataModel');
const timeModel = require ('../model/timeModel');

exports.mentorTopnavViewData = async (user_index) => {
	topnav_data = {};

	var user = (await userDataModel.getUserDataByUserIndex(user_index))[0];
	console.log(user);
	topnav_data["user_name"] = user["user_name"];

	return topnav_data;
}

exports.mentorNavViewData = async (user_index) => {
	nav_data = {};

	var mentor_index = user_index;
	var class_state = 1;

	var class_list = await classDataModel.getClassDataByMentorIndexClassState(mentor_index, class_state);
	console.log(class_list);

	for (var i = 0 ; i < class_list.length ; i++) {
		var class_index = class_list[i]["class_index"];
		var lesson_list = await lessonDataModel.getLessonDataByClassIndex(class_index);
		console.log(lesson_list);

		class_list[i]["lesson_list"] = lesson_list;
	}

	nav_data["class_list"] = class_list;

	return nav_data;
}

exports.mentorMainViewData = async (mentor_index) => {
	content_data = {};

	var answered_question_list = new Array();
	var non_answered_question_list = new Array();
	var matched_question = await questionDataModel.getQuestionData();

	var answered_number = 0;
	var non_answered_number = 0;

	for (var i = 0 ; i < matched_question.length ; i++) {
		var result_index = matched_question[i]["result_index"];
		var result = (await resultDataModel.getResultDataByResultIndex(result_index))[0];

		if (result["result_grader"] == mentor_index) {
			console.log("꿀");
			console.log(matched_question[i]);

			if (matched_question[i]["answer_text"] == null) {
				// 미응답
				var question = matched_question[i];
				var lesson_index = result["lesson_index"];
				var lesson = (await lessonDataModel.getLessonDataByLessonIndex(lesson_index))[0];
				var class_index = lesson["class_index"];
				var class_ = (await classDataModel.getClassDataByClassIndex(class_index))[0];

				var user_index = result["user_index"];
				var user = (await userDataModel.getUserDataByUserIndex(user_index))[0]
				var user_information = user["user_name"] + " (" + user["school_name"] + ")"

				question["lesson_number"] = lesson["lesson_number"];
				question["class_name"] = class_["class_name"];
				question["user_information"] = user_information;

				non_answered_question_list[non_answered_number] = question;
				non_answered_number++;
			}
			else {
				// 응답
				var question = matched_question[i];

				answered_question_list[answered_number] = question;
				answered_number++;
			}
			
		}	
	}

	content_data["answered_question_list"] = answered_question_list;
	content_data["non_answered_question_list"] = non_answered_question_list;

	content_data["answered_number"] = answered_number;
	content_data["non_answered_number"] = non_answered_number;

	return content_data;
}

exports.mentorShowQuestionViewData = async (mentor_index, lesson_index) => {
	content_data = {};

	var answered_question_list = new Array();
	var non_answered_question_list = new Array();
	var matched_question = await questionDataModel.getQuestionData();

	var answered_number = 0;
	var non_answered_number = 0;

	for (var i = 0 ; i < matched_question.length ; i++) {
		var result_index = matched_question[i]["result_index"];
		var result = (await resultDataModel.getResultDataByResultIndex(result_index))[0];

		if (result["result_grader"] == mentor_index && result["lesson_index"] == lesson_index) {
			console.log("꿀");
			console.log(matched_question[i]);

			if (matched_question[i]["answer_text"] == null) {
				// 미응답
				var question = matched_question[i];
				var lesson_index = result["lesson_index"];
				var lesson = (await lessonDataModel.getLessonDataByLessonIndex(lesson_index))[0];
				var class_index = lesson["class_index"];
				var class_ = (await classDataModel.getClassDataByClassIndex(class_index))[0];

				var user_index = result["user_index"];
				var user = (await userDataModel.getUserDataByUserIndex(user_index))[0]
				var user_information = user["user_name"] + " (" + user["school_name"] + ")"

				question["lesson_number"] = lesson["lesson_number"];
				question["class_name"] = class_["class_name"];
				question["user_information"] = user_information;

				non_answered_question_list[non_answered_number] = question;
				non_answered_number++;
			}
			else {
				// 응답
				var question = matched_question[i];
				var lesson_index = result["lesson_index"];
				var lesson = (await lessonDataModel.getLessonDataByLessonIndex(lesson_index))[0];
				var class_index = lesson["class_index"];
				var class_ = (await classDataModel.getClassDataByClassIndex(class_index))[0];

				var user_index = result["user_index"];
				var user = (await userDataModel.getUserDataByUserIndex(user_index))[0]
				var user_information = user["user_name"] + " (" + user["school_name"] + ")"

				question["lesson_number"] = lesson["lesson_number"];
				question["class_name"] = class_["class_name"];
				question["user_information"] = user_information;

				answered_question_list[answered_number] = question;
				answered_number++;
			}
			
		}	
	}

	content_data["answered_question_list"] = answered_question_list;
	content_data["non_answered_question_list"] = non_answered_question_list;

	content_data["answered_number"] = answered_number;
	content_data["non_answered_number"] = non_answered_number;

	return content_data;
}

exports.mentorAnswerViewData = async (question_index) => {
	content_data = {};

	var question = (await questionDataModel.getQuestionDataByQuestionIndex(question_index))[0];
	content_data["question"] = question;

	return content_data;
}

exports.updateAnswer = async (req, res) => {
	var question_index = parseInt(req.body.question_index)
	var answer_text = req.body.answer_text;
	var answer_date = await timeModel.timeStamp();

	console.log(question_index);
	console.log(answer_text);
	console.log(answer_date);

	var result = await questionDataModel.updateQuestionDataByQuestionIndex3(question_index, answer_text, answer_date);
	console.log(result);

	res.redirect('answer?question_index=' + String(question_index));
}