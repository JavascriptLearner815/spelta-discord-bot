const fs = require("node:fs")
const path = require("node:path")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { clientId, guildId, token } = require("./config.json")
const rest = new REST({ version: "9" }).setToken(token)

let commands = []
const commandsPath = path.join(__dirname, "commands")
let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	commands.push(command.data.toJSON())
}


rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log("Successfully registered bot commands."))
	.catch(console.error)

setInterval(() => {
	commands = []
	commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		const command = require(filePath)
		commands.push(command.data.toJSON())
	}


	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.catch(console.error)
}, 180000)