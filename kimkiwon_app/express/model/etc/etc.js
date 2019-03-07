exports.TimeStamp = async () => {
	var cur_time = new Date()

	const cur_timestamp = cur_time.getFullYear() + '-' +
		cur_time.getMonth()+1 + '-' +
		cur_time.getDate() + ' ' +
		cur_time.getHours() + ':' +
		cur_time.getMinutes() + ':' +
		cur_time.getSeconds()

	return cur_timestamp
}