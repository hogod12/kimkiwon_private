var express = require('express');
var router = express.Router();

var adminDataController = require('../controller/adminDataController')
var viewController = require('../controller/viewController')

const multer = require('multer')
const upload_result_excel = multer({dest : 'result_excel/'})
const upload_user_excel = multer({dest : 'user_excel/'})

/* GET users listing. */
router.get('/', viewController.adminMainView)

router.get('/adduser', viewController.addUserView)
router.get('/addcurriculum', viewController.addCurriculumView)
router.get('/addexam', viewController.addExamView)
router.get('/addresult', viewController.addResultView)
router.get('/addclass', viewController.addClassView)
router.get('/adduniversity', viewController.addUniversityView)
router.get('/addacceptance', viewController.addAcceptanceView)

router.get('/showuser', viewController.showUserView)
router.get('/showcurriculum', viewController.showCurriculumView)
router.get('/showclass', viewController.showClassView)
router.get('/showexam', viewController.showExamView)
router.get('/showresult', viewController.showResultView)

router.post('/adduserdata', adminDataController.AddUser)
router.post('/addcurriculumdata', adminDataController.AddCurriculum)
router.post('/addexamdata', adminDataController.AddExam)
router.post('/addclassdata', adminDataController.AddClass)
router.post('/adduniversitydata', adminDataController.AddUniversity)
router.post('/addacceptancedata', adminDataController.AddAcceptance)

router.get('/deleteuserdata', adminDataController.DeleteUser)

router.post('/addresultdatabulk', 
	upload_result_excel.single('result_excel'), 
	adminDataController.AddResultBulk)

router.post('/adduserdatabulk',
	upload_user_excel.single('user_excel'),
	adminDataController.AddUserBulk)

module.exports = router;

