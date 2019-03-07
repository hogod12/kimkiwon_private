def read_setup (file="database_setup.txt") :
	f = open(file, 'r')
	raw_text = f.read()
	f.close()

	return raw_text

if __name__ == "__main__" :
	database_setup_raw = read_setup()
	database_setup_parsed = database_setup_raw.split("<database>")


	for i in database_setup_parsed :
		print (i)
		print ("=====")