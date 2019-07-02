const adminDataController = require('./adminDataController');
const studentDataController = require('./studentDataController');
const mentorDataController = require('./mentorDataController');
const teacherDataController = require('./teacherDataController');

exports.LoginPageView = async (req, res) => {
	res.render('login.ejs');
}

exports.adminMainPageView = async (req, res) => {
	res.render('admin/main.ejs');
}

// ====================================================================================

// **
exports.adminShowLessonPageView = async (req, res) => {
	var data = await adminDataController.showLessonViewData();
	res.render('admin/showLesson.ejs', {data : data});
}

// **
exports.adminAddLessonPageView = async (req, res) => {
	var data = await adminDataController.addLessonViewData(); 
	res.render('admin/addLesson.ejs', {data : data});
}

// ====================================================================================

// **
exports.adminShowCurriculumPageView = async (req, res) => {
	var data = await adminDataController.showCurriculumViewData();
	res.render('admin/showCurriculum.ejs', {data : data});
}

// **
exports.adminAddCurriculumPageView = async (req, res) => {
	var data = await adminDataController.addCurriculumViewData();
	res.render('admin/addCurriculum.ejs', {data : data});
}

// **
exports.adminDetailCurriculumPageView = async (req, res) => {
	const curriculum_index = req.query.curriculum_index;
	var data = await adminDataController.detailCurriculumViewData(curriculum_index);
	res.render('admin/detailCurriculum.ejs', {data : data});
}

// ====================================================================================

// **
exports.adminShowExamPageView = async (req, res) => {
	var data = await adminDataController.showExamViewData();
	res.render('admin/showExam.ejs', {data : data});
}

// **
exports.adminAddExamPageView = async (req, res) => {
	var data = await adminDataController.addExamViewData();
	res.render('admin/addExam.ejs', {data : data});
}

// **
exports.adminDetailExamPageView = async (req, res) => {
	const exam_index = req.query.exam_index;
	var data = await adminDataController.detailExamViewData(exam_index);
	res.render('admin/detailExam.ejs', {data : data});
}

// ====================================================================================

// **
exports.adminShowClassPageView = async (req, res) => {
	var data = await adminDataController.showClassViewData();
	console.log(data);
	res.render('admin/showClass.ejs', {data : data});
}

// **
exports.adminAddClassPageView = async (req, res) => {
	var data = await adminDataController.addClassViewData();
	res.render('admin/addClass.ejs', {data : data});
}

// **
exports.adminDetailClassPageView = async (req, res) => {
	const class_index = req.query.class_index;
	var data = await adminDataController.detailClassViewData(class_index);
	res.render('admin/detailClass.ejs', {data : data});
}

// ====================================================================================

// **
exports.adminShowUserPageView = async (req, res) => {
	var data = await adminDataController.showUserViewData();
	res.render('admin/showUser.ejs', {data : data});
}

// **
exports.adminAddUserPageView = async (req, res) => {
	var data = await adminDataController.addUserViewData(); 
	res.render('admin/addUser.ejs', {data : data});
}

// **
exports.adminDetailUserPageView = async (req, res) => {
	const user_index = req.query.user_index;
	var data = await adminDataController.detailUserViewData(user_index);
	res.render('admin/detailUser.ejs', {data : data});
}

// ====================================================================================

// **
exports.adminShowResultPageView = async (req, res) => {
	const exam_index = req.query.exam_index;
	var data = await adminDataController.showResultViewData(exam_index);
	res.render('admin/showResult.ejs', {data : data});
}

// **
exports.adminAddResultBulkPageView = async (req, res) => {
	var data = await adminDataController.addResultBulkViewData();
	res.render('admin/addResultBulk.ejs', {data : data});
}

// **
exports.adminDetailResultPageView = async (req, res) => {
	const result_index = req.query.result_index;
	var data = await adminDataController.detailResultViewData(result_index);
	res.render('admin/detailResult.ejs', {data : data});
}

// ====================================================================================

// **
exports.adminShowUniversityPageView = async (req, res) => {
	var data = await adminDataController.showUniversityViewData();
	res.render('admin/showUniversity.ejs', {data : data});
}

// **
exports.adminAddUniversityPageView = async (req, res) => {
	var data = await adminDataController.addUniversityViewData();
	res.render('admin/addUniversity.ejs', {data : data});
}

// ====================================================================================

// **
exports.adminShowCurriculumDomainPageView = async (req, res) => {
	data = {};

	var curriculum_domain_list = await adminDataController.showCurriculumDomainViewData();
	console.log(curriculum_domain_list);
	data["curriculum_domain_list"] = curriculum_domain_list;
	
	res.render('admin/showCurriculumDomain.ejs', {data : data});
}

// **
exports.adminAddCurriculumDomainPageView = async (req, res) => {
	res.render('admin/addCurriculumDomain.ejs');
}

// ====================================================================================

// **
exports.adminShowExamDomainPageView = async (req, res) => {
	data = await adminDataController.showExamDomainViewData();
	res.render('admin/showExamDomain.ejs', {data : data});
}

// **
exports.adminAddExamDomainPageView = async (req, res) => {
	data = await adminDataController.addExamDomainViewData();
	res.render('admin/addExamDomain.ejs');
}

// ====================================================================================

// **
exports.adminShowExamTypePageView = async (req, res) => {
	data = await adminDataController.showExamTypeViewData();
	res.render('admin/showExamType.ejs');

}

// **
exports.adminAddExamTypePageView = async (req, res) => {
	res.render('admin/addExamType.ejs');
}

// ====================================================================================

// **
exports.adminSystemSettingPageView = async (req, res) => {
	var data = await adminDataController.systemSettingViewData();
	res.render('admin/systemSetting.ejs', {data : data});
}






// STUDENT PAGE

// MAIN PAGE
exports.studentMainPageView = async (req, res) => {
	var user_index = req.session.user_index;

	var topnav_data = await studentDataController.studentTopnavViewData (user_index);
	var nav_data = await studentDataController.studentNavViewData (user_index);
	var content_data = await studentDataController.studentMainViewData(user_index);

	console.log(content_data);

	res.render ('student/main.ejs', {topnav_data : topnav_data, nav_data : nav_data, content_data : content_data});
}

// RESULT PAGE
exports.studentResultPageView = async (req, res) => {
	var user_index = req.session.user_index;
	var result_index = req.query.result_index;

	var topnav_data = await studentDataController.studentTopnavViewData (user_index);
	var nav_data = await studentDataController.studentNavViewData (user_index);
	var content_data = await studentDataController.studentResultViewData (result_index);

	res.render ('student/showResult.ejs', {topnav_data : topnav_data, nav_data : nav_data, content_data : content_data});
}

// QUESTION PAGE
exports.studentQuestionPageView = async (req, res) => {
	var user_index = req.session.user_index;
	var result_index = req.query.result_index;

	var topnav_data = await studentDataController.studentTopnavViewData (user_index);
	var nav_data = await studentDataController.studentNavViewData (user_index);
	var content_data = await studentDataController.studentQuestionViewData (result_index);

	res.render ('student/question.ejs', {topnav_data : topnav_data, nav_data : nav_data, content_data : content_data});
}





// MENTOR PAGE

// MAIN PAGE
exports.mentorMainPageView = async (req, res) => {
	var user_index = req.session.user_index;

	var topnav_data = await mentorDataController.mentorTopnavViewData (user_index);
	var nav_data = await mentorDataController.mentorNavViewData (user_index);
	var content_data = await mentorDataController.mentorMainViewData (user_index);

	res.render ('mentor/main.ejs', {topnav_data : topnav_data, nav_data : nav_data, content_data : content_data});
}

// SHOWQUESTION - CLASSFIED BY CLASS
exports.mentorShowQuestionPageView = async (req, res) => {
	var user_index = req.session.user_index;
	var lesson_index = req.query.lesson_index;

	var topnav_data = await mentorDataController.mentorTopnavViewData (user_index);
	var nav_data = await mentorDataController.mentorNavViewData (user_index);
	var content_data = await mentorDataController.mentorShowQuestionViewData (user_index, lesson_index);

	res.render ('mentor/showQuestion.ejs', {topnav_data : topnav_data, nav_data : nav_data, content_data : content_data});
}

// ANSWER
exports.mentorAnswerPageView = async (req, res) => {
	var user_index = req.session.user_index;
	var question_index = req.query.question_index;

	var topnav_data = await mentorDataController.mentorTopnavViewData (user_index);
	var nav_data = await mentorDataController.mentorNavViewData (user_index);
	var content_data = await mentorDataController.mentorAnswerViewData (question_index);

	res.render ('mentor/answer.ejs', {topnav_data : topnav_data, nav_data : nav_data, content_data : content_data});
}





// TEACHER

// MAIN PAGE
exports.teacherMainPageView = async (req, res) => {
	var content_data = await teacherDataController.teacherMainViewData ();

	res.render ('teacher/main.ejs', {content_data : content_data});
}

// ====================================================================================

// STUDENT TABLE PAGE
exports.teacherStudentTablePageView = async (req, res) => {
	var content_data = await teacherDataController.teacherStudentTableViewData ();

	res.render ('teacher/studentTable.ejs', {content_data : content_data});
}

// ====================================================================================

// EXAM STAT
exports.teacherExamStatPageView = async (req, res) => {
	var content_data = await teacherDataController.teacherExamStatViewData ();

	res.render('teacher/examstat.ejs', {content_data : content_data});
}

// CLASS STAT
exports.teacherClassStatPageView = async (req, res) => {
	var content_data = await teacherDataController.teacherClassStatViewData ();

	res.render('teacher/classstat.ejs', {content_data : content_data});
}

// ====================================================================================

// STUDENT RANK TABLE PAGE
exports.teacherStudentRankTablePageView = async (req, res) => {
	var content_data = await teacherDataController.teacherAllRankTableViewData();

	res.render ('teacher/studentRankTable.ejs', {content_data : content_data});
}
