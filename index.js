const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('sad'))
bot.help((ctx) => ctx.reply('Send me anything'))
bot.on('message', handleMessage)
bot.launch()


var messages = [
'Waaaaaaahaaaa',
'Müüüühüühü',
'AAAAHHH!',
'brrrrrr'
]

function handleMessage(ctx) {
	var random = Math.random()
	console.log('random is '+random);
	if(random < 0.9) {
		console.log('will reply')
		var reply = messages[Math.floor(Math.random() * messages.length)]
		ctx.reply(reply)
	}	
}
