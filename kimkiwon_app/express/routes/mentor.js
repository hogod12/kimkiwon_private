var express = require('express');
var router = express.Router();

var adminDataController = require('../controller/adminDataController')
var studentDataController = require('../controller/studentDataController')
var mentorDataController = require('../controller/mentorDataController')
var viewController = require('../controller/viewController')

/* GET users listing. */
router.get('/', viewController.mentorMainView)
router.get('/questiontable', viewController.mentorQuestionTableView)
router.get('/answer', viewController.mentorAnswerView)

router.post('/addanswer', mentorDataController.UpdateAnswer)

module.exports = router;