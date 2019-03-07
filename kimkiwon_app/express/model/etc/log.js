const etc = require('./etc')

exports.Log = async (label, context) => {
	var timestamp = await etc.TimeStamp()
	console.log(`[${timestamp}] ${label} : ${context}`)

	return true // 로그 동작 성공
} 