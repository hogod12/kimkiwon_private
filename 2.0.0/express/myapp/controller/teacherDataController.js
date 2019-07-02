const userDataModel = require('../model/userDataModel');
const yearDataModel = require('../model/yearDataModel');
const resultDataModel = require('../model/resultDataModel');
const examDataModel = require('../model/examDataModel');

exports.teacherMainViewData = async () => {
	var content_data = {};

	return content_data;
}

exports.teacherStudentTableViewData = async () => {
	var content_data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"];

	var user_list = await userDataModel.getUserDataByUserYearUserAuth(current_year_index, 4);
	content_data["user_list"] = user_list;

	return content_data;
}

exports.changeAuthentication = async (req, res) => {
	var student_user_index = req.query.user_index;
	var student_user = (await userDataModel.getUserDataByUserIndex(student_user_index))[0];

	var user_id = student_user["user_id"];
	var user_password = student_user["user_password"];

	// Login
	var matched_user = await userDataModel.getUserDataByAuthenticationInfo(user_id, user_password);
	console.log(matched_user);

	if (matched_user.length == 0) {
		// No user that matched with input information
		console.log("! No User Matched");
	}
	else if (matched_user.length == 1) {
		// find only-one user that matched with input informationx
		// Expected Process
		console.log("Find only 1 User")

		var sess = req.session;

		sess.user_index = matched_user[0]["user_index"];
		sess.user_authority = matched_user[0]["user_authority"];

		// Temp@
		console.log(sess.user_index);

		res.redirect('/');
	}
	else {
		// find users that matched with input information
		// ! Critical Bug - GiveToken and Database should Fixed
		console.log("Find Many User");
	}
}

exports.teacherAllRankTableViewData = async () => {
	var content_data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"];

	// 당해년도 학생 목록 -> Top 10 명단 추출
	var user_list = await userDataModel.getUserDataByUserYearUserAuth(current_year_index, 4);

	for (var i = 0 ; i < user_list.length ; i++) {
		var user_index = user_list[i]["user_index"];
		var result_list = await resultDataModel.getResultDataByUserIndex(user_index);

		// 개별 표준점수 평균 산촐
		var result_count = 0;
		var result_std_sum = 0;
		for (var j = 0 ; j < result_list.length ; j++) {
			result_std_sum += parseInt(result_list[j]["result_std"]);
			result_count += 1;
		}

		var result_std_average;
		if (result_count == 0) {
			result_std_average = 0;
		}
		else {
			result_std_average = result_std_sum/result_count;
		}

		user_list[i]["result_std"] = result_std_average;
		user_list[i]["result_count"] = result_count;
	}

	content_data["user_list"] = user_list;

	return content_data;
}

exports.teacherExamStatViewData = async () => {
	var content_data = {};

	const current_year = (await yearDataModel.getCurrentYear())[0];
	const current_year_index = current_year["year_index"];

	exam_list = await examDataModel.getExamDataByExamYear(current_year_index);
	for (var i = 0 ; i < exam_list.length ; i++) {
		var exam_domain_index = exam_list[i]["exam_domain_index"];
		var exam_domain = (await examDataModel.getExamDomainDataByExamDomainIndex(exam_domain_index))[0];
		
		var exam_type_index1 = exam_domain["exam_domain_type1"];
		var exam_type_index2 = exam_domain["exam_domain_type2"];
		
		var exam_type1 = (await examDataModel.getExamTypeDataByExamTypeIndex(exam_type_index1))[0];
		var exam_type2 = (await examDataModel.getExamTypeDataByExamTypeIndex(exam_type_index2))[0];

		exam_list[i]["exam_domain"] = exam_domain;
		exam_list[i]["exam_type1"] = exam_type1;
		exam_list[i]["exam_type2"] = exam_type2;
	}
	content_data["exam_list"] = exam_list;

	return content_data;
}

exports.teacherClassStatViewData = async () => {
	var content_data = {};

	return content_data;
}

