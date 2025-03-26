const Discord = require("discord.js");
const { clearIntervalId, getIntervalId } = require("../intervalManager"); // Assure-toi que le chemin est correct

module.exports = {
    name: "stopgwana",
    description: "Arrête l'envoi du GIF",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    options: [],
    async run(bot, message, args) {
        try {
            // Si aucun intervalle n'est en cours, on ne fait rien
            if (!getIntervalId()) {
                return message.reply("Aucun envoi de GIF n'est en cours.");
            }

            // Arrêter l'intervalle
            clearIntervalId(); // Utiliser la méthode pour nettoyer l'intervalle
            message.reply("L'envoi du GIF a été arrêté.");

        } catch (err) {
            console.error(err);
            message.reply("Une erreur est survenue.");
        }
    }
};
