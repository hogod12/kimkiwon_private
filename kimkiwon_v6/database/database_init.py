import pymysql
import json
import logging

# mysql 데이터베이스 connect
def connection (host, user, password, db) :
	try :
		conn = pymysql.connect (host=host, user=user, password=password, db=db, charset='utf8')
		print ("# SUCCEED : Connection Succeed [host={host}, user={user}, db={db}]".format(
			host=host, user=user, db=db))

		return conn

	except :
		print ("# FAILED : Connection Failed")
		exit(-1)

# 쿼리 실행
def queryExec (sql, curs) :
	try :
		curs.execute(sql)
		print ("# SUCCEED : Query Exec Succeed [{sql}]".format(sql=sql))

	except :
		print ("# FAILED : Query Exec Failed [{sql}]".format(sql=sql))

# =============== TABLE INIT
def createCompanyTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS company (
			company_index smallint(20) unsigned not null auto_increment,
			company_name varchar(255) not null,
			
			primary key (company_index)
		);"""

	queryExec(sql, curs)

def createUserTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS user (
			user_index int(20) unsigned not null auto_increment,
			user_name varchar(255) not null, # 유저 개인정보(이름)
			user_school varchar(255), # 유저 개인정보(학교)
			user_phonenumber varchar(255), # 유저 개인정보(연락처)
			user_authority smallint(10) not null, # 유저 권한
			user_password varchar(255), # 유저 비밀번호
			
			primary key (user_index)
		);"""

	queryExec(sql, curs)

def createExamTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS exam (
			exam_index smallint(20) unsigned not null auto_increment,
			exam_name varchar(255) not null, # 시험명
			
			exam_problem_num smallint(32) unsigned not null, # 문항개수
			exam_problem_label varchar(1024) not null, # 문항번호
			exam_problem_mark varchar(512) not null, # 문항배점
			exam_problem_desc varchar(4048) not null, # 문항 설명

			exam_result_distribution varchar(512) not null, # 점수 구간별 학생 분포
			exam_result_std double(10,3) not null, # 응시자 전체 성적 표준편차
			exam_result_avg double(10,3) not null, # 응시자 전체 성적 평균
			exam_result_people int(20) unsigned not null, # 전체 응시자 수

			primary key (exam_index)
		);"""

	queryExec(sql, curs)

def createResultTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS result (
			result_index bigint(20) unsigned not null auto_increment,
			user_index int(20) not null,
			exam_index smallint(20) not null,

			result_score varchar(512) not null, # 문항별 획득 점수

			result_sum smallint(20), # 시험점수
			result_std smallint(20), # 표준점수
			result_rank smallint(20), # 등수

			result_tag varchar(256) not null, # 결과값 분류태그

			primary key (result_index)
		);"""

	queryExec(sql, curs)

def createQuestionTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS tag (
			question_index bigint(20) unsigned not null auto_increment,
			mentor_index bigint(20) not null,
			student_index bigint(20) not null,

			question_content varchar(256) not null,
			answer_content varchar(256) not null,

			primary key (question_index)
		);"""

	queryExec(sql, curs)

# =============== TABLE DROP
def dropCompanyTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE company;"""

	queryExec(sql, curs)

def dropUserTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE user;"""

	queryExec(sql, curs)

def dropExamTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE exam;"""

	queryExec(sql, curs)

def dropResultTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE result;"""

	queryExec(sql, curs)

def dropQuestionTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE question;"""

	queryExec(sql, curs)

# =============== TABLE ADD

def addUser (user_name, user_school, user_phonenumber, user_authority, user_password, conn) :
	curs = conn.cursor(pymysql.cursors.DictCursor)
	sql = """INSERT INTO user (user_name, user_school, user_phonenumber, user_authority, user_password) VALUES
		(\'{user_name}\', \'{user_school}\', \'{user_phonenumber}\', {user_authority}, \'{user_password}\');""".format(
			user_name=pymysql.escape_string(user_name),
			user_school=pymysql.escape_string(user_school),
			user_phonenumber=pymysql.escape_string(user_phonenumber),
			user_authority=user_authority,
			user_password=pymysql.escape_string(user_password))

	queryExec(sql, curs)
	conn.commit()

def addExam (exam_name, 
	exam_problem_num, exam_problem_label, exam_problem_mark, exam_problem_desc, 
	exam_result_distribution, exam_result_std, exam_result_avg, exam_result_people) :
	curs = conn.cursor(pymysql.cursors.DictCursor)
	sql = """INSERT INTO exam (exam_name, 
		exam_problem_num, exam_problem_label, exam_problem_mark, exam_problem_desc, 
		exam_result_distribution, exam_result_std, exam_result_avg, exam_result_people) VALUES
		({exam_name}, 
		{exam_problem_num}, {exam_problem_label}, {exam_problem_mark}, {exam_problem_desc}, 
		{exam_result_distribution}, {exam_result_std}, {exam_result_avg}, {exam_result_people});""".format(
			exam_name=pymysql.escape_string(exam_name),
			exam_problem_num=exam_problem_num,
			exam_problem_label=pymysql.escape_string(exam_problem_label),
			exam_problem_mark=pymysql.escape_string(exam_problem_mark),
			exam_problem_desc=pymysql.escape_string(exam_problem_desc),
			exam_result_distribution=pymysql.escape_string(exam_result_distribution),
			exam_result_std=exam_result_std,
			exam_result_avg=exam_result_avg,
			exam_result_people=exam_result_people)

	queryExec(sql, curs)
	conn.commit()

# =============== DATABASE INSTALL/UNINSTALL
def uninstall (conn) :
	dropCompanyTable(conn)
	dropUserTable(conn)
	dropExamTable(conn)
	dropResultTable(conn)
	dropQuestionTable(conn)

def install (conn) :
	createCompanyTable(conn)
	createUserTable(conn)
	createExamTable(conn)
	createResultTable(conn)
	createQuestionTable(conn)

	addUser("학생", "광양제철고", "010-4728-5052", 1, "359214hsj*ABC", conn)
	addUser("멘토", "광양제철고", "010-4728-5052", 2, "359214hsj*ABC", conn)
	addUser("관리자", "광양제철고", "010-4728-5052", 3, "359214hsj*ABC", conn)
	addUser("비정상", "광양제철고", "010-4728-5052", 4, "359214hsj*ABC", conn)

conn = connection("localhost", "root", "359214hsj*ABC", "kimkiwon_v6")
uninstall(conn)
install(conn)