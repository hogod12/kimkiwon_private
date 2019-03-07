const getData = require('../getData')
const updateData = require('../updateData')
const log = require('../etc/log')
const math = require('./math')

exports.updateResultRank = async (exam_index) => {
	const result_data = await getData.getResultDataByExamIndex(exam_index)

	var score_list = new Array()
	for (var i in result_data) {
		score_list[i] = result_data[i]['result_sum']
	}

	var sorted_score_list = score_list.slice().sort(function(a,b){return b-a})

	for (var i in result_data) {
		var result_rank = sorted_score_list.indexOf(result_data[i]['result_sum'])
		result = await updateData.updateResultRank(result_data[i]['result_index'], result_rank+1)
	}

	return true
}

exports.updateExamStatistics = async (exam_index) => {
	const result_data = await getData.getResultDataByExamIndex(exam_index)
	const exam_data = await getData.getExamDataByExamIndex(exam_index)

	// 배점 합
	exam_problem_mark_sum = await math.StringArraySum(JSON.parse(exam_data[0]["exam_problem_mark"]))

	// 응시인원
	var exam_result_people = result_data.length
	var exam_result_avg = 0
	var exam_result_std = 0
	var exam_result_dist = Array(10).fill(0) // 크기 10으로 제한됨

	// 해당 시험 응시자 전체 원점수 리스트
	var score_list = new Array()
	for (var i=0 ; i<result_data.length ; i++) {
		score_list[i] = result_data[i]['result_sum']
	}

	// 시험 응시인원 전체 평균
	exam_result_avg = score_list.reduce((a,b)=>a+b)/exam_result_people

	// 시험 응시인원 전체 분산
	exam_result_var = score_list.reduce((a,b)=>a+Math.pow(b-exam_result_avg, 2)/exam_result_people)

	// 시험 응시인원 전체 표준편차
	exam_result_std = Math.sqrt(exam_result_var)

	// 시험 점수 분포
	for (var i=0 ; i<result_data.length ; i++) {
		if (score_list[i] == 0) {
			exam_result_dist[0] += 1
		}
		else {
			exam_result_dist[parseInt(parseInt(score_list[i]-1)/parseInt(exam_problem_mark_sum/10))] += 1
		}
	}

	exam_result_dist_string = JSON.stringify(exam_result_dist)


	// 시험 테이블 데이터 변경
	result = await updateData.updateExamStatistics(exam_index, exam_result_people, exam_result_avg, exam_result_std, exam_result_dist_string)

	return result
}