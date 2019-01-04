var express = require('express');
var router = express.Router();

const viewController = require('../controller/viewController')

// 멘토 뷰
router.get('/', viewController.mentorPage) // 멘토 메인페이지(멘토 초기 접속)
router.get('/result', viewController.mentorResultPage) // 성적입력 페이지
router.get('/answer', viewController.mentorAnswerPage) // 질문현황 페이지

module.exports = router;