const { SlashCommandBuilder } = require("@discordjs/builders")
const { DirectMessages } = require("../database")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("dm")
		.setDescription("Directly messages a user!")
		.addUserOption(option =>
			option
				.setRequired(true)
				.setName("user")
				.setDescription("The user to message"))
		.addStringOption(option =>
			option
				.setRequired(true)
				.setName("message")
				.setDescription("The message to send")),
	async execute(interaction) {
		const user = interaction.options.getUser("user")
		const message = interaction.options.getString("message")

		try {
			await user.send(`**${interaction.user.tag} sent a message:** ${message}`)
			await interaction.user.send(`**Sent ${user.tag} a message:** ${message}`)
			await DirectMessages.create({
				message,
				from: interaction.user.id,
				to: user.id,
			})
			interaction.reply({ content: "Successfully sent your message!", ephemeral: true })
		}
		catch (error) {
			console.error(error)
			interaction.reply({ content: "Error! Either the recipient or yourself has disabled DMs!", ephemeral: true })
		}
	},
}