const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");

module.exports = {
    name: "reload",
    description: "Recharger toutes les commandes",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    options: [],
    async run(bot, message, args) {
        try {
            // Répondre rapidement à l'interaction pour éviter le timeout
            await message.reply("Je suis en train de me recharger... Patiente un instant !");

            // Chemin vers le dossier des commandes
            const commandsPath = path.join(__dirname, "../Commandes"); // Assure-toi que le chemin est correct
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

            for (const file of commandFiles) {
                // Recharger chaque fichier de commande
                delete require.cache[require.resolve(path.join(commandsPath, file))];
                require(path.join(commandsPath, file)); // Recharger la commande
            }

            message.channel.send("Toutes les commandes ont été rechargées avec succès.");
        } catch (err) {
            console.error(err);
            message.channel.send("Une erreur est survenue lors du rechargement des commandes.");
        }
    }
};
