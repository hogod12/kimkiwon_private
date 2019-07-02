exports.timeStamp = async () => {
	var cur_time = new Date()

	const cur_timestamp = cur_time.getFullYear() + '-' +
		("00" + String(parseInt(cur_time.getMonth())+1)).slice(-2) + '-' +
		("00" + cur_time.getDate()).slice(-2) + ' ' +
		("00" + cur_time.getHours()).slice(-2) + ':' +
		("00" + cur_time.getMinutes()).slice(-2) + ':' +
		("00" + cur_time.getSeconds()).slice(-2)

	return cur_timestamp
}