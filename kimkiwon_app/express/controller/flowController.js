const getData = require('../model/getData')
const log = require('../model/etc/log')

exports.test = async (req, res) => {
	res.render("admin_addcurriculum.ejs")
}


// 웹페이지 메인 플로우 컨트롤
exports.index = async (req, res) => {
	var session_user_authority = req.session.user_authority // 유저 권한
	var session_user_id = req.session.user_id // 유저 아이디
	var session_user_password = req.session.user_password // 유저 패스워드
	var session_user_ip = req.header.host // 접속자 IP


	// 권한을 가지지 않은 접속자 (로그인 전)
	if (session_user_authority == undefined || session_user_authority == 0) {
		log.Log('권한을 소유하지 않은 접속자', `host : ${session_user_ip}`)
		res.redirect('/loginpage')
	}

	// 정의된 권한을 가지는 접속자
	else if (session_user_authority == 1 || session_user_authority == 2 || session_user_authority == 3) {
		// 요청된 유저 권한과 유저의 소유 권한 비교
		var session_user_index = await getData.getUserIndexByIdPassword(session_user_id, session_user_password)
		
		// 유저 1명 정상 검색됨
		if (session_user_index.length == 1) {
			session_user_index = session_user_index[0]['user_index'] // 유저인덱스

			// 학생 접속자
			if (session_user_authority == 1) {
				log.Log('학생 권한을 소유한 접속자', `user_id : ${session_user_id} / host : ${session_user_ip}`)
				res.redirect('/student')
			}

			// 멘토 접속자
			else if (session_user_authority == 2) {
				log.Log('멘토 권한을 소유한 접속자', `user_id : ${session_user_id} / host : ${session_user_ip}`)
				res.redirect('/mentor')
			}

			// 관리자 접속자 => 나중에 기기 컨트롤까지 진행할 것
			else if (session_user_authority == 3) {
				log.Log('관리자 권한을 소유한 접속자', `user_id : ${session_user_id} / host : ${session_user_ip}`)
				res.redirect('/admin')
			}
		}

		// 부여될 수없는 세션요청
		else {
			log.Log('의심스러운 요청', `user_id : ${session_user_id} / user_authority : ${session_user_authority} / host : ${session_user_ip}`)
			res.redirect('/badpage')
		}
	}

	else {
		log.Log('의심스러운 요청', `user_id : ${session_user_id} / user_authority : ${session_user_authority} / host : ${session_user_ip}`)
		res.redirect('/badpage')
	}
}

// 로그인 진행
exports.login = async (req,res) => {
	var sess = req.session
	user_id = req.body.user_id
	user_password = req.body.user_password

	log.Log('로그인 요청', `user_id : ${user_id} / user_password : ${user_password}`)

	// 로그인 정보와 일치하는 유저 검색
	var user_index = await getData.getUserIndexByIdPassword(user_id, user_password)

	if (user_index.length == 0) {
		// 로그인 실패
		log.Log('로그인 실패', `일치하는 유저가 없음 / user_id : ${user_id} / user_password : ${user_password}`)
	} else if (user_index.length == 1) {
		// 로그인 성공
		sess.user_id = user_id
		sess.user_password = user_password
		sess.user_authority = (await getData.getUserAuthorityByUserIndex(user_index[0]['user_index']))[0]['user_authority']
		log.Log('로그인 성공', `user_id : ${user_id} / user_password : ${user_password}`)

		res.redirect('/')
	} else {
		// 치명적 에러 중복
		log.Log('ERROR', `중복 유저 발생 / user_id : ${user_id} / user_password : ${user_password}`)
	}
}


// 로그아웃 진행
exports.logout = async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/')
		}
	})
}