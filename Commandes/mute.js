const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "mute",
    description: "Mute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options:[
        {
            type: "user",
            name: "membre",
            description: "le membre à mute",
            required: true
        }, {
            type: "string",
            name: "temps",
            description: "le temps du mute",
            required: true
        },{
            type: "string",
            name: "raison",
            description: "La raison du membre à mute",
            required: true
        }
        
    ],
    
    async run(bot, message, args) {
        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre à mute !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Ce membre n'est pas sur le serveur !")

        let time = args.getString("temps")
        if(!time) return message.reply("Merci de renseigner une durée de mute !")
        if(isNaN(ms(time))) return message.reply("Pas le bon format !")
        if(ms(time) > 86400000) return message.reply("Le mute ne peut pas duré plus de 28 jours !")

        let reason = args.getString("raison")
        if(!reason) return message.reply("Merci de renseigner une raison !")

        if(message.user.id === user.id) return message.reply("Tu ne peut pas te mute toi même golmon !")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("N'essaie pas de mute le FONDATEUR !")
        if(member && !member.moderatable) return message.reply("Je ne peut pas mute ce membre !")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peut pas mute ce membre !")
        if(member.isCommunicationDisabled()) return message.reply("Ce membre est déjà mute !")

        try{await user.send(`Tu as été mute du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)}catch(err){}
        await message.reply(`${message.user} a mute ${user.tag} pour la raison : \`${reason}\``)
        await member.timeout(ms(time), reason)
    }
}