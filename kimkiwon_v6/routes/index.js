var express = require('express');
var router = express.Router();

const mainController = require('../controller/mainController')
const viewController = require('../controller/viewController')

// 초기접속 : 클라이언트 세션 상태에 따라 리다이렉션 진행 (index)
router.get('/', mainController.index)

// 로그인 페이지
router.get('/loginpage', viewController.loginPage)

// 로그인, 로그아웃
router.post('/login', mainController.login)
router.get('/logout', mainController.logout)

module.exports = router;
