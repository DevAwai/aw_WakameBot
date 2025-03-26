const Discord = require("discord.js");
const { setIntervalId } = require("../intervalManager"); // Assure-toi que le chemin est correct

module.exports = {
    name: "gwana",
    description: "Envoie un GIF toutes les 5 secondes",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    options: [],
    async run(bot, message, args) {
        try {
            // Vérifier si un intervalle est déjà en cours
            const { getIntervalId } = require("../intervalManager"); // Utiliser la fonction d'accès à l'intervalle
            if (getIntervalId()) {
                return message.reply("L'envoi du GIF est déjà en cours.");
            }

            // Définir l'intervalle d'envoi du GIF
            const gifUrl = "https://tenor.com/view/lets-party-you-can-do-gif-18749554";
            let interval = setInterval(() => {
                message.channel.send(gifUrl);
            }, 5000); // Envoi toutes les 5 secondes

            setIntervalId(interval); // Enregistrer l'intervalle

            message.reply("Envoi du GIF démarré.");

        } catch (err) {
            console.error(err);
            message.reply("Une erreur est survenue.");
        }
    }
};
