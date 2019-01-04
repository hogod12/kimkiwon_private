const getData = require('../database/getData')
const logging = require('../etc/logging')

exports.checkAuthority = async (user_index, user_authority) => {
	var user = await getData.getUserByIndex(user_index)
	var expected_authority = user[0]["user_authority"]

	// 요청된 유저의 권한과 요청 권한이 일치함
	if (expected_authority == user_authority) {
		return true
	}
	// 요청된 유저의 권한과 요청 권한이 일치하지 않음
	else {
		return false
	}
}