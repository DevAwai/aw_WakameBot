const { PermissionFlagsBits } = require("discord.js");
const fetch = require('node-fetch');  // Utilisation de `require` avec la version 2.x de node-fetch
const { Client, Intents } = require("discord.js");

module.exports = {
    name: "clip",
    description: "Surveille les clips Twitch et envoie le lien dans un salon Discord.",
    permissions: [PermissionFlagsBits.SendMessages],
    dm: false,
    options: [
        {
            type: "string",
            name: "twitch_channel",
            description: "Le nom de la chaîne Twitch à surveiller (ou le lien).",
            required: true
        },
        {
            type: "channel",
            name: "salon",
            description: "Le salon Discord où poster les clips.",
            required: true
        }
    ],

    async run(bot, interaction) {
        try {
            let twitchChannel = interaction.options.getString("twitch_channel");
            const salon = interaction.options.getChannel("salon");

            // Vérifier si l'input est un lien complet ou un simple nom d'utilisateur
            if (twitchChannel.startsWith("https://www.twitch.tv/")) {
                twitchChannel = twitchChannel.replace("https://www.twitch.tv/", "");
            }

            const clientId = "qqigbtf8h51yhxe925na30to0oyzud"; // Ton client ID Twitch
            const accessToken = "ijjczfjeyhqa0ueee7kv2hc8zbal5s"; // Ton token OAuth

            const checkInterval = 30000; // Vérification toutes les 30 secondes

            const getTwitchChannelId = async (channelName) => {
                const channelResponse = await fetch(`https://api.twitch.tv/helix/users?login=${channelName}`, {
                    headers: {
                        "Client-ID": clientId,
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                const channelData = await channelResponse.json();
                if (!channelData.data || channelData.data.length === 0) {
                    throw new Error(`Chaîne Twitch "${channelName}" introuvable ou inactive.`);
                }

                return channelData.data[0].id;
            };

            // Récupérer l'ID de la chaîne Twitch
            const twitchChannelId = await getTwitchChannelId(twitchChannel);

            // Répondre publiquement à l'utilisateur
            await interaction.reply({
                content: `Je vais maintenant surveiller les clips de la chaîne **${twitchChannel}** et les poster dans le salon **${salon.name}**.`,
                ephemeral: false
            });

            let lastClipTimestamp = Date.now(); // Initialiser la variable pour récupérer les clips créés après la commande
            const sentClipIds = new Set(); // Utilisation d'un Set pour stocker les IDs des clips envoyés

            // Vérifier les clips Twitch toutes les X secondes (30 secondes)
            setInterval(async () => {
                try {
                    // Récupérer les clips de la chaîne Twitch via l'API Twitch
                    const response = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${twitchChannelId}&started_at=${new Date(lastClipTimestamp).toISOString()}`, {
                        method: "GET",
                        headers: {
                            "Client-ID": clientId,
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });

                    const data = await response.json();

                    // Vérifier si des clips existent
                    if (data.data && data.data.length > 0) {
                        for (const clip of data.data) {
                            // Vérifier si le clip a déjà été envoyé
                            if (!sentClipIds.has(clip.id)) {
                                const clipUrl = `https://www.twitch.tv/${twitchChannel}/clip/${clip.id}`;
                                await salon.send(`Un nouveau clip a été créé sur la chaîne **${twitchChannel}** ! 🎥\nClique ici pour voir le clip : ${clipUrl}`);
                                
                                // Ajouter l'ID du clip au Set pour éviter de l'envoyer à nouveau
                                sentClipIds.add(clip.id);
                            }
                        }

                        // Mettre à jour le timestamp du dernier clip trouvé
                        lastClipTimestamp = new Date(data.data[0].created_at).getTime();
                    } else {
                        console.log("Aucun nouveau clip trouvé.");
                    }
                } catch (err) {
                    console.error("Erreur lors de la récupération des clips : ", err);
                }
            }, checkInterval); // Répéter toutes les 30 secondes

        } catch (err) {
            console.error("Erreur dans la commande clip : ", err);
            return interaction.reply({
                content: `Une erreur est survenue : ${err.message}`,
                ephemeral: false
            });
        }
    }
};
