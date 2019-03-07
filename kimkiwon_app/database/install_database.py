import pymysql
import json
import logging

# MySql 데이터베이스 Connect
def Connection (host, user, password, db) :
	try :
		conn = pymysql.connect (host=host, user=user, password=password, db=db, charset='utf8')
		print ("# SUCCEED : Connection Succeed [host={host}, user={user}, db={db}".format(
			host=host, user=user, password=password, db=db))

		return conn
	except Exception as ex :
	 	print ("# FAILED : Connection Failed")
	 	print ("INNER ERROR MSG :", ex)

# 쿼리 실행
def QueryExec (sql, curs) :
	try :
		curs.execute(sql)
		print ("# SUCCEED : Query Exec Succeed [{sql}]".format(sql=sql))
	except Exception as ex :
		print ("# FAILED : Query Exec Failed [{sql}]".format(sql=sql))
		print ("INNER ERROR MSG :", ex)

## Create Table

# Create Table "state"
def CreateStateTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS state (
			current_year varchar(64)
		);"""

	QueryExec(sql, curs)

# Create Table "user"
def CreateUserTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS user (
			user_index int(20) unsigned not null auto_increment,
			# 유저 기본 정보
			user_name varchar(255) not null, # 유저 이름
			user_school varchar(255), # 유저 소속(학교)
			user_phonenumber varchar(255), # 유저 핸드폰 번호
			# 유저 권한 정보
			user_authority smallint(10) not null, # 유저 권한
			# 유저 접속 정보
			user_id varchar(255), # 유저 아이디 (1회에 한하여 변경 가능) / 초기값 : 유저이름+연도
			user_password varchar(255) not null, # 유저 비밀번호 (핸드폰 번호로 초기화)
			# 유저 가입 날짜
			user_date varchar(128) not null, # 유저 연도
			# 유저 진학 정보
			acceptance_index_1 int(20), # 진학 정보1
			acceptance_index_2 int(20), # 진학 정보2
			acceptance_index_3 int(20), # 진학 정보3

			primary key (user_index) 
		);"""

	QueryExec(sql, curs)

# Create Table "acceptance"
def CreateAcceptanceTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS acceptance (
			acceptance_index int(20) unsigned not null auto_increment, # 유저와 연결(피참조)
			university_index int(20) unsigned not null,
			user_index int(20) unsigned not null, # 빠른 통계 처리를 위하여 역참조 허용
			# 데이터 입력 일자
			acceptance_date varchar(64) not null,
			# 기타 특이사항 입력
			state_flag int(10) unsigned not null, # 합격 전형

			primary key (acceptance_index)
		);"""

	QueryExec(sql, curs)

# Create Table "university"
def CreateUniversityTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS university (
			university_index int(20) unsigned not null auto_increment,
			# 대학 메타 정보 (연도포함 - 몇 년도 입시 정보인지)
			university_name varchar(128) not null,
			university_department varchar(128) not null,
			university_year varchar(128) not null,
			# 대학 기본 정보 (모집정원)
			university_limit int(20),
			# 자체 부여 점수
			university_score int(20) not null, # 대학별로 가중치 부여 통계
			university_category_label int(20) not null,
			university_date varchar(64) not null,

			primary key (university_index)
		);"""

	QueryExec(sql, curs)

# Create Table "curriculum"
def CreateCurriculumTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS curriculum (
			curriculum_index int(20) unsigned not null auto_increment,
			# 커리큘럼 기본정보
			curriculum_name varchar(255) not null,
			curriculum_year varchar(64) not null,
			# 커리큘럼 설명
			curriculum_desc varchar(255),
			curriculum_date varchar(64) not null,

			primary key (curriculum_index)
		);"""

	QueryExec(sql, curs)

# Create Table "class"
def CreateClassTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS class (
			class_index int(20) unsigned not null auto_increment,
			# 해당 수업 커리큘럼
			curriculum_index int(20) unsigned not null,
			# 수업 기본정보
			class_schedule varchar(64) not null,
			class_year varchar(64) not null,
			# 수업 기타 정보
			class_date varchar(64) not null, # 수업 시작 일자

			primary key (class_index)
		);"""
	
	QueryExec(sql, curs)

# Create Table "exam"
def CreateExamTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS exam (
			exam_index int(20) unsigned not null auto_increment,
			# 시험 개요 정보
			curriculum_index int(20) unsigned not null,
			exam_name varchar(255) not null, # 시험명
			exam_type int(20) unsigned not null,
			# 시험 분류 정보
			exam_category_label int(20) not null, # 시험 1차 분류
			# 시험 정보
			exam_problem_num smallint(32) unsigned not null, # 문항개수
			exam_problem_label varchar(1024) not null, # 문항 구분(번호, title)
			exam_problem_mark varchar(512) not null, # 문항 배점(점수)
			exam_problem_desc varchar(4048) not null, # 문항 설명
			# 시험 통계 정보
			exam_result_dist varchar(512) not null, # 점수 구간별 학생 분포
			exam_result_std double(10,3) not null, # 응시자 전체 성적 표준편차
			exam_result_avg double(10,3) not null, # 응시자 전체 성적 평균
			exam_result_people int(20) unsigned not null, # 전체 응시자 수
			# 시험 데이터 생성일
			exam_date varchar(64) not null,

			primary key (exam_index)
		);"""

	QueryExec(sql, curs)


# Create Table "result"
def CreateResultTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS result (
			result_index bigint(20) unsigned not null auto_increment,
			# 결과 기본 정보 (참조)
			user_index int(20) not null,
			exam_index int(20) not null,
			# 시험 결과
			result_score varchar(512) not null, # 문항별 획득 점수
			# 시험 결과 기타정보
			result_date varchar(256), # 성적 응시 일자
			result_class varchar(256), # 성적 응시 반
			result_grader int(20) not null, # 채점자 인덱스(user_index->authority=2)
			# 시험 결과 통계값
			result_sum smallint(20), # 시험 원점수
			result_rank smallint(20), # 등수 
			# result_std smallint(20), # 서버 로드 사용자로 분산하기 위하여 depreciate

			primary key (result_index)
		);"""

	QueryExec(sql, curs)

# Create Table "question"
def CreateQuestionTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS question (
			question_index bigint(20) unsigned not null auto_increment,
			# 질문자, 응답자 인덱스
			questioner_index int(20) unsigned not null,
			answerer_index int(20) unsigned not null,
			result_index bigint(20) unsigned not null,
			# 질문 타입
			question_type int(10) unsigned not null, # 질문 타입 : 문제 질문, 성적 처리 질문
			# 질문 내용 / 정보
			question_text varchar(4048), # 질문 내용
			question_date_time varchar(64), # 질문 등록일, 시간
			answer_text varchar(4048), # 답변 내용
			answer_date_time varchar(64), # 대답 등록일, 시간

			primary key (question_index)
		);"""

	QueryExec(sql, curs)

## Drop Table
def DropStateTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE state;"""

	QueryExec(sql, curs)

def DropUserTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE user;"""

	QueryExec(sql, curs)

def DropAcceptanceTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE acceptance;"""

	QueryExec(sql, curs)

def DropUniversityTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE university;"""

	QueryExec(sql, curs)

def DropCurriculumTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE curriculum;"""

	QueryExec(sql, curs)

def DropClassTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE class;"""

	QueryExec(sql, curs)

def DropExamTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE exam;"""

	QueryExec(sql, curs)

def DropResultTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE result;"""

	QueryExec(sql, curs)

def DropQuestionTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE question;"""

	QueryExec(sql, curs)

## Controller
def uninstall (conn) :
	DropStateTable(conn)
	DropUserTable(conn)
	DropAcceptanceTable(conn)
	DropUniversityTable(conn)
	DropCurriculumTable(conn)
	DropClassTable(conn)
	DropExamTable(conn)
	DropResultTable(conn)
	DropQuestionTable(conn)
	return 1

def reinstall (conn) :
	uninstall(conn)
	install(conn)
	return 1

def install (conn) :
	CreateStateTable(conn)
	CreateUserTable(conn)
	CreateAcceptanceTable(conn)
	CreateUniversityTable(conn)
	CreateCurriculumTable(conn)
	CreateClassTable(conn)
	CreateExamTable(conn)
	CreateResultTable(conn)
	CreateQuestionTable(conn)
	return 1

if __name__ == "__main__" :
	conn = None
	while(conn == None) :
		host = input("host : ")
		user = input("user : ")
		password = input("password : ")
		database = input("database : ")

		conn = Connection(host, user, password, database)

	print ("")

	while(1) :
		print ("action in host={host}, user={user}, database={database}".format(host=host, user=user, database=database))
		action = int(input("1.install\n2.uninstall\n3.reinstall\n4.exit\n"))
		
		if action == 1 :
			install(conn)
		elif action == 2 :
			uninstall(conn)
		elif action == 3 :
			reinstall(conn)
		elif action == 4 :
			break
		else :
			continue

	exit(1)
