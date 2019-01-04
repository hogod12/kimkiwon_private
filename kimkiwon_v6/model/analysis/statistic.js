const getData = require('../database/getData')
const updateData = require('../database/updateData')
const logging = require('../etc/logging')

// 시험통계 업데이트 : exam 테이블의 exam_avg, exam_std, exam_people, exam_distribution 업데이트 진행
exports.updateExamStat = async (exam_index) => {
	const result = await getData.getResultByExam(exam_index)
	const exam = await getData.getExamByIndex(exam_index)

	// 배점 합
	exam_problem_mark_sum = JSON.parse(exam[0]["exam_problem_mark"]).reduce((a,b)=>a+b)

	// 전체 성적(총점)
	var score_list = new Array()
	for (var i in result) {
		var result_score = JSON.parse(result[i]["result_score"])
		var score = result_score.reduce((a,b) => a+b) // 총점 집계
		score_list[i] = score
	}

	// 시험 응시인원
	var exam_result_people = result.length

	// 시험 응시인원 전체 평균
	var exam_result_avg = score_list.reduce((a,b)=>a+b)/exam_result_people

	// 시험 응시인원 점수 분산
	var exam_result_var = score_list.reduce((a,b)=>a+Math.pow(b-exam_result_avg, 2)/exam_result_people)

	// 시험 응시인원 표준편차
	var exam_result_std = Math.sqrt(exam_result_var)

	// 시험 점수 분포
	var exam_result_distribution = Array(10).fill(0)
	for (var i in score_list) {
		if (score_list[i] == 0) {
			exam_result_distribution[0] += 1
		}
		else {
			exam_result_distribution[ parseInt(parseInt(score_list[i]-1)/parseInt(exam_problem_mark_sum/10)) ] += 1
		}
	}

	return {exam_result_people : exam_result_people, exam_result_avg : exam_result_avg, 
		exam_result_std : exam_result_std, exam_result_distribution : exam_result_distribution}
}

// 특정 시험에 해당하는 특정 개인 성적 통계값 업데이트 
exports.updateResultStat = async (result_index, exam_index) => {
	const result = await getData.getResultByIndex(result_index)
	const result_list = await getData.getResultByExam(exam_index)
	const exam = await getData.getExamByIndex(exam_index)

	var result_sum = JSON.parse(result[0]["result_score"]).reduce((a,b) => a+b) // 1. result_sum

	var result_rank = 1 // 3. result_rank
	for (var i in result_list) {
		if (result_sum < JSON.parse(result_list[i]["result_score"]).reduce((a,b) => a+b)) {
			result_rank += 1
		}
	}

	var result_std = 100 + (result_sum - exam[0]["exam_result_avg"])*20/(exam[0]["exam_result_std"]+0.00000000001) // 2. result_std

	return { result_sum : result_sum, result_std : result_std, result_rank : result_rank }
}