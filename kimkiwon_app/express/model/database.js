const mysql = require('mysql2/promise')

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '359214hsj*ABC',
	port: '3306',
	database: 'kimkiwon_v9',
	connectionLimit: 100
})

exports.addQuery = async (query) => {
	try {
		const connection = await pool.getConnection(async conn => conn);
		try {
			const [rows] = await connection.query(query);
			connection.release();
			return true
		} catch (err) {
			console.log('Query Error');
			connection.release()
			throw err;
			return false
		}
	} catch (err) {
			console.log('DB Error');
			throw err;
			return false
	}
}

exports.updateQuery = async (query) => {
	try {
		const connection = await pool.getConnection(async conn => conn);
		try {
			const [rows] = await connection.query(query);
			connection.release();
			return true
		} catch (err) {
			console.log('Query Error');
			connection.release()
			throw err;
			return false
		}
	} catch (err) {
			console.log('DB Error');
			throw err;
			return false
	}
}

exports.getQuery = async (query) => {
	try {
		const connection = await pool.getConnection(async conn => conn);
		try {
			const [rows] = await connection.query(query);
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