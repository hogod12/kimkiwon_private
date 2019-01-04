const logging = require('../model/etc/logging')
const login = require('../model/etc/login')
const getData = require('../model/database/getData')

exports.index = async (req, res) => {
	var session_user_authority = req.session.user_authority
	var session_user_index = req.session.user_index
	var host = req.headers.host

	// # 접속자 세션 권한 체크
	// 권한을 가지지 않은 접속자 (로그인 전)
	if (session_user_authority == undefined || session_user_authority == 0) {
		logging.writeTimestampLog("# 확인되지 않은 접속자", `host : ${host}`)
		res.redirect('/loginpage')
	} 

	// 정의된 권한을 가지는 접속자
	else if (session_user_authority == 1 || session_user_authority == 2 || session_user_authority == 3) {
		checkAuthority = await login.checkAuthority(session_user_index, session_user_authority)
		// 요청된 유저 권한과 유저의 권한 비교
		if (checkAuthority == true) {
			if (session_user_authority == 1) {
				logging.writeTimestampLog("# 학생 접속자", `user_index : ${session_user_index} / host : ${host}`)
				res.redirect('/student')
			}
			else if (session_user_authority == 2) {
				logging.writeTimestampLog("# 멘토 접속자", `user_index : ${session_user_index} / host : ${host}`)
				res.redirect('/mentor')
			}
			else if (session_user_authority == 3) {
				logging.writeTimestampLog("# 관리자 접속자", `user_index : ${session_user_index} / host : ${host}`)
				res.redirect('/admin')
			}
		}
		// 세션의 유저 권한과 요청한 권한이 일치하지 않음
		else {
			logging.writeTimestampLog("! 변조 가능성이 존재하는 권한 요청", `user_index : ${session_user_index} / user_authority : ${session_user_authority} / host : ${host}`)
			res.redirect('/badpage')
		}
	}
	// 정의되지 않은 권한 요청
	else {
		logging.writeTimestampLog("! 정의되지 않은 권한 요청", `user_index : ${session_user_index} / host : ${host}`)
		res.redirect('/badpage')
	}
}

exports.login = async (req, res) => {
	var sess = req.session
	var user_name = req.body.user_name
	var user_phonenumber = req.body.user_password //체크

	var user = await getData.getUserByInfo(user_name, user_phonenumber) // 로그인 정보와 일치하는 유저 탐색

	// 탐색된 유저가 1명 (정상)
	if (user.length == 1) {
		sess.user_index = user[0]["user_index"]
		sess.user_authority = user[0]["user_authority"]
		logging.writeTimestampLog("# 인증성공", `user_name : ${user_name} / user_phonenumber : ${user_phonenumber}`)

		res.redirect('/')
	}
	// 탐색된 유저가 0명 (인증실패)
	else if (user.length == 0) {
		logging.writeTimestampLog("# 인증실패", `일치하는 유저가 존재하지 않습니다. user_name : ${user_name} / user_phonenumber : ${user_phonenumber}`)
		res.redirect('/')
	}
	// 탐색된 유저가 여러 명 (DB Cracktion)
	else {
		logging.writeTimestampLog("! 인증실패", `여러 명의 유저가 존재합니다. user_name : ${user_name} / user_phonenumber : ${user_phonenumber}`)
		res.redirect('/')
	}
}

exports.logout = async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/')
		}
	})
}