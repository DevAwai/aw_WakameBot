const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Supprimer un nombre spécifique de messages",
    permissions: [PermissionFlagsBits.ManageMessages],
    dm: false,
    options: [
        {
            type: "integer",
            name: "nombre",
            description: "Le nombre de messages à supprimer",
            required: true,
            min_value: 1,
            max_value: 100
        }
    ],

    async run(bot, interaction) {
        try {
            // Récupérer le nombre de messages à supprimer
            const numberOfMessages = interaction.options.getInteger("nombre");

            // Vérification des permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                return interaction.reply({
                    content: "Désolé, vous n'avez pas la permission de supprimer des messages.",
                    ephemeral: true
                });
            }

            // Déferer la réponse pour signaler que la commande est en cours
            await interaction.deferReply({ ephemeral: true }); // Utilisation de deferReply pour éviter l'expiration

            // Récupérer les messages à supprimer (limite de 100 messages maximum)
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            // Afficher dans la console pour vérifier combien de messages ont été récupérés
            console.log(`Messages récupérés : ${messages.size}`);
            if (messages.size === 0) {
                return interaction.followUp({
                    content: "Aucun message à supprimer dans ce canal.",
                    ephemeral: true
                });
            }

            // Si le nombre de messages à supprimer est supérieur au nombre de messages récupérés
            if (messages.size < numberOfMessages) {
                return interaction.followUp({
                    content: `Il n'y a pas assez de messages à supprimer. Il y en a actuellement seulement ${messages.size} messages dans ce canal.`,
                    ephemeral: true
                });
            }

            // Supprimer les messages en masse (jusqu'à 100 messages à la fois)
            let deletedMessages = await interaction.channel.bulkDelete(messages, true);  // Le "true" garde les messages du bot.
            let deletedCount = deletedMessages.size;

            // Affichage dans la console pour voir combien de messages ont été supprimés
            console.log(`Messages supprimés en bulk : ${deletedCount}`);

            // Si la suppression ne concerne pas tous les messages demandés, supprimer les messages restants un par un
            if (deletedCount < numberOfMessages) {
                const remainingMessagesToDelete = numberOfMessages - deletedCount;
                const olderMessages = await interaction.channel.messages.fetch({ limit: remainingMessagesToDelete });

                for (const [messageID, msg] of olderMessages) {
                    try {
                        // Supprimer les messages un par un
                        if (msg.deletable) {
                            await msg.delete();
                            deletedCount++;
                            console.log(`Message supprimé (ID: ${msg.id})`);
                        }
                    } catch (error) {
                        console.error(`Erreur lors de la suppression du message ${msg.id}: ${error.message}`);
                    }
                }
            }

            // Réponse finale sur combien de messages ont été supprimés
            return interaction.followUp({
                content: `J'ai supprimé ${deletedCount} messages.`,
                ephemeral: true
            });

        } catch (err) {
            console.error("Erreur dans la commande clear : ", err);
            return interaction.followUp({
                content: "Une erreur est survenue lors de l'exécution de la commande.",
                ephemeral: true
            });
        }
    }
};
