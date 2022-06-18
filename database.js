const Sequelize = require("sequelize")

const sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	// SQLite only
	storage: "database.sqlite",
})

const DirectMessages = sequelize.define("dms", {
	message: Sequelize.TEXT,
	from: Sequelize.STRING,
	to: Sequelize.STRING,
})

module.exports = {
	sequelize,
	DirectMessages,
}