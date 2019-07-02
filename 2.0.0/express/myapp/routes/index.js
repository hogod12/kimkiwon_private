var express = require('express');
var router = express.Router();

const flowController = require('../controller/flowController')
const viewController = require('../controller/viewController')

/* GET home page. */
router.get('/', flowController.Entrance);
router.get('/loginpage', viewController.LoginPageView);
router.post('/login', flowController.GiveToken);
router.get('/logout', flowController.CollectToken);

module.exports = router;
