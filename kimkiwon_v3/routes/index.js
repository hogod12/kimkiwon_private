var express = require('express');
var router = express.Router();

const mainController = require('../controller/mainController')
const viewController = require('../controller/viewController')
const databaseController = require('../controller/databaseController')

const multer = require("multer")
const upload = multer({dest : 'user_excel/'})

/* GET home page. */
router.get('/', mainController.index)

router.post('/login', mainController.login)
router.get('/logout', mainController.logout)

router.post('/addExam', databaseController.addExam)
router.post('/addResult', databaseController.addResult)
router.post('/addUserExcel', upload.single("user_excel"), databaseController.addUserExcel)
router.post('/addResultExcel', upload.single("result_excel"), databaseController.addResultExcel)
router.post('/updateResult', databaseController.updateResult)
router.get('/deleteExam', databaseController.deleteExam)
router.post('/updateExam', databaseController.updateExam)
router.post('/addUser', databaseController.addUser)
router.get('/deleteUser', databaseController.deleteUser)
router.post('/updateUser', databaseController.updateUser)

router.get('/loginPage', viewController.loginPage)
router.get('/studentPage', viewController.studentPage)
router.get('/mentorPage', viewController.mentorPage)
router.get('/adminPage', viewController.adminPage)
router.get('/badErrorPage', viewController.badErrorPage)

router.get('/adminPage_addExam', viewController.adminPage_addExam)
router.get('/adminPage_addUser', viewController.adminPage_addUser)
router.get('/adminPage_addResult', viewController.adminPage_addResult)
router.get('/adminPage_showUser', viewController.adminPage_showUser)
router.get('/adminPage_showResult', viewController.adminPage_showResult)

module.exports = router;
