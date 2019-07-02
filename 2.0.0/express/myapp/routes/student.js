var express = require('express');
var router = express.Router();

const viewController = require ('../controller/viewController');
const studentDataController = require ('../controller/studentDataController');

const multer = require ('multer');
const upload_question_image = multer({dest : 'question_image/'});

// Main Page of Student Page
router.get('/', viewController.studentMainPageView);

// ========================================================================================

// Result Page of Student Page
router.get('/showresult', viewController.studentResultPageView);

// ========================================================================================

// Question Page of Student Page
router.get('/question', viewController.studentQuestionPageView);
router.post('/updatequestionrequest', upload_question_image.single('question_image'), studentDataController.updateQuestion);

// ========================================================================================

// Report Page of Student Page
// router.get('/report', viewController.studentReportPageView);

module.exports = router;
