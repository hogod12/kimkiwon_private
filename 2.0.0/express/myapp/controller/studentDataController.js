const timeModel = require ('../model/timeModel');
const curriculumDataModel = require ('../model/curriculumDataModel');
const yearDataModel = require ('../model/yearDataModel');
const resultDataModel = require ('../model/resultDataModel');
const lessonDataModel = require ('../model/lessonDataModel');
const classDataModel = require ('../model/classDataModel');
const examDataModel = require ('../model/examDataModel');
const userDataModel = require ('../model/userDataModel');
const questionDataModel = require ('../model/questionDataModel');

const multer = require ('multer');

exports.studentTopnavViewData = async (user_index) => {
	topnav_data = {};

	var user = (await userDataModel.getUserDataByUserIndex(user_index))[0];
	topnav_data["user_name"] = user["user_name"]

	return topnav_data;
}

exports.studentNavViewData = async (user_index) => {
	nav_data = {};

	// 현재 연도 산출
	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"];

	// 현재 연도에 해당하는 커리큘럼 정보만 받아옴
	var curriculum_list = await curriculumDataModel.getCurriculumDataByYearIndex(current_year_index);

	// 학생이 본 시험 정보 받아옴
	var result_list = await resultDataModel.getResultDataByUserIndex(user_index);

	for (var i = 0 ; i < curriculum_list.length ; i++) {
		curriculum_list[i]["result_list"] = new Array();
		console.log(curriculum_list[i]);
		for (var j = 0 ; j < result_list.length ; j++) {
			var lesson_index = result_list[j]["lesson_index"];
			var lesson = (await lessonDataModel.getLessonDataByLessonIndex(lesson_index))[0];
			var class_index = lesson["class_index"];
			var class_ = (await classDataModel.getClassDataByClassIndex(class_index))[0];
			var curriculum_index = class_["curriculum_index"];

			if (curriculum_index == curriculum_list[i]["curriculum_index"]) {
				result_list[j]["lesson_number"] = lesson["lesson_number"];
				curriculum_list[i]["result_list"][j] = result_list[j];
			}
		}
	}

	nav_data["curriculum_list"] = curriculum_list;

	return nav_data;
}

exports.studentMainViewData = async (user_index) => {
	var content_data = {};
	var result_flow = new Array();

	var result_list = await resultDataModel.getResultDataByUserIndex(user_index);
	var result_std_sum = 0;
	var result_count = 0;

	for (var i = 0 ; i < result_list.length ; i++) {
		var exam_index = result_list[i]["exam_index"];
		var exam = (await examDataModel.getExamDataByExamIndex(exam_index))[0];
		var exam_problem_score_parsed = JSON.parse(exam["exam_problem_score"]);
		var exam_problem_score_sum = exam_problem_score_parsed.reduce((a,b)=>parseInt(a)+parseInt(b));

		result_flow[i] = {};
		result_flow[i]["result_flow_label"] = exam["exam_name"];
		result_flow[i]["result_flow_std"] = result_list[i]["result_std"];
		result_flow[i]["result_flow_percentage"] = parseInt(100*result_list[i]["result_sum"]/exam_problem_score_sum);

		result_std_sum += result_list[i]["result_std"];
		result_count += 1;
	}
	content_data["result_flow"] = result_flow;
	content_data["result_std_average"] = result_std_sum/result_count;

	return content_data;
}

exports.studentResultViewData = async (result_index) => {
	var content_data = {};

	var result = (await resultDataModel.getResultDataByResultIndex(result_index))[0];
	var result_score_parsed = JSON.parse(result["result_score"]);
	result["result_score_parsed"] = result_score_parsed;

	var exam_index = result["exam_index"];
	var exam = (await examDataModel.getExamDataByExamIndex(exam_index))[0];

	var exam_problem_score_string = exam["exam_problem_score"];
	var exam_problem_score_parsed = JSON.parse(exam_problem_score_string);
	var exam_problem_score_sum = exam_problem_score_parsed.reduce((a,b)=>a+b);
	exam["exam_problem_score_sum"] = exam_problem_score_sum;

	var exam_problem_label_parsed = JSON.parse(exam["exam_problem_label"]);
	var exam_problem_desc_parsed = JSON.parse(exam["exam_problem_desc"]);
	exam["exam_problem_score_parsed"] = exam_problem_score_parsed;
	exam["exam_problem_label_parsed"] = exam_problem_label_parsed;
	exam["exam_problem_desc_parsed"] = exam_problem_desc_parsed;
	

	content_data["result"] = result;
	content_data["exam"] = exam;

	return content_data;
}

exports.studentQuestionViewData = async (result_index) => {
	console.log(result_index);
	var content_data = {};

	var matched_question = await questionDataModel.getQuestionDataByResultIndex(result_index);

	if (matched_question.length == 0) {
		// 질문데이터 없음 신규생성 진행
		console.log("NEW QUESTION");
		var result = await questionDataModel.addQuestion(result_index);
		console.log(result);
		var question = await questionDataModel.getQuestionDataByResultIndex(result_index);
		console.log(question);

		content_data["question"] = question;
		content_data["result_index"] = result_index;
		return content_data;
	}
	else if (matched_question.length == 1) {
		// 질문데이터 존재 바로 리턴
		console.log("EXISTED QUESTION");
		var question = matched_question[0];
		console.log(question);

		content_data["question"] = question;
		content_data["result_index"] = result_index;
		return content_data;
	}
	else {
		// 치명적 에러 - 여러 유저 존재
		console.log("QUESTIONS?");
	}
	
}

exports.updateQuestion = async (req, res) => {
	console.log(req.body);
	console.log(req.file);
	var result_index = req.body.result_index;
	var question_index;

	if (req.file == undefined) {
		var question = (await questionDataModel.getQuestionDataByResultIndex(result_index))[0];
		question_index = question["question_index"];
		const question_text = req.body.question_text;
		const question_date = await timeModel.timeStamp();

		console.log(question_index);
		console.log(question_text);
		console.log(question_date);

		var result = await questionDataModel.updateQuestionDataByQuestionIndex2(question_index, question_text, question_date);
		console.log(result);
	}
	else {
		var question = (await questionDataModel.getQuestionDataByResultIndex(result_index))[0];
		question_index = question["question_index"];
		const question_text = req.body.question_text;
		const question_image = (req.file.path).substring(15,);
		const question_date = await timeModel.timeStamp();

		console.log(question_index);
		console.log(question_text);
		console.log(question_image);
		console.log(question_date);

		var result = await questionDataModel.updateQuestionDataByQuestionIndex(question_index, question_text, question_image, question_date);
		console.log(result);
	}

	console.log(question_index);
	const updated_question = (await questionDataModel.getQuestionDataByQuestionIndex(question_index))[0];
	var result_index = updated_question["result_index"];

	res.redirect('question?result_index=' + String(result_index));
}