var express = require('express');
var router = express.Router();

const multer = require("multer")
const upload_user_excel = multer({dest : "user_excel/"})
const upload_result_excel = multer({dest : "result_excel/"})

const viewController = require('../controller/viewController')
const databaseController = require('../controller/databaseController')

// 관리자 뷰
router.get('/', viewController.adminPage) // 관리자 메인페이지(관리자 초기접속)
router.get('/adduser', viewController.adminAddUserPage) // 유저추가 페이지
router.get('/showuser', viewController.adminShowUserPage) // 유저현황 페이지
router.get('/addexam', viewController.adminAddExamPage) // 시험추가 페이지
router.get('/showexam', viewController.adminShowExamPage) // 시험현황 페이지
router.get('/addresult', viewController.adminAddResultPage) // 결과추가 페이지
router.get('/showresult', viewController.adminShowResultPage) // 결과현황 페이지

// 액션

// 유저 추가 페이지
router.post('/adduserdata', databaseController.adminAddUserData)
router.post('/adduserdatabulk', upload_user_excel.single("user_excel"),databaseController.adminAddUserDataBulk)

// 유저 현황 페이지
router.post('/updateuser', databaseController.adminUpdateUser)
router.get('/deleteuser', databaseController.adminDeleteUser)

// 시험 추가 페이지
router.post('/addexamdata', databaseController.adminAddExamData)

// 시험 현황 페이지
router.post('/updateexam', databaseController.adminUpdateExam)
router.get('/deleteexam', databaseController.adminDeleteExam)

// 결과 추가 페이지
router.post('/addresultdata', databaseController.adminAddResultData)
router.post('/addresultdatabulk', upload_result_excel.single("result_excel"),databaseController.adminAddResultDataBulk)

module.exports = router;