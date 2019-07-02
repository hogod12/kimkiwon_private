var express = require('express');
var router = express.Router();

const viewController = require('../controller/viewController');
const adminDataController = require('../controller/adminDataController');

const multer = require('multer');
const upload_result_excel = multer({dest : 'result_excel/'});
const upload_user_excel = multer({dest : 'user_excel/'});

/* GET users listing. */
router.get('/', viewController.adminMainPageView);

router.get('/showlesson', viewController.adminShowLessonPageView);
router.get('/addlesson', viewController.adminAddLessonPageView);
router.post('/addlessonrequest', adminDataController.addLesson);

// ========================================================================================

// **
router.get('/showcurriculum', viewController.adminShowCurriculumPageView);
router.get('/addcurriculum', viewController.adminAddCurriculumPageView);
router.post('/addcurriculumrequest', adminDataController.addCurriculum);

// **
router.get('/detailcurriculum', viewController.adminDetailCurriculumPageView);
router.post('/updatecurriculumrequest', adminDataController.updateCurriculum);
router.get('/deletecurriculumrequest', adminDataController.deleteCurriculum);

// ========================================================================================

// **
router.get('/showexam', viewController.adminShowExamPageView);
router.get('/addexam', viewController.adminAddExamPageView);
router.post('/addexamrequest', adminDataController.addExam);

// **
router.get('/detailexam', viewController.adminDetailExamPageView);
router.post('/updateexamrequest', adminDataController.updateExam);
router.get('/deleteexamrequest', adminDataController.deleteExam)

// ========================================================================================

router.get('/showclass', viewController.adminShowClassPageView);
router.get('/addclass', viewController.adminAddClassPageView);
router.post('/addclassrequest', adminDataController.addClass);
router.get('/updateclassstaterequest', adminDataController.updateClassState);

// **
router.get('/detailclass', viewController.adminDetailClassPageView);
router.post('/updateclassrequest', adminDataController.updateClass);
router.get('/deleteclassrequest', adminDataController.deleteClass);

// ========================================================================================

// **
router.get('/showuser', viewController.adminShowUserPageView);
router.get('/adduser', viewController.adminAddUserPageView);
router.post('/adduserrequest', adminDataController.addUser);
router.post('/adduserbulkrequest', upload_user_excel.single('user_excel'), adminDataController.addUserBulk);
// **
router.get('/detailuser', viewController.adminDetailUserPageView)
router.post('/updateuserrequest', adminDataController.updateUser);
router.get('/deleteuserrequest', adminDataController.deleteUser);

// ========================================================================================

// **
router.get('/showresult', viewController.adminShowResultPageView);
router.get('/addresultbulk', viewController.adminAddResultBulkPageView);
// router.post('/addresultrequest', adminDataController.addResult);
router.post('/addresultbulkrequest', upload_result_excel.single('result_excel'), adminDataController.addResultBulk);

// **
router.get('/detailresult', viewController.adminDetailResultPageView);
router.post('/updateresultrequest', adminDataController.updateResult);
router.get('/deleteresultrequest', adminDataController.deleteResult);

// ========================================================================================

router.get('/showuniversity', viewController.adminShowUniversityPageView);
router.get('/adduniversity', viewController.adminAddUniversityPageView);
router.post('/adduniversityrequest', adminDataController.addUniversity);

router.get('/showcurriculumdomain', viewController.adminShowCurriculumDomainPageView);
router.get('/addcurriculumdomain', viewController.adminAddCurriculumDomainPageView);
router.post('/addcurriculumdomainrequest', adminDataController.addCurriculumDomain);

router.get('/showexamdomain', viewController.adminShowExamDomainPageView);
router.get('/addexamdomain', viewController.adminAddExamDomainPageView);
router.post('/addexamdomainrequest', adminDataController.addExamDomain);

router.get('/showexamtype', viewController.adminShowExamTypePageView);
router.get('/addexamtype', viewController.adminAddExamTypePageView);
router.post('/addexamtyperequest', adminDataController.addExamType);

router.get('/systemsetting', viewController.adminSystemSettingPageView);
router.post('/addyearrequest', adminDataController.addYear);

router.get('/updatesystemyear', adminDataController.updateSystemYear);

module.exports = router;
