var express = require('express');
var router = express.Router();

const viewController = require ('../controller/viewController');
const teacherDataController = require ('../controller/teacherDataController');

/* GET users listing. */
router.get('/', viewController.teacherMainPageView);

router.get('/studenttable', viewController.teacherStudentTablePageView);
router.get('/changeauthentication', teacherDataController.changeAuthentication);

router.get('/examstat', viewController.teacherExamStatPageView);
router.get('/classstat', viewController.teacherClassStatPageView);

router.get('/studentranktable', viewController.teacherStudentRankTablePageView);


/* SideBar Tab Request */

/* SideBar Menu 1 */
// router.get('/studentlist', viewController.StudentList)

/* SideBar Menu 2 */
// router.get('/statistic/student', viewController.StudentStatistic)
// router.get('/statistic/class', viewController.ClassStatistic)
// router.get('/statistic/class/studentlist', viewController.ClassStudentList)
// router.get('/statistic/exam', viewController.ExamStatistic)
// router.get('/statistic/exam/resultlist', viewController.ExamResultList)
// router.get('/statistic/accept', viewController.AcceptStatistic)

/* SideBar Menu 3 */
// router.get('/sidaen', viewController.SidaeN)

/* SideBar Menu 4 */
// router.get('/acceptance', viwController.Acceptance)

module.exports = router;
