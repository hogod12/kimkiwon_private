exports.writeTimestampLog = async(category, context) => {
	var timestamp = new Date()
	console.log(`[${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] ${category} : ${context}`)

	return 1 // 로그 동작 성공
}