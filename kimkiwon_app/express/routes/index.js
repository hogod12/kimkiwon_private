var express = require('express');
var router = express.Router();

const flowController = require('../controller/flowController')
const adminDataController = require('../controller/adminDataController')
const viewController = require('../controller/viewController')

/* GET home page. */
router.get('/', flowController.index)
router.get('/loginpage', viewController.loginView)
router.post('/login', flowController.login)
router.get('/logout', flowController.logout)

module.exports = router;
