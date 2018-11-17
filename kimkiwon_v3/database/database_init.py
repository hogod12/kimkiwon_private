import pymysql
import json
import logging

def mysql_connect (host, user, password, db) :
	try :
		conn = pymysql.connect (host=host, user=user, password=password, db=db, charset='utf8')
		
		print ("# exec")
		print ("connection succeed")
		
		return conn	
	except : # ERROR 메시지 종류 확인하면 맞춰서 예외처리
		print ("# exec")
		print ("connection failed")

		exit(-1)

def init_database (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	# TODO 데이터 베이스 미생성 예외처리

def exec_query (sql, curs) :
	try :
		curs.execute(sql)
		print ("# exec")
		print ("query exec succeed")
	except :
		print ("# exec")
		print ("query exec failed")

def init_table_company (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)

	sql = """CREATE TABLE IF NOT EXISTS company (
			company_index bigint(20) unsigned not null auto_increment,
			company_name varchar(255) not null,
			primary key (company_index)
		);"""

	print ("# query")
	print (sql)

	exec_query(sql, curs)

def init_table_user (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)

	sql = """CREATE TABLE IF NOT EXISTS user (
			user_index bigint(20) unsigned not null auto_increment,
			user_name varchar(255) not null,
			company_index bigint(20) unsigned,
			user_authority bigint(20) not null,
			user_phonenumber varchar(255),
			user_school varchar(255),
			user_password varchar(255),
			primary key (user_index)
		);"""

	print ("# query")
	print (sql)

	exec_query(sql, curs)

# 통계치 해당 데이터 베이스에 포함 시킬지???
def init_table_exam (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)

	sql = """CREATE TABLE IF NOT EXISTS exam (
			exam_index bigint(20) unsigned not null auto_increment,
			exam_name varchar(255) not null,
			exam_problemcount bigint(32) unsigned not null,
			exam_time bigint(32) unsigned,
			exam_label varchar(1024) not null,
			exam_score varchar(512) not null,
			exam_dist varchar(512) not null,
			exam_desc varchar(512),
			exam_std bigint(64),
			exam_avg bigint(64),
			exam_people bigint(64),
			primary key (exam_index)
		);"""

	print ("# query")
	print (sql)

	exec_query(sql, curs)

def init_table_result (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)

	sql = """CREATE TABLE IF NOT EXISTS result (
			result_index bigint(20) unsigned not null auto_increment,
			result_name varchar(255) not null,
			user_index bigint(20) unsigned not null,
			exam_index bigint(20) unsigned not null,
			result_result varchar(512) not null,
			result_std bigint(20),
			result_rank bigint(20),
			primary key (result_index)
		);"""

	print ("# query")
	print (sql)

	exec_query(sql, curs)

def drop_table_company (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)

	sql = """DROP TABLE company;"""

	print ("# query")
	print (sql)

	exec_query(sql, curs)

def drop_table_user (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)

	sql = """DROP TABLE user;"""

	print ("# query")
	print (sql)

	exec_query(sql, curs)

def drop_table_exam (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)

	sql = """DROP TABLE exam;"""

	print ("# query")
	print (sql)

	exec_query(sql, curs)

def drop_table_result (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)

	sql = """DROP TABLE result;"""

	print ("# query")
	print (sql)

	exec_query(sql, curs)

def add_user (user_name, company_index, user_authority, user_phonenumber, user_school, user_password, conn) :
	curs = conn.cursor(pymysql.cursors.DictCursor)

	sql = """INSERT INTO user (user_name, company_index, user_authority, user_phonenumber, user_school, user_password) VALUES
			(\'{user_name}\', {company_index}, {user_authority}, \'{user_phonenumber}\', \'{user_school}\', \'{user_password}\');""".format(
				user_name=user_name,
				company_index=company_index,
				user_authority=user_authority,
				user_phonenumber=user_phonenumber,
				user_school=user_school,
				user_password=user_password)

	print ("# query")
	print (sql)

	exec_query(sql, curs)

	conn.commit()

def add_exam (exam_name, exam_problemcount, exam_time, exam_label, exam_score, exam_desc, exam_dist, exam_std, exam_avg, exam_people, conn) :
	curs = conn.cursor(pymysql.cursors.DictCursor)

	sql = """INSERT INTO exam (exam_name, exam_problemcount, exam_time, exam_label, exam_score, exam_desc, exam_dist, exam_std, exam_avg, exam_people) VALUES
			(\'{exam_name}\', {exam_problemcount}, {exam_time}, \'{exam_label}\', \'{exam_score}\', \'{exam_desc}\', \'{exam_dist}\', {exam_std}, {exam_avg}, {exam_people});""".format(
				exam_name=exam_name,
				exam_problemcount=exam_problemcount,
				exam_time=exam_time,
				exam_label=exam_label,
				exam_score=exam_score,
				exam_desc=exam_desc,
				exam_dist=exam_dist,
				exam_std=exam_std,
				exam_avg=exam_avg,
				exam_people=exam_people)

	print ("# query")
	print (sql)

	exec_query(sql, curs)

	conn.commit()

def uninstall (conn) :
	drop_table_company(conn)
	drop_table_user(conn)
	drop_table_exam(conn)
	drop_table_result(conn)

def install (conn) :
	init_table_company(conn)
	init_table_user(conn)
	init_table_exam(conn)
	init_table_result(conn)

	add_user("학생", 1, 1, "359214hsj*A", "광양제철고", "359214hsj*A", conn)
	add_user("멘토", 1, 2, "359214hsj*A", "광양제철고", "359214hsj*A", conn)
	add_user("관리자", 1, 3, "359214hsj*A", "광양제철고", "359214hsj*A", conn)
	add_user("나쁜놈", 1, 4, "359214hsj*A", "광양제철고", "359214hsj*A", conn)
	add_exam("정규반 1회차", 3, 75, """["1", "2", "3"]""", """[10, 10, 20]""", "-", """[0,0,0,0,0,0,0,0,0,0]""", 0, 0, 0, conn)


conn = mysql_connect("localhost", "root", "359214hsj*ABC", "kimkiwon_v3")
uninstall(conn)
install(conn)

