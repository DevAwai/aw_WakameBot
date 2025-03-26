const Discord = require("discord.js")

module.exports = {
    name: "kick",
    description: "Kick un membre du serveur discord",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    options: [
        {
        type: "user",
        name: "membre",
        description: "Saisir le nom de la personne à Kick",
        required: true
        },{
            type: "string",
            name: "raison",
            description: "Décrir la raison du Kick",
            required: true
        }
    ],
    async run(bot, message, args){
        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre à Kick !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Ce membre n'est pas sur le serveur !")
            
        let reason = args.getString("raison")
        if(!reason) return message.reply("Aucune raison de kick renseigner !")

        if(message.user.id === user.id) return message.reply("Tu ne peut pas te mute toi même golmon !")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("N'essaie pas de Kick le FONDATEUR !")
        if(member && !member.kickable) return message.reply("Je ne peut pas Kick ce membre !")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peut pas kick ce membre !")

        try{await user.send(`Tu as été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)}catch(err){}

        await message.reply(`${message.user} a kick ${user.tag} pour la raison : \`${reason}\``)
        await member.kick(reason)
    }
}