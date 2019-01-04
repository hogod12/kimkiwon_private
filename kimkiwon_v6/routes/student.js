var express = require('express');
var router = express.Router();

const viewController = require('../controller/viewController')
const databaseController = require('../controller/databaseController')

router.get('/', viewController.studentPage)
router.get('/result', viewController.studentResultPage) // 성적표 페이지
router.get('/question', viewController.studentQuestionPage) // 질문입력 페이지

// 액션
router.post('/submitquestion', databaseController.studentSubmitQuestion)

module.exports = router;
