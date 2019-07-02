const timeModel = require('../model/timeModel');
const curriculumDataModel = require('../model/curriculumDataModel');
const yearDataModel = require('../model/yearDataModel');
const examDataModel = require('../model/examDataModel');
const classDataModel = require('../model/classDataModel');
const userDataModel = require('../model/userDataModel');
const lessonDataModel = require('../model/lessonDataModel');
const resultDataModel = require('../model/resultDataModel');
const universityDataModel = require('../model/universityDataModel');
const xlsx = require('xlsx');
const math = require('mathjs');

exports.showCurriculumDomainViewData = async () => {
	var curriculum_domain_list = await curriculumDataModel.getCurriculumDomainData();
	return curriculum_domain_list;
}

exports.systemSettingViewData = async () => {
	var data = {}
	
	var year_list = await yearDataModel.getYearData();
	var current_year = "설정 연도 없음"

	for (var i = 0 ; i < year_list.length ; i++) {
		if (year_list[i]['year_state'] == 1) {
			current_year = year_list[i]["year_name"];
		}
	}

	data["year_list"] = year_list;
	data["current_year"] = current_year;

	return data;
}

// ===========================================================

exports.showLessonViewData = async (req, res) => {
	var data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"];

	var lesson_list = await lessonDataModel.getLessonDataByLessonYear(current_year_index);
	// var lesson_list = await lessonDataModel.getLessonData();

	for (var i = 0 ; i < lesson_list.length ; i++) {
		console.log(lesson_list[i]);
		
		var class_index = lesson_list[i]['class_index'];
		var exam_index = lesson_list[i]['exam_index'];
		
		var class_ = (await classDataModel.getClassDataByClassIndex(class_index))[0];
		var exam = (await examDataModel.getExamDataByExamIndex(exam_index))[0];

		if (class_ == undefined) {
			var class_name = "삭제된 반입니다.";
		} else {
			var class_name = class_["class_name"];
		}

		var exam_name = exam["exam_name"];

		lesson_list[i]["class_name"] = class_name;
		lesson_list[i]["exam_name"] = exam_name;
	}

	data["lesson_list"] = lesson_list;
	console.log(data);

	return data;
}

exports.addLessonViewData = async (req, res) => {
	var data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"];
	
	const class_list = await classDataModel.getClassDataByClassState(1);
	const exam_list = await examDataModel.getExamDataByExamYear(current_year_index);
	console.log(class_list);
	console.log(exam_list);

	data["class_list"] = class_list;
	data["exam_list"] = exam_list;
	data["current_year"] = current_year;

	console.log(data);

	return data;
}

exports.addLesson = async (req, res) => {
	console.log(req.body);
	
	const class_index_list = req.body["class_index[]"];
	const class_name_list = req.body["class_name[]"];
	const lesson_number_list = req.body["lesson_number[]"];
	const exam_index_list = req.body["exam_index[]"];
	const lesson_year_list = req.body["lesson_year[]"]
	const lesson_desc_list = req.body["lesson_desc[]"];
	const lesson_selected_list = req.body["lesson_selected[]"];
	const lesson_date = await timeModel.timeStamp();

	console.log(class_index_list);
	console.log(class_name_list);
	console.log(lesson_number_list);
	console.log(exam_index_list);
	console.log(lesson_desc_list);
	console.log(lesson_selected_list);

	for (var i = 0 ; i < class_index_list.length ; i++) {
		// Filtering Unmatched Input
		if (parseInt(lesson_selected_list[i]) == 1) {
			if (lesson_number_list[i] == "") {
				continue;
			}

			// We Need Lesson Name 
			console.log("Add This Lesson");
			var class_index = parseInt(class_index_list[i]);
			var lesson_number = parseInt(lesson_number_list[i]);
			var exam_index = parseInt(exam_index_list[i]);
			var lesson_year = parseInt(lesson_year_list[i]);
			var lesson_desc = lesson_desc_list[i];

			console.log(class_index);
			console.log(lesson_number);
			console.log(exam_index);
			console.log(lesson_year);
			console.log(lesson_desc);
			console.log(lesson_date);

			result = await lessonDataModel.addLesson(class_index, lesson_number, exam_index, lesson_year, lesson_desc, lesson_date);
			console.log(result);
		}

		else {
			console.log("Do Not Add This Lesson");
		}
	}

	res.redirect('addlesson');
}

// ===========================================================

exports.addCurriculumDomain = async (req, res) => {
	const curriculum_domain_name = req.body.curriculum_domain_name;
	const curriculum_domain_date = await timeModel.timeStamp();
	console.log(curriculum_domain_name);
	console.log(curriculum_domain_date);

	result = await curriculumDataModel.addCurriculumDomain(curriculum_domain_name, curriculum_domain_date);
	console.log(result);

	res.redirect("addcurriculumdomain");
}

exports.showCurriculumViewData = async () => {
	var data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"];
	const current_year_name = current_year["year_name"];

	const curriculum_list = await curriculumDataModel.getCurriculumDataByYearIndex(current_year_index);

	for (var i=0 ; i<curriculum_list.length ; i++) {
		console.log(curriculum_list[i]);
		curriculum_list[i]["year_name"] = current_year_name;
		curriculum_domain_index = curriculum_list[i]["curriculum_type"];
		curriculum_list[i]["curriculum_domain_name"] = (await curriculumDataModel.getCurriculumDomainDataByCurriculumDomainIndex(curriculum_domain_index))[0]["curriculum_domain_name"];
	} 

	console.log(curriculum_list);

	data["curriculum_list"] = curriculum_list

	return data;
}

exports.addCurriculumViewData = async () => {
	var data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const curriculum_domain_list = await curriculumDataModel.getCurriculumDomainData();

	console.log(current_year);
	console.log(curriculum_domain_list);

	data["current_year"] = current_year;
	data["curriculum_domain_list"] = curriculum_domain_list;
	console.log(data);

	return data;
}

exports.detailCurriculumViewData = async (curriculum_index) => {
	var data = {};

	const curriculum = (await curriculumDataModel.getCurriculumDataByCurriculumIndex(curriculum_index))[0];
	const curriculum_type = curriculum["curriculum_type"];
	const curriculum_type_name = (await curriculumDataModel.getCurriculumDomainDataByCurriculumDomainIndex(curriculum_type))[0]["curriculum_domain_name"];
	console.log(curriculum_type_name);
	console.log(curriculum);

	curriculum["curriculum_type_name"] = curriculum_type_name;

	data["curriculum"] = curriculum;

	return data;
}

exports.addCurriculum = async (req, res) => {
	const curriculum_name = req.body.curriculum_name;
	const curriculum_type = req.body.curriculum_type;
	const year_index = req.body.year_index;
	const curriculum_desc = req.body.curriculum_desc;
	const curriculum_date = await timeModel.timeStamp();

	console.log(curriculum_name);
	console.log(curriculum_type);
	console.log(year_index);
	console.log(curriculum_desc);
	console.log(curriculum_date);

	result = await curriculumDataModel.addCurriculum(curriculum_name, curriculum_type, year_index, curriculum_desc, curriculum_date);
	console.log(result);

	res.redirect("addcurriculum");
}

exports.updateCurriculum = async (req, res) => {
	console.log(req.body);
	const curriculum_index = req.body.curriculum_index;
	const curriculum_name = req.body.curriculum_name;
	const curriculum_desc = req.body.curriculum_desc;

	var result = await curriculumDataModel.updateCurriculumDataByCurriculumIndex(curriculum_index, curriculum_name, curriculum_desc);
	console.log(result);

	res.redirect("detailcurriculum?curriculum_index=" + String(curriculum_index));
}

exports.deleteCurriculum = async (req, res) => {
	console.log(req.query);
	const curriculum_index = req.query.curriculum_index;

	var result = await curriculumDataModel.deleteCurriculumDataByCurriculumIndex(curriculum_index);
	console.log(result);

	res.redirect("showcurriculum");
}

// ===========================================================

exports.showClassViewData = async () => {
	var data = {};

	const class_list = await classDataModel.getClassData();
	console.log(class_list);

	for (var i = 0 ; i < class_list.length ; i++) {
		var curriculum_index = class_list[i]["curriculum_index"];
		var curriculum = (await curriculumDataModel.getCurriculumDataByCurriculumIndex(curriculum_index))[0];
		var year_index = curriculum["year_index"];
		var year = (await yearDataModel.getYearDataByYearIndex(year_index))[0];
		var year_name = year["year_name"];

		class_list[i]["curriculum_name"] = curriculum["curriculum_name"];
		class_list[i]["year_name"] = year_name;
		if (class_list[i]["class_state"] == 1) {
			class_list[i]["class_state_domain"] = "활성";
		}
		else if (class_list[i]["class_state"] == 0) {
			class_list[i]["class_state_domain"] = "비활성";
		}
	}

	data["class_list"] = class_list;
	console.log(data);

	return data;
}

exports.addClassViewData = async () => {
	var data = {};
	const current_year = (await yearDataModel.getCurrentYear())[0];
	const curriculum_list = await curriculumDataModel.getCurriculumDataByYearIndex(current_year["year_index"]);
	console.log(curriculum_list)

	const mentor_list = await userDataModel.getMentorData();

	data["curriculum_list"] = curriculum_list;
	data["mentor_list"] = mentor_list;
	console.log(data);

	return data;
}

exports.addClass = async (req, res) => {
	const class_name = req.body.class_name;
	const curriculum_index = req.body.curriculum_index;
	const class_desc = req.body.class_desc;
	const class_date = await timeModel.timeStamp();
	const class_state = 1;
	const mentor_index = req.body.mentor_index;

	console.log(class_name);
	console.log(curriculum_index);
	console.log(class_desc);
	console.log(class_date);
	console.log(class_state);
	console.log(mentor_index);

	result = await classDataModel.addClass(class_name, curriculum_index, mentor_index, class_desc, class_date, class_state);
	console.log(result);

	res.redirect("addclass")
}

exports.updateClassState = async (req, res) => {
	const class_index = req.query.class_index;
	const class_state = (await classDataModel.getClassDataByClassIndex(class_index))[0]["class_state"];

	console.log(class_index);
	console.log(class_state);

	if (class_state == 0) {
		result = await classDataModel.updateClassState(class_index, 1);
	} 
	else if (class_state == 1) {
		result = await classDataModel.updateClassState(class_index, 0);
	}
	else {
		console.log("ERROR")
		result = await classDataModel.updateClassState(class_index, 0);
	}

	console.log(result);

	res.redirect("showclass");
}

exports.detailClassViewData = async (class_index) => {
	data = {};

	const matched_class = await classDataModel.getClassDataByClassIndex(class_index);

	if (matched_class.length == 0) {
		console.log("ERROR : NO MATCHED CLASS");
	}
	else if (matched_class.length == 1) {
		const class_ = matched_class[0]; 
		const class_index = class_["class_index"];
		const curriculum_index = class_["curriculum_index"];
		const curriculum = (await curriculumDataModel.getCurriculumDataByCurriculumIndex(curriculum_index))[0];
		const curriculum_name = curriculum["curriculum_name"];

		class_["curriculum_name"] = curriculum_name; 
		data["class"] = class_;

		const mentor_list = await userDataModel.getMentorData();
		data["mentor_list"] = mentor_list;

		return data;
	}
	else {
		console.log("ERROR : CLASSES??");
	}
}

exports.updateClass = async (req, res) => {
	const class_index = parseInt(req.body.class_index);
	const class_name = req.body.class_name;
	const mentor_index = parseInt(req.body.mentor_index);
	const class_desc = req.body.class_desc;

	var result = await classDataModel.updateClassDataByClassIndex(class_index, class_name, mentor_index, class_desc);
	console.log(result);

	res.redirect('detailclass?class_index=' + String(class_index));
}

exports.deleteClass = async (req, res) => {
	const class_index = req.query.class_index;

	const result = await classDataModel.deleteClass(class_index);
	console.log(result);

	res.redirect('showclass');
}

// ===========================================================

exports.showExamViewData = async () => {
	var data = {};

	var exam_list = await examDataModel.getExamData();

	for (var i = 0 ; i < exam_list.length ; i++) {
		var exam_year_index = exam_list[i]["exam_year"];
		var exam_domain_index = exam_list[i]["exam_domain_index"];

		console.log(exam_year_index);

		var exam_year = (await yearDataModel.getYearDataByYearIndex(exam_year_index))[0];
		var exam_year_name = exam_year["year_name"];
		var exam_domain = (await examDataModel.getExamDomainDataByExamDomainIndex(exam_domain_index))[0];
		var exam_domain_name = exam_domain["exam_domain_name"];

		exam_list[i]["exam_year_name"] = exam_year_name;
		exam_list[i]["exam_domain_name"] = exam_domain_name;
	}

	data["exam_list"] = exam_list;
	console.log(data);

	return data;
}

exports.addExamViewData = async () => {
	var data = {};

	var exam_domain_list = await examDataModel.getExamDomainData();
	var current_year = (await yearDataModel.getCurrentYear())[0];

	console.log(exam_domain_list);
	console.log(current_year);

	data["exam_domain_list"] = exam_domain_list;
	data["current_year"] = current_year;

	return data;
}

exports.addExam = async (req, res) => {
	const exam_name = req.body.exam_name;
	const exam_domain_index = req.body.exam_domain_index;
	const exam_year = req.body.year_index;
	const exam_desc = req.body.exam_desc;
	const exam_problem_label = req.body["exam_problem_label[]"];
	const exam_problem_desc = req.body["exam_problem_desc[]"];
	const exam_problem_score = req.body["exam_problem_score[]"];
	const exam_problem_number = exam_problem_label.length;
	const exam_date = await timeModel.timeStamp();

	var exam_problem_score_int = new Array();
	for (var i=0 ; i<exam_problem_score.length ; i++) {
		exam_problem_score_int[i] = parseInt(exam_problem_score[i]);
	}

	console.log(exam_name);
	console.log(exam_domain_index);
	console.log(exam_year);
	console.log(exam_desc);
	console.log(exam_problem_label);
	console.log(exam_problem_desc);
	console.log(exam_problem_score);
	console.log(exam_problem_score_int);
	console.log(exam_date)

	console.log(exam_problem_label.length);

	const exam_problem_label_string = JSON.stringify(exam_problem_label);
	const exam_problem_desc_string = JSON.stringify(exam_problem_desc);
	const exam_problem_score_int_string = JSON.stringify(exam_problem_score_int);

	console.log(exam_problem_label_string);
	console.log(exam_problem_desc_string);
	console.log(exam_problem_score_int_string);

	const result = await examDataModel.addExam(
				exam_name, exam_domain_index, exam_year, exam_desc, exam_problem_number,
				exam_problem_label_string, 
				exam_problem_desc_string,
				exam_problem_score_int_string,
				exam_date);

	console.log(result);

	res.redirect("addexam");
}

exports.detailExamViewData = async (exam_index) => {
	data = {};

	var exam = (await examDataModel.getExamDataByExamIndex(exam_index))[0];
	exam["exam_problem_label"] = JSON.parse(exam["exam_problem_label"]);
	exam["exam_problem_score"] = JSON.parse(exam["exam_problem_score"]);
	exam["exam_problem_desc"] = JSON.parse(exam["exam_problem_desc"]);
	exam["exam_statistic_distribution"] = JSON.parse(exam["exam_statistic_distribution"]);

	const exam_domain_index = exam["exam_domain_index"];
	const exam_domain = (await examDataModel.getExamDomainDataByExamDomainIndex(exam_domain_index))[0];
	const exam_domain_name = exam_domain["exam_domain_name"];
	exam["exam_domain_name"] = exam_domain_name;

	const year_index = exam["exam_year"];
	const year = (await yearDataModel.getYearDataByYearIndex(year_index))[0];
	const year_name = year["year_name"];
	exam["year_name"] = year_name;

	data["exam"] = exam; 

	return data;
}

exports.updateExam = async (req, res) => {
	console.log(req.body);
	const exam_index = parseInt(req.body.exam_index);
	const exam_name = req.body.exam_name;
	const exam_domain_index = parseInt(req.body.exam_domain_index);
	var year_index = parseInt(req.body.year_index);
	const exam_desc = req.body.exam_desc;
	const exam_problem_label = req.body["exam_problem_label[]"];
	const exam_problem_desc = req.body["exam_problem_desc[]"];
	const exam_problem_score = req.body["exam_problem_score[]"];
	const exam_problem_number = exam_problem_label.length;

	var exam_problem_score_int = new Array();
	for (var i = 0 ; i < exam_problem_number ; i++) {
		exam_problem_score_int[i] = parseInt(exam_problem_score[i]);
	}

	const exam_problem_label_string = JSON.stringify(exam_problem_label);
	const exam_problem_desc_string = JSON.stringify(exam_problem_desc);
	const exam_problem_score_int_string = JSON.stringify(exam_problem_score_int);

	var result = await examDataModel.updateExamDataByExamIndex(exam_index, exam_name, exam_problem_number, exam_problem_label_string, exam_problem_desc_string, exam_problem_score_int_string, exam_desc);
	console.log(result);

	res.redirect('detailexam?exam_index=' + String(exam_index));
}

exports.deleteExam = async (req, res) => {
	console.log(req.query);
	const exam_index = req.query.exam_index;
	var result = await examDataModel.deleteExam(exam_index);
	console.log(result);

	res.redirect('showexam');
}

// ===========================================================

exports.showUserViewData = async () => {
	var data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"] 
	console.log(current_year);

	var user_list = await userDataModel.getUserDataByUserYear(current_year_index);

	for (var i = 0 ; i < user_list.length ; i++) {
		var user_authority_text;
		var user_graduation_text;

		var user_graduation = user_list[i]["user_graduation"];
		if (user_graduation == 1) {
			user_graduation_text = "재학";
		}
		else if (user_graduation == 2) {
			user_graduation_text = "졸업";
		}
		else {
			user_graduation_text = "미응답";
		}

		var user_authority = user_list[i]["user_authority"];
		if (user_authority == 1) {
			user_authority_text = "관리자";
		} 
		else if (user_authority == 2) {
			user_authority_text = "강사";
		} 
		else if (user_authority == 3) {
			user_authority_text = "조교";
		} 
		else if (user_authority == 4) {
			user_authority_text = "학생";
		} 
		else {
			user_authority_text = "식별되지 않는 권한";
		}

		user_list[i]["user_authority_text"] = user_authority_text;
		user_list[i]["user_graduation_text"] = user_graduation_text;
	}

	data["current_year"] = current_year;
	data["user_list"] = user_list;

	return data;
}

exports.addUserViewData = async () => {
	var data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	console.log(current_year);

	data["current_year"] = current_year;

	return data;
}

exports.addUser = async (req, res) => {
	const user_name = req.body.user_name;
	const school_name = req.body.school_name;
	const user_phonenumber = req.body.user_phonenumber;
	const user_authority = req.body.user_authority;
	const user_graduation = req.body.user_graduation;
	const user_year = req.body.user_year;
	const user_desc = req.body.user_desc;
	const user_date = await timeModel.timeStamp();

	console.log(user_name);
	console.log(school_name);
	console.log(user_phonenumber);
	console.log(user_authority);
	console.log(user_graduation);
	console.log(user_year);
	console.log(user_desc);

	// 중복 입력 방지
	matched_user = await userDataModel.getUserDataByUserNameUserPhonenumber(user_name, user_phonenumber);
	console.log(matched_user);

	if (matched_user.length == 0) {
		console.log("ADD USER");
		// add
		result = await userDataModel.addUser(user_name, school_name, user_phonenumber, user_authority, user_graduation, user_year, user_desc, user_date);
		console.log(result);

		res.redirect("adduser");
	}

	else if (matched_user.length == 1) {
		console.log("UPDATE USER");
		// update
		user_index = matched_user[0]["user_index"];

		if (matched_user[0]["user_graduation"] == 1 || matched_user[0]["user_graduation"] == 2) {
			user_graduation = matched_user[0]["user_graduation"];
		}
		result = await userDataModel.updateUserDataByUserIndex(user_index, school_name, user_authority, user_graduation, user_year, user_desc);
		console.log(result);

		res.redirect("adduser");
	}

	else {
		// ERROR
	}
}

exports.addUserBulk = async (req, res) => {
	const workbook = xlsx.readFile(req.file.path);
	const sheet_list = workbook.SheetNames;
	const user_list = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]);

	const user_year = req.body.user_year;
	const user_date = await timeModel.timeStamp();

	// 업데이트 룰 개발 => user_graduation, user_year

	for (var i = 0 ; i < user_list.length ; i++) {
		var user_name = user_list[i]['학생명'];
		var school_name = user_list[i]['학교명'];
		var user_phonenumber = user_list[i]['부모핸드폰'];
		var user_authority = 4;
		var user_graduation = user_list[i]['재학/졸업'];
		user_desc = "";

		// 중복 입력 방지
		matched_user = await userDataModel.getUserDataByUserNameUserPhonenumber(user_name, user_phonenumber);
		// console.log(matched_user);

		console.log(user_name + " - " + user_phonenumber + " - " + school_name);

		if (matched_user.length == 0) {
			console.log("ADD USER");
			// add

			// unexpected input when user excel bulk
			if (user_graduation == 1 || user_graduation == 2) {
				console.log("Right Graduation Input");
			} 
			else {
				user_graduation = 3;
			}

			result = await userDataModel.addUser(user_name, school_name, user_phonenumber, user_authority, user_graduation, user_year, user_desc, user_date);
			console.log(result);
		}

		else if (matched_user.length == 1) {
			console.log("UPDATE USER");
			// update
			user_index = matched_user[0]["user_index"];

			if (matched_user[0]["user_graduation"] == 1 || matched_user[0]["user_graduation"] == 2) {
				user_graduation = matched_user[0]["user_graduation"];
			}

			user_authority = matched_user[0]["user_authority"];
			user_desc = matched_user[0]["user_desc"];

			result = await userDataModel.updateUserDataByUserIndex(user_index, school_name, user_authority, user_graduation, user_year, user_desc);
			console.log(result);
		}	
	}

	res.redirect('adduser');
}

exports.detailUserViewData = async (user_index) => {
	var data = {};

	const matched_user = await userDataModel.getUserDataByUserIndex(user_index);

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const year_index = current_year["year_index"];

	const university_department_list = await universityDataModel.getUniversityDataByEntranceYear(year_index);
	
	if (matched_user.length == 0) {
		console.log("ERROR : NO USER");
	} 
	else if (matched_user.length == 1) {
		data["user"] = matched_user[0];
		data["current_year"] = current_year;
		data["university_department_list"] = university_department_list;

		console.log(data);
		
		return data;
	}
	else {
		console.log("ERROR : USERS?")
	}
}

exports.updateUser = async (req, res) => {
	console.log(req.body);
	const user_index = parseInt(req.body.user_index);
	const user_name = req.body.user_name;
	const school_name = req.body.school_name;
	const user_phonenumber = req.body.user_phonenumber;
	const user_authority = parseInt(req.body.user_authority);
	const user_graduation = parseInt(req.body.user_graduation);
	const user_year = parseInt(req.body.user_year);
	const user_desc = req.body.user_desc;
	const acceptance_index_1 = parseInt(req.body.acceptance_index_1);
	const acceptance_index_2 = parseInt(req.body.acceptance_index_2);
	const acceptance_index_3 = parseInt(req.body.acceptance_index_3);

	var result = await userDataModel.updateUserDataByUserIndex2(user_index, user_name, school_name, user_phonenumber, user_authority, user_graduation, user_year, user_desc, acceptance_index_1, acceptance_index_2, acceptance_index_3);
	console.log(result);

	res.redirect('detailuser?user_index=' + String(user_index));
}

exports.deleteUser = async (req, res) => {
	const user_index = req.query.user_index;

	var result = await userDataModel.deleteUser(user_index);
	console.log(result);

	res.redirect('showuser');
}

// ===========================================================

exports.showResultViewData = async (exam_index) => {
	var data = {};
	const result_list = await resultDataModel.getResultDataByExamIndex(exam_index);

	var exam = (await examDataModel.getExamDataByExamIndex(exam_index))[0];
	var exam_name = exam["exam_name"];

	for (var i = 0 ; i < result_list.length ; i++) {
		var result_ = result_list[i];
		
		var user_index = result_["user_index"];
		var user = (await userDataModel.getUserDataByUserIndex(user_index))[0];
		var user_name = user["user_name"];
		var school_name = user["school_name"];
		var user_phonenumber = user["user_phonenumber"];

		var result_grader = result_["result_grader"];
		var grader = (await userDataModel.getUserDataByUserIndex(result_grader))[0];
		var grader_name = grader["user_name"];

		result_list[i]["user_name"] = user_name;
		result_list[i]["school_name"] = school_name;
		result_list[i]["user_phonenumber"] = user_phonenumber;
		result_list[i]["grader_name"] = grader_name;

		console.log(result_list[i]);
 	}

 	data["result_list"] = result_list;
 	data["exam_name"] = exam_name;

 	return data;
}

exports.addResultBulkViewData = async () => {
	var data = {};
	const lesson_list = await lessonDataModel.getLessonData();
	console.log(lesson_list);

	for (var i = 0 ; i < lesson_list.length ; i++) {
		var class_index = lesson_list[i]["class_index"];
		var class_ = (await classDataModel.getClassDataByClassIndex(class_index))[0];
		var class_name = class_["class_name"];

		lesson_list[i]["class_name"] = class_name;
	}

	data["lesson_list"] = lesson_list;
	console.log(data);

	return data;
}

exports.addResultBulk = async (req, res) => {
	const workbook = xlsx.readFile(req.file.path);
	const sheet_list = workbook.SheetNames;
	const result_list = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]);

	const lesson_index = req.body.lesson_index;
	const lesson = (await lessonDataModel.getLessonDataByLessonIndex(lesson_index))[0];
	
	const class_index = lesson["class_index"]
	const class_ = (await classDataModel.getClassDataByClassIndex(class_index))[0];
	
	const result_grader = class_["mentor_index"];
	
	const exam_index = lesson["exam_index"];
	const exam = (await examDataModel.getExamDataByExamIndex(exam_index))[0];
	const exam_problem_label = JSON.parse(exam["exam_problem_label"]);
	const exam_problem_score = JSON.parse(exam["exam_problem_score"]);
	const result_date = await timeModel.timeStamp();

	var add = 0;
	var update = 0;
	var error = 0;

	// 시험정보와 입력된 점수 정보의 합리성을 확인하여 입력 진행
	for (var i = 0 ; i < result_list.length ; i++) {
		var user_name = result_list[i]["학생명"];
		var user_phonenumber = result_list[i]["부모핸드폰"];
		
		// 한명인지 여러명인지 없는지 확인할 작업임 필요함
		var matched_user = await userDataModel.getUserDataByUserNameUserPhonenumber(user_name, user_phonenumber);

		// 유저 존재
		if (matched_user.length == 1) {
			var user_index = matched_user[0]["user_index"];
			var matched_result = await resultDataModel.getResultDataByUserIndexExamIndex(user_index, exam_index);

			// result_score
			var result_score = new Array();
			var invalid_checksum = 1;
			for (var j = 0 ; j < exam_problem_label.length ; j++) {
				result_score[j] = result_list[i][exam_problem_label[j]];
				
				// 잘못된 입력

				// 문자입력
				if (isNaN(result_score[j]) == true) {
					invalid_checksum = 0;
					continue;
				}
				// 벗어난 범위 입력
				if (result_score[j] > exam_problem_score[j] || result_score[j] < 0) {
					invalid_checksum = 0;
					continue;
				}
			}

			if (invalid_checksum != 1) {
				continue;
			}

			var result_score_string = JSON.stringify(result_score);
			var result_sum = result_score.reduce((a,b)=>a+b);

			// 시험결과 추가
			if (matched_result.length == 0) {
				var user_index = matched_user[0]["user_index"];
				var result = await resultDataModel.addResult(user_index, lesson_index, exam_index, result_sum, result_score_string, result_grader, result_date);
				add += 1;
			}
			// 시험결과 업데이트
			else if (matched_result.length == 1) {
				var result_index = matched_result[0]["result_index"];
				var result = await resultDataModel.updateResult(result_index, result_score_string, result_sum);
				update += 1;
			}
			// 에러
			else {
				error += 1;
			}

		}
		else if (matched_user.length == 0) {
			console.log("No User Matched");
		}
		else {
			console.log("Users?");
		}
	}

	console.log("add : " + String(add));
	console.log("update : " + String(update));
	console.log("error : " + String(error));

	// 시험 통계정보 갱신
	const updated_result_list = await resultDataModel.getResultDataByExamIndex(exam_index);
	var updated_result_sum_list = new Array();

	var exam_statistic_count = updated_result_list.length;
	for (var i = 0 ; i < updated_result_list.length ; i++) {
		updated_result_sum_list[i] = updated_result_list[i]["result_sum"];
	}

	// counting, exam_statistic_distribution
	var exam_statistic_distribution = new Array(10).fill(0);
	var rank_table = new Array(101).fill(1);
	for (var i = 0 ; i < updated_result_sum_list.length ; i++) {
		var distribution_position = parseInt(updated_result_sum_list[i]/10);
		if (updated_result_sum_list[i] == 100) {
			distribution_position = 9;
		}		
		exam_statistic_distribution[distribution_position] += 1;

		// Generate Rank Table
		for (var j = 0 ; j < updated_result_sum_list[i] ; j++) {
			rank_table[j] += 1;
		}
	}
	var exam_statistic_distribution_string = JSON.stringify(exam_statistic_distribution);
	var exam_statistic_average = math.mean(updated_result_sum_list);
	var exam_statistic_std = math.std(updated_result_sum_list);

	console.log(exam_statistic_distribution_string);
	console.log(exam_statistic_average);
	console.log(exam_statistic_std);

	// Update
	var result = await examDataModel.updateExamStatisticsByExamIndex(exam_index, exam_statistic_distribution_string, exam_statistic_average, exam_statistic_std, exam_statistic_count);
	// console.log(result);

	// 학생 결과통계 갱신
	for (var i = 0 ; i < updated_result_list.length ; i++) {
		var result_index = updated_result_list[i]["result_index"];
		var result_rank = rank_table[updated_result_list[i]["result_sum"]];
		var result_std = ((updated_result_list[i]["result_sum"] - exam_statistic_average) * 20 / exam_statistic_std) + 100;

		console.log("");
		console.log(result_index);
		console.log(result_rank);
		console.log(result_std);

		var result = await resultDataModel.updateResultStatisticsByResultIndex(result_index, result_rank, result_std);
		// console.log(result);
	}


	res.redirect("addresultbulk");
}

exports.detailResultViewData = async (result_index) => {
	console.log(result_index);

	var data = {};

	var result = (await resultDataModel.getResultDataByResultIndex(result_index))[0];
	var user_index = result["user_index"];
	var exam_index = result["exam_index"];
	var exam = (await examDataModel.getExamDataByExamIndex(exam_index))[0];
	var user = (await userDataModel.getUserDataByUserIndex(user_index))[0];

	result["result_score"] = JSON.parse(result["result_score"]);
	exam["exam_problem_label"] = JSON.parse(exam["exam_problem_label"]);
	exam["exam_problem_desc"] = JSON.parse(exam["exam_problem_desc"]);
	exam["exam_problem_score"] = JSON.parse(exam["exam_problem_score"]);

	data["result"] = result;
	data["exam"] = exam;
	data["user"] = user;

	return data;
}

exports.updateResult = async (req, res) => {
	var result_index = parseInt(req.body.result_index);
	var exam_index = parseInt(req.body.exam_index);
	var result_score = req.body["result_score[]"];

	var result_score_int = new Array();
	for (var i = 0 ; i < result_score.length ; i++) {
		result_score_int[i] = parseInt(result_score[i]);
	}

	var result_sum = result_score_int.reduce((a,b)=>a+b);
	var result_score_int_string = JSON.stringify(result_score_int);

	console.log(result_index);
	console.log(result_score_int_string);
	console.log(result_sum);


	var result_ = await resultDataModel.updateResult(result_index, result_score_int_string, result_sum);
	console.log(result_);



	// 시험 통계정보 갱신 = exam_index
	const updated_result_list = await resultDataModel.getResultDataByExamIndex(exam_index);
	var updated_result_sum_list = new Array();

	var exam_statistic_count = updated_result_list.length;
	for (var i = 0 ; i < updated_result_list.length ; i++) {
		updated_result_sum_list[i] = updated_result_list[i]["result_sum"];
	}

	// counting, exam_statistic_distribution
	var exam_statistic_distribution = new Array(10).fill(0);
	var rank_table = new Array(101).fill(1);
	for (var i = 0 ; i < updated_result_sum_list.length ; i++) {
		var distribution_position = parseInt(updated_result_sum_list[i]/10);
		if (updated_result_sum_list[i] == 100) {
			distribution_position = 9;
		}		
		exam_statistic_distribution[distribution_position] += 1;

		// Generate Rank Table
		for (var j = 0 ; j < updated_result_sum_list[i] ; j++) {
			rank_table[j] += 1;
		}
	}
	var exam_statistic_distribution_string = JSON.stringify(exam_statistic_distribution);
	var exam_statistic_average = math.mean(updated_result_sum_list);
	var exam_statistic_std = math.std(updated_result_sum_list);

	console.log(exam_statistic_distribution_string);
	console.log(exam_statistic_average);
	console.log(exam_statistic_std);

	// Update
	var result = await examDataModel.updateExamStatisticsByExamIndex(exam_index, exam_statistic_distribution_string, exam_statistic_average, exam_statistic_std, exam_statistic_count);
	// console.log(result);

	// 학생 결과통계 갱신
	for (var i = 0 ; i < updated_result_list.length ; i++) {
		var result_index = updated_result_list[i]["result_index"];
		var result_rank = rank_table[updated_result_list[i]["result_sum"]];
		var result_std = ((updated_result_list[i]["result_sum"] - exam_statistic_average) * 20 / exam_statistic_std) + 100;

		console.log("");
		console.log(result_index);
		console.log(result_rank);
		console.log(result_std);

		var result = await resultDataModel.updateResultStatisticsByResultIndex(result_index, result_rank, result_std);
		// console.log(result);
	}

	console.log("==========")


	res.redirect('detailresult?result_index=' + String(result_index));
}

exports.deleteResult = async (req, res) => {
	console.log(req.query);
}

// ===========================================================

exports.showUniversityViewData = async () => {
	var data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"];
	const university_department_list = await universityDataModel.getUniversityDataByEntranceYear(current_year_index);
	
	data["university_department_list"] = university_department_list;
	console.log(data);

	return data;
}

exports.addUniversityViewData = async () => {
	var data = {};
	const current_year = (await yearDataModel.getCurrentYear())[0];
	data["current_year"] = current_year;

	return data;
}

exports.addUniversity = async (req, res) => {
	const university_name = req.body.university_name;
	const department_name = req.body.department_name;
	const entrance_limit = parseInt(req.body.entrance_limit);
	const entrance_year = parseInt(req.body.year_index);
	const university_department_date = await timeModel.timeStamp();

	console.log(university_name);
	console.log(department_name);
	console.log(entrance_limit);
	console.log(entrance_year);
	console.log(university_department_date);

	var result = await universityDataModel.addUniversity(university_name, department_name, entrance_limit, entrance_year, university_department_date);
	console.log(result);

	res.redirect("adduniversity");
}

// ===========================================================

exports.showExamDomainViewData = async () => {
	var data  = {};
	const exam_domain_list = await examDataModel.getExamDomainData();
	console.log(exam_domain_list);

	for (var i = 0 ; i < exam_domain_list.length ; i++) {
		var exam_type_index_1 = exam_domain_list[i]["exam_domain_type1"];
		var exam_type_index_2 = exam_domain_list[i]["exam_domain_type2"];
		var exam_type_1 = (await examDataModel.getExamTypeDataByExamTypeIndex(exam_type_index_1))[0];
		var exam_type_2 = (await examDataModel.getExamTypeDataByExamTypeIndex(exam_type_index_2))[0];
		var exam_type_name_1 = exam_type_1["exam_type_name"];
		var exam_type_name_2 = exam_type_2["exam_type_name"];

		console.log(exam_type_index_1);
		console.log(exam_type_index_2);
		console.log(exam_type_1);
		console.log(exam_type_2);
		console.log(exam_type_name_1);
		console.log(exam_type_name_2);

		exam_domain_list[i]["exam_type_name_1"] = exam_type_name_1;
		exam_domain_list[i]["exam_type_name_2"] = exam_type_name_2;
	}

	data["exam_domain_list"] = exam_domain_list;
	console.log(data);

	return data;
}

exports.addExamDomainViewData = async () => {
	var data = {};
	const exam_type_list = await examDataModel.getExamTypeData();
	console.log(exam_type_list);

	data["exam_type_list"] = exam_type_list;

	return data;
}

exports.addExamDomain = async (req, res) => {
	var data = {};
	console.log(req.body);
	const exam_domain_name = req.body.exam_domain_name;
	const exam_domain_type1 = req.body.exam_type_1;
	const exam_domain_type2 = req.body.exam_type_2;
	const exam_domain_date = await timeModel.timeStamp();

	console.log(exam_domain_name);
	console.log(exam_domain_type1);
	console.log(exam_domain_type2);
	console.log(exam_domain_date);

	var result = await examDataModel.addExamDomain(exam_domain_name, exam_domain_type1, exam_domain_type2, exam_domain_date);
	console.log(result);

	res.redirect("addexamdomain");
}

exports.showExamTypeViewData = async () => {
	var data = {};
	const exam_type_list = await examDataModel.getExamTypeData();
	console.log(exam_type_list);

	data["exam_type_list"] = exam_type_list;

	return data;
}

exports.addExamType = async (req, res) => {
	const exam_type_name = req.body.exam_type_name;
	const exam_type_date = await timeModel.timeStamp();
	
	console.log(exam_type_name);
	console.log(exam_type_date);

	result = await examDataModel.addExamType(exam_type_name, exam_type_date);
	console.log(result)

	res.redirect("addexamtype");
}

exports.addYear = async (req, res) => {
	const year_name = req.body.year_name;
	const year_year = req.body.year_year;
	const year_desc = req.body.year_desc;
	const year_date = await timeModel.timeStamp();

	console.log(year_name);
	console.log(year_year);
	console.log(year_desc);
	console.log(year_date);

	result = await yearDataModel.addYear(year_name, year_year, year_desc, year_date);
	console.log(result);

	res.redirect("systemsetting");
}

exports.updateSystemYear = async (req, res) => {
	const year_index = req.query.year_index;
	console.log(year_index);

	result = await yearDataModel.updateYearState(year_index);
	console.log(result);

	res.redirect("systemsetting");
}