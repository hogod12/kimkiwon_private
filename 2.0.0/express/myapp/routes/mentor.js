var express = require('express');
var router = express.Router();

const viewController = require ('../controller/viewController');
const mentorDataController = require ('../controller/mentorDataController');

/* GET users listing. */
router.get('/', viewController.mentorMainPageView);
router.get('/showquestion', viewController.mentorShowQuestionPageView);
router.get('/answer', viewController.mentorAnswerPageView);
router.post('/updateanswerrequest', mentorDataController.updateAnswer);


module.exports = router;
