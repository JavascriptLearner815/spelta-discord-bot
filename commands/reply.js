const { SlashCommandBuilder } = require("@discordjs/builders")
const { DirectMessages } = require("../database")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("reply")
		.setDescription("Replies to the last received Spelta DM!")
		.addStringOption(option =>
			option
				.setRequired(true)
				.setName("message")
				.setDescription("The message to send")),
	async execute(interaction) {
		const message = interaction.options.getString("message")
		const dm = await DirectMessages.findOne({ where: { to: interaction.user.id } })
		if (!dm) return interaction.reply({ content: "You haven't received any DMs! Use `/dm` to send one!", ephemeral: true })
		const user = interaction.client.users.fetch(dm.get("from"))
		if (!user) {
			interaction.reply({ content: "That's odd! I found a matching DM, but not the recipient!", ephemeral: true })
			throw console.error("ERROR: DM found in reply command, but recipient not found.")
		}

		try {
			await user.send(`**${interaction.user.tag} replied:** ${message}`)
			await interaction.user.send(`**Sent ${user.tag} a reply:** ${message}`)
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