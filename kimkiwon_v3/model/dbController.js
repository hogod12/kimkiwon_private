const mysql = require('mysql2/promise')
const logger = require('./writeLog')

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '359214hsj*ABC',
	port: '3306',
	database: 'kimkiwon_v3',
	connectionLimit: 100
});

exports.query = async (sql_query) => {
	try {
		const connection = await pool.getConnection(async conn => conn);
		try {
			const [rows] = await connection.query(sql_query);
			connection.release();
			return rows
		} catch (err) {
			console.log('Query Error');
			connection.release()
			throw err;
		}
	} catch (err) {
		console.log('DB Error');
		throw err;
	}
}