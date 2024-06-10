const appRoot = require('app-root-path')
const env = require('dotenv')
env.config({path: `${appRoot}/.env`})

const { DB_HOST, DB_PORT ,DB_USERNAME ,DB_PASSWORD ,DB_NAME } = process.env

module.exports =
	{
		"development": {
			"username": DB_USERNAME,
			"password": DB_PASSWORD,
			"database": DB_NAME,
			"host": DB_HOST,
			"port": DB_PORT,
			"dialect": "mysql",
			"timezone": '+07:00'
		}
	}
