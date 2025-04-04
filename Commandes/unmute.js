const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "unmute",
    description: "Unmute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options:[
        {
            type: "user",
            name: "membre",
            description: "le membre à unmute",
            required: true
        },{
            type: "string",
            name: "raison",
            description: "La raison du membre à unmute",
            required: false
        }
        
    ],
    
    async run(bot, message, args) {
        let user = args.getUser("membre");
        if(!user) return message.reply("Pas de membre !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre !")
        let reason = args.getString("raison")
        
        if(!member.moderatable) return message.reply("Je ne peut pas unmute ce membre !")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peut pas unmute ce membre !")
        if(!member.isCommunicationDisabled()) return message.reply("Ce membre n'est pas mute !")

        try {await user.send(`Tu as été unmute du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)} catch (err) {}
        await message.reply(`${message.user} a unmute ${user.tag}`)

        await member.timeout(null, reason)
    }
}