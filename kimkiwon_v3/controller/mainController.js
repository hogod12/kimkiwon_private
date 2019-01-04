const security = require('../model/security')
const writeLog = require('../model/writeLog')
const getData = require('../model/getData')

exports.index = async (req, res) => {
	var session_user_authority = req.session.user_authority
	var session_user_index = req.session.user_index // 보안처리
	var host = req.headers.host

	// 세션 권한 체크
	// 권한이 존재하지 않는 접속자
	if (session_user_authority == undefined || session_user_authority == 0) {
		writeLog.writeTimestampLog("확인되지 않은 접속자", `host : ${host}`)
		res.redirect('/loginPage')
	} 
	// 학생 권한을 가지는 접속자
	else if (session_user_authority == 1) {
		checkAuthority = await security.checkAuthority(session_user_index, session_user_authority)

		// 데이터베이스 상 유저 아이디와 권한 비교
		// 일치
		if (checkAuthority == true) {
			writeLog.writeTimestampLog("학생 접속자", `host : ${host}`)
			res.redirect('/studentPage')
		}
		// 아마 나쁜놈...? 일 가능성이 큼
		else {
			writeLog.writeTimestampLog("비정상 접속자", `host : ${host}`)
			res.redirect('/BadErrorPage')
		}
	}
	// 멘토 권한을 가지는 접속자 (depreciated) : 현재 개발 중
	else if (session_user_authority == 2) {
		checkAuthority = await security.checkAuthority(session_user_index, session_user_authority)
		
		// 데이터베이스 상 유저 아이디와 권한 비교
		// 일치
		if (checkAuthority == true) {
			writeLog.writeTimestampLog("멘토 접속자", `host : ${host}`)
			res.redirect('/mentorPage')
		}
		// 아마 나쁜놈...? 일 가능성이 큼
		else {
			writeLog.writeTimestampLog("비정상 접속자", `host : ${host}`)
			res.redirect('/BadErrorPage')
		}
	}
	// 멘토 권한을 가지는 접속자
	else if (session_user_authority == 3) {
		checkAuthority = await security.checkAuthority(session_user_index, session_user_authority)
		
		// 데이터베이스 상 유저 아이디와 권한 비교
		// 일치
		if (checkAuthority == true) {
			writeLog.writeTimestampLog("관리자 접속자", `host : ${host}`)
			res.redirect('/adminPage')
		}
		// 아마 나쁜놈...? 일 가능성이 큼
		else {
			writeLog.writeTimestampLog("비정상 접속자", `host : ${host}`)
			res.redirect('/BadErrorPage')
		}
	}
	// 아마 나쁜놈...? 일 가능성이 큼
	else {
		writeLog.writeTimestampLog("비정상 접속자", `host : ${host}`)
		res.redirect('/BadErrorPage')
	}
}

exports.login = async (req, res) => {
	var sess = req.session
	var user_index = req.body.user_index // user_name임
	var user_password = req.body.user_password

	var user = await getData.findUser(user_index, user_password)

	// 유저 인증 정보에 따른 처리 진행
	// 해당 정보로 검색되는 유저가 1명이어야 인증 진행
	if (user.length == 1) {
		var real_user_password = user[0]["user_password"]
		
		// 인증성공 => 인증이 성공 할 경우, 세션에 적절한 권한을 부여하고 메인 페이지로의 리다이렉션 진행
		if (real_user_password == user_password) {
			console.log(user[0]["user_authority"])
			sess.user_index = user[0]["user_index"]
			sess.user_authority = user[0]["user_authority"]
			
			res.redirect('/')
		} 
		// 인증실패
		else {
			writeLog.writeTimestampLog("인증실패", `잘못된 패스워드를 입력하였습니다. ${user_password}`)
			res.redirect('/loginPage') // 인증실패
		}
	} 
	// 해당 정보로 검색되는 유저가 0명인 경우, 틀린 유저코드를 입력함
	else if (user.length == 0) {
		writeLog.writeTimestampLog("인증실패", "user_index가 존재하지 않습니다.")
		res.redirect('/loginPage') // 인증실패
	} 
	// 해당 정보로 검색되는 유저가 2명 이상인 경우, 데이터 베이스에 중복 유저코드 발생 점검 필요함
	else {
		writeLog.writeTimestampLog("CRITICAL", "중복되는 user_index가 존재합니다. 데이터베이스 점검 필요!")
		res.redirect('/loginPage') // 인증실패
	}
}

exports.logout = async (req, res) => {
	console.log(req.session)
	req.session.destroy((err) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/')
		}
	})
}

