exports.ArraySum = async (array_) => {
	const result = array_.reduce((a,b)=>a+b)
	return result
}

exports.StringArraySum = async (array_) => {
	const result = array_.reduce( (a,b)=>parseInt(a)+parseInt(b) )
	return result
}