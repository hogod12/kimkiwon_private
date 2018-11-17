const database = require ('./dbController')
const getData = require ('./getData')
const logger = require ('./writeLog')

exports.checkAuthority = async (user_index, user_authority) => {
	var real_user = await getData.getUser(user_index)
	var real_user_authority = real_user[0]["user_authority"]

	if (real_user_authority == user_authority) {
		return true
	} else {
		return false
	}

	// 예외 상황
	return false
}