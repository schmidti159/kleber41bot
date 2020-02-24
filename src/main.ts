'use strict';
const telegraf = require('telegraf');
const ical = require('node-ical');
const dateFormat = require('dateformat');
const cron = require('node-cron');

const bot = new telegraf(process.env.BOT_TOKEN);

//import { event } from './@types/ical/main';

//bot.startPolling();
//bot.use(telegraf.log());
bot.start((ctx) => ctx.reply('I will remind you to take out the trash the day before. Features: Use /week to display the events of the next week.'));
bot.help((ctx) => ctx.reply('Nothing to configure.'));

const events/* : event[]*/ = ical.sync.parseFile('input/Leerungstermine50655.ics');
//console.log(events);
const today = +new Date();
const weekMilliseconds = 7 * 24 * 60 * 60 * 1000;
const dayMilliseconds = 24 * 60 * 60 * 1000;
const nextWeekEvents = Object.values(events)
        .filter((e) => {
            return (e["start"] - today) < weekMilliseconds;
        })
bot.command('week', (ctx) => {
    for(const i in nextWeekEvents) {
        const event = nextWeekEvents[i];
        const msg = event["summary"]["val"] + ": " + dateFormat(event["start"], 'ddd. dd.mm.yyyy');
        ctx.reply(msg);
    }
}); 
const chatIds = new Set();

cron.schedule('0 16,18 * * *', () => {
    chatIds.forEach((chatId) => {
        const nextDayEvents = Object.values(events)
                .filter((e) => {
                    return (e["start"] - today) < dayMilliseconds;
                });
        for(const i in nextDayEvents) {
            const event = nextDayEvents[i];
            const msg = event["summary"]["val"] + ": " + dateFormat(event["start"], 'ddd. dd.mm.yyyy');
            bot.telegram.sendMessage(chatId, msg);
            console.log("msg sent: "+msg);
        }
    });
});

bot.command('subscribe', (ctx) => {
    chatIds.add(ctx.chat.id);
    console.log("subscribe with chatId: "+ctx.chat.id+" chatIds: ("+Array.from(chatIds).join(", ")+")");
});


bot.launch();
