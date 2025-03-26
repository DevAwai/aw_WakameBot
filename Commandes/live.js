const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "live",
    description: "Vérifie si un utilisateur est en live sur Discord.",
    permissions: [PermissionFlagsBits.SendMessages],
    dm: false,
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur dont tu veux savoir s'il est en live.",
            required: true
        }
    ],

    async run(bot, interaction) {
        try {
            // Récupérer l'utilisateur mentionné dans les options
            const user = interaction.options.getUser("utilisateur");

            // Vérifier si l'utilisateur a des activités en cours
            const member = await interaction.guild.members.fetch(user.id);
            const activities = member.presence ? member.presence.activities : [];

            // Vérifier si l'utilisateur est en live (streaming)
            const streamingActivity = activities.find(activity => activity.type === "STREAMING");

            // Réponse si l'utilisateur est en live
            if (streamingActivity) {
                return interaction.reply({
                    content: `${user.tag} est actuellement en live ! 🎥 Regarde le stream ici : ${streamingActivity.url}`,
                    ephemeral: true
                });
            }

            // Réponse si l'utilisateur n'est pas en live
            return interaction.reply({
                content: `${user.tag} n'est pas actuellement en live.`,
                ephemeral: true
            });

        } catch (err) {
            console.error("Erreur dans la commande /live : ", err);
            return interaction.reply({
                content: "Une erreur est survenue lors de l'exécution de la commande.",
                ephemeral: true
            });
        }
    }
};
