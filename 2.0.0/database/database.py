# -*- coding: utf-8 -*-
import pymysql
import json
import logging

# Connect to MySQL Database
def Connection (host, user, password, db) :
	try :
		conn = pymysql.connect (host=host, user=user, password=password, db=db, charset='utf8')
		print ("# SUCCEED : Connection Succeed [host={host}, user={user}, db={db}".format(
			host=host, user=user, password=password, db=db))
		return conn
	except Exception as ex :
		print ("# FAILED : Connection Failed")
		print ("INNER ERROR MSG :", ex)

# Execute Input Query
def ExecQuery (sql, curs) :
	try :
		curs.execute(sql)
		print ("# SUCCEED : Query Exec Succeed [{sql}]".format(sql=sql))
	except Exception as ex :
		print ("# FAILED : Query Exec Failed [{sql}]".format(sql=sql))
		print ("INNER ERROR MSG : ", ex)

# Create Table : Create Table Function, Database Defined in this code

# Create Table "user" that contain user information like administrator, teacher, mentor, student
# Users are classified with "admin", "teacher", "mentor", "student" and defined with authentication
def CreateUserTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS user (
			user_index int(32) unsigned not null auto_increment,
			# user information
			user_name varchar(255) not null,
			school_name varchar(255) not null, # use school table data
			user_phonenumber varchar(255) not null,
			# user authentication 1-4
			user_authority int(10) not null,
			# user defined information
			user_id varchar(255) not null,
			user_password varchar(255) not null,
			user_graduation int(16),
			# user admission year
			user_year int(16),
			user_date varchar(64),
			user_desc varchar(1024),
			# user admission result : acceptance
			acceptance_index_1 int(20), # acceptance 1
			acceptance_index_2 int(20), # acceptance 2
			acceptance_index_3 int(20), # acceptance 3

			primary key (user_index)
		)"""
	ExecQuery(sql, curs)
	return True

# Create Table "school" that contain school not university
# Data is made with "NICE" database from korean education government
def CreateSchoolTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS school (
			school_index int(32) unsigned not null auto_increment,
			school_code varchar(64),
			school_name varchar(255),
			primary key (school_index)
		);"""
	ExecQuery(sql, curs)
	return True

# Create Table "university" that contain university to admitted by our student
# Sadly, It's too hard to get reliable data that contain both University and Department
# So, we develope to input data using your finger
def CreateUniversityDepartmentTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS university_department (
			university_department_index int(32) unsigned not null auto_increment,
			university_name varchar(255) not null,
			department_name varchar(255) not null,
			
			entrance_year int(20) unsigned not null,
			entrance_limit int(20) unsigned,

			university_department_date varchar(64),

			primary key (university_department_index)
		);"""
	ExecQuery(sql, curs)
	return True

def CreateAcceptanceTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS acceptance (
			acceptance_index int(20) unsigned not null auto_increment,
			university_department_index int(32) unsigned not null,
			user_index int(32) unsigned not null,

			acceptance_date varchar(64) not null,
			count_label varchar(20) not null,

			primary key (acceptance_index)
		);"""
	ExecQuery(sql, curs)

	return True

# Create Table "year" that mean "Each" Entrance Examination Year
# Top of Hierarchy
def CreateYearTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS year (
			year_index int(20) unsigned not null auto_increment,
			year_name varchar(255) not null,
			year_year int(20) unsigned not null,

			year_desc varchar(255),
			year_date varchar(64) not null,
			year_state int(10) not null,

			primary key (year_index)
		);""" 
	ExecQuery(sql, curs)
	return True

def CreateCurriculumDomainTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS curriculum_domain (
			curriculum_domain_index int(20) unsigned not null auto_increment,
			curriculum_domain_name varchar(255) not null,
			curriculum_domain_date varchar(64) not null,
			
			primary key (curriculum_domain_index)
		);"""
	ExecQuery(sql, curs)
	return True

# Create Table "curriculum" that contain Curriculum that opened by our teacher King God General Emperer KIM!
def CreateCurriculumTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS curriculum (
			curriculum_index int(20) unsigned not null auto_increment,
			curriculum_name varchar(255) not null,
			curriculum_type int(20) not null,

			year_index int(20) unsigned not null, # Hierarchy Contact
			
			curriculum_desc varchar(255),
			curriculum_date varchar(64) not null,
			
			primary key (curriculum_index)
		);"""
	ExecQuery(sql, curs)
	return True

# Create Table "class" that contain class info
def CreateClassTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS class (
			class_index int(20) unsigned not null auto_increment,
			class_name varchar(255) not null,

			curriculum_index int(20) unsigned not null, # Hierarchy Contact

			class_desc varchar(255),
			class_date varchar(64),
			mentor_index int(32) unsigned not null,

			class_state int(20) unsigned not null,

			primary key (class_index)
		);"""
	ExecQuery(sql, curs)
	return True

def CreateLessonTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS lesson (
			lesson_index int(64) unsigned not null auto_increment,
			
			class_index int(20) unsigned not null, # Hierarchy Contact
			lesson_number int(20) unsigned not null,

			exam_index int(64) unsigned not null,

			lesson_year int(20) unsigned not null,
			lesson_desc varchar(255),
			lesson_date varchar(64),

			primary key (lesson_index)
		);"""
	ExecQuery(sql, curs)
	return True

# Create Table "exam" that contain exam information
def CreateExamTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS exam (
			exam_index int(64) unsigned not null auto_increment,
			exam_name varchar(255) not null,
			exam_domain_index int(20) unsigned not null,
			exam_year int(20) unsigned not null,

			exam_problem_number int(20) unsigned not null,
			exam_problem_label varchar(1024) not null, # JSON Format
			exam_problem_score varchar(512) not null, # JSON Format
			exam_problem_desc varchar(4048) not null, # JSON Format

			exam_statistic_distribution varchar(512),
			exam_statistic_average float(20),
			exam_statistic_std float(20),
			exam_statistic_count int(20) unsigned,

			exam_desc varchar(255),
			exam_date varchar(64),

			primary key (exam_index)
		);"""
	ExecQuery(sql, curs)
	return True

def CreateExamTypeTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS exam_type (
			exam_type_index int(20) unsigned not null auto_increment,
			exam_type_name varchar(255) not null,
			
			exam_type_date varchar(64),

			primary key (exam_type_index)
		);"""
	ExecQuery(sql, curs)
	return True

def CreateExamDomainTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS exam_domain (
			exam_domain_index int(20) unsigned not null auto_increment,
			exam_domain_name varchar(255) not null,
			exam_domain_type1 int(20) not null,
			exam_domain_type2 int(20) not null,

			exam_domain_date varchar(64),

			primary key (exam_domain_index)
		);"""
	ExecQuery(sql, curs)
	return True

# Create Table "result" that contain result
def CreateResultTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS result (
			result_index int(64) unsigned not null auto_increment,
			user_index int(32) unsigned not null,
			lesson_index int(64) unsigned not null,
			exam_index int(64) unsigned not null,

			result_score varchar(512) not null,

			result_sum int(20), # Can Extracted By result_score
			result_rank int(20), # Can Extracted By result_score
			result_std float(20),

			result_grader int(32) unsigned not null,

			result_date varchar(64),

			primary key (result_index)
		);"""
	ExecQuery(sql, curs)
	return True

# Create Table "question" that contain question
def CreateQuestionTable (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """CREATE TABLE IF NOT EXISTS question (
			question_index int(64) unsigned not null auto_increment,
			result_index int(64) unsigned not null,

			question_text varchar(4048),
			question_date varchar(64),
			answer_text varchar(4048),
			answer_date varchar(64),

			question_image varchar(64),

			primary key (question_index)
		);"""
	ExecQuery(sql, curs)
	return True

def DropUserTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE user;"""
	ExecQuery(sql, curs)
	return True

def DropSchoolTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE school;"""
	ExecQuery(sql, curs)
	return True

def DropUniversityDepartmentTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE university_department;"""
	ExecQuery(sql, curs)
	return True

def DropAcceptanceTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE acceptance;"""
	ExecQuery(sql, curs)
	return True

def DropYearTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE year;"""
	ExecQuery(sql, curs)
	return True

def DropCurriculumDomainTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE curriculum_domain;"""
	ExecQuery(sql, curs)
	return True

def DropCurriculumTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE curriculum;"""
	ExecQuery(sql, curs)
	return True

def DropClassTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE class;"""
	ExecQuery(sql, curs)
	return True

def DropLessonTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE lesson;"""
	ExecQuery(sql, curs)
	return True

def DropExamTypeTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE exam_type;"""
	ExecQuery(sql, curs)
	return True

def DropExamTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE exam;"""
	ExecQuery(sql, curs)
	return True

def DropExamDomainTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE exam_domain;"""
	ExecQuery(sql, curs)
	return True

def DropResultTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE result;"""
	ExecQuery(sql, curs)
	return True

def DropQuestionTable(conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """DROP TABLE question;"""
	ExecQuery(sql, curs)
	return True

def GenerateData (conn) :
	curs = conn.cursor (pymysql.cursors.DictCursor)
	sql = """INSERT INTO user 
			(user_name, school_name, user_phonenumber, user_authority, user_id, user_password, user_graduation, user_year, user_date, user_desc) VALUES 
			("관리자", "기본", "010-4728-5052", 1, "관리자", "359214hsj*ABC", 2, 1, "2019-01-01 11:11:11", ".");"""
	ExecQuery(sql, curs)

	sql = """INSERT INTO user 
			(user_name, school_name, user_phonenumber, user_authority, user_id, user_password, user_graduation, user_year, user_date, user_desc) VALUES 
			("강사", "기본", "010-4728-5052", 2, "강사", "359214hsj*ABC", 2, 1, "2019-01-01 11:11:11", ".");"""
	ExecQuery(sql, curs)

	sql = """INSERT INTO user 
			(user_name, school_name, user_phonenumber, user_authority, user_id, user_password, user_graduation, user_year, user_date, user_desc) VALUES 
			("조교", "기본", "010-4728-5052", 3, "조교", "359214hsj*ABC", 2, 1, "2019-01-01 11:11:11", ".");"""
	ExecQuery(sql, curs)

	sql = """INSERT INTO user 
			(user_name, school_name, user_phonenumber, user_authority, user_id, user_password, user_graduation, user_year, user_date, user_desc) VALUES 
			("학생", "기본", "010-4728-5052", 4, "학생", "359214hsj*ABC", 2, 1, "2019-01-01 11:11:11", ".");"""
	ExecQuery(sql, curs)

	conn.commit()

def install (conn) :
	CreateUserTable(conn)
	CreateSchoolTable(conn)
	CreateUniversityDepartmentTable(conn)
	CreateAcceptanceTable(conn)
	CreateYearTable(conn)
	CreateCurriculumDomainTable(conn)
	CreateCurriculumTable(conn)
	CreateClassTable(conn)
	CreateLessonTable(conn)
	CreateExamTypeTable(conn)
	CreateExamTable(conn)
	CreateExamDomainTable(conn)
	CreateResultTable(conn)
	CreateQuestionTable(conn)
	return True

def uninstall (conn) :
	DropUserTable(conn)
	DropSchoolTable(conn)
	DropUniversityDepartmentTable(conn)
	DropAcceptanceTable(conn)
	DropYearTable(conn)
	DropCurriculumDomainTable(conn)
	DropCurriculumTable(conn)
	DropClassTable(conn)
	DropLessonTable(conn)
	DropExamTypeTable(conn)
	DropExamTable(conn)
	DropExamDomainTable(conn)
	DropResultTable(conn)
	DropQuestionTable(conn)
	return True

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
		action = int(input("1.install\n2.uninstall\n4.exit\n"))
		
		if action == 1 :
			install(conn)
			GenerateData(conn)
		elif action == 2 :
			uninstall(conn)
		elif action == 4 :
			break
		else :
			continue

	exit(1)

