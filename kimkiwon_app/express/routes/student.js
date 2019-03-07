var express = require('express');
var router = express.Router();

var adminDataController = require('../controller/adminDataController')
var studentDataController = require('../controller/studentDataController')
var viewController = require('../controller/viewController')

/* GET users listing. */
router.get('/', viewController.studentMainView)
router.get('/report', viewController.studentReportView)
router.get('/question', viewController.studentQuestionView)
router.get('/analysis', viewController.studentAnalysisView)

router.post('/addquestion', studentDataController.AddQuestion)

module.exports = router;