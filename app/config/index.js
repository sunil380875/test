module.exports = {
    app: {
		port: process.env.PORT || 1740,
		appName: process.env.APP_NAME || 'WTS Academy',
		env: process.env.NODE_ENV || 'development',
        isProd:(process.env.NODE_ENV === 'prod'),
        getAdminFolderName: process.env.ADMIN_FOLDER_NAME || 'admin',
        getApiFolderName: process.env.API_FOLDER_NAME || 'api',
		project_name: "Webskitters Academy Private Limited",
		project_description: "WTS Academy Admin Panel"
	},
	db: {
		port: process.env.DB_PORT || 27117,
		database: process.env.DB_NAME || 'WTS_Academy_DB',
		password: process.env.DB_PASS || 'A1FAVzNsY8X6zZ9Q',
		username: process.env.DB_USER || 'skm',
		host: process.env.DB_HOST || 'mongo2.webskitters.in',
		dialect: 'mongodb'
	},

}
