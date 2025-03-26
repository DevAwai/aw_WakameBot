const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "infos",
    description: "Donner toutes les informations sur un utilisateur Discord",
    permission: PermissionFlagsBits.SendMessages,
    dm: false,
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "Utilisateur dont vous voulez les informations",
            required: true
        }
    ],
    async run(bot, interaction, args) {
        try {
            // Réponse immédiate pour éviter l'expiration de l'interaction
            await interaction.reply({ content: "Chargement des informations, veuillez patienter...", ephemeral: true });

            // Récupérer l'utilisateur mentionné
            const utilisateur = args.getUser("utilisateur");

            // Vérifier si l'utilisateur existe
            if (!utilisateur) {
                return interaction.editReply("Utilisateur invalide.");
            }

            // Récupérer l'objet complet de l'utilisateur dans le serveur
            const member = await interaction.guild.members.fetch(utilisateur.id);

            // Récupérer les informations supplémentaires
            const joinedAt = member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : "Inconnu";
            const roles = member.roles.cache.filter(role => role.name !== "@everyone").map(role => role.name).join(", ") || "Aucun rôle";
            const nickname = member.nickname || "Aucun surnom";
            const bannerURL = member.user.bannerURL({ dynamic: true, size: 2048 }) || "Aucune bannière disponible";
            const customStatus = member.presence?.activities.find(activity => activity.type === "CUSTOM_STATUS")?.state || "Pas de statut personnalisé";


            // Créer l'embed avec toutes les informations de l'utilisateur
            const embed = new EmbedBuilder()
                .setColor("#3498db")
                .setTitle(`${utilisateur.username} - Informations Complètes`)
                .setThumbnail(utilisateur.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addFields(
                    { name: "Nom d'utilisateur", value: utilisateur.username || "Inconnu", inline: true },
                    { name: "Tag", value: `#${utilisateur.discriminator}` || "Inconnu", inline: true },
                    { name: "ID", value: utilisateur.id || "Inconnu", inline: true },
                    { name: "Créé le", value: utilisateur.createdTimestamp ? `<t:${Math.floor(utilisateur.createdTimestamp / 1000)}:D>` : "Inconnu", inline: true },
                    { name: "Statut", value: member.presence ? `${member.presence.status.charAt(0).toUpperCase() + member.presence.status.slice(1)}` : "Indisponible", inline: true },
                    { name: "A rejoint le serveur", value: joinedAt, inline: true },
                    { name: "Surnom", value: nickname, inline: true },
                    { name: "Rôles", value: roles, inline: false },
                    { name: "Statut personnalisé", value: customStatus, inline: true },
                    { name: "Bannière", value: bannerURL, inline: false }
                )
                .setTimestamp();

            // Répondre avec l'embed
            await interaction.editReply({ content: null, embeds: [embed] });

        } catch (err) {
            console.error(err);
            interaction.editReply("Une erreur est survenue lors de la récupération des informations.");
        }
    }
};
