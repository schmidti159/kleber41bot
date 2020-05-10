'use strict';
// external config
require('dotenv').config()
// dependencies
const telegraf = require('telegraf');
const ical = require('node-ical');
const dateFormat = require('dateformat');
const cron = require('node-cron');
// constants
const weekMilliseconds = 7 * 24 * 60 * 60 * 1000;
const dayMilliseconds = 24 * 60 * 60 * 1000;

// get the events
const events = ical.sync.parseFile('input/Leerungstermine50655.ics');

// create the bot
const bot = new telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('I will remind you to take out the trash the day before it is necessary. Features: Use /week to display the events of the next week.'));
bot.help((ctx) => ctx.reply('Nothing to configure.'));

function eventIsInTheNextDays(e, days) {
    const now = +new Date();
    const dateDiff = (e.start - now);
    const isInTheNextDays = dateDiff < days * dayMilliseconds && dateDiff > 0;
    const isToday = dateFormat(e.start, 'dd.mm.yyyy') == dateFormat(now, 'dd.mm.yyyy');
    return isInTheNextDays && !isToday;
}

// the week command will display all the events of the next week
bot.command('week', (ctx) => {
    ctx.reply("Events in the next week:");
    const nextWeekEvents = Object.values(events)
        .filter((e) => {
            return eventIsInTheNextDays(e, 7);
        })
    for(const i in nextWeekEvents) {
        const event = nextWeekEvents[i];
        const msg = event["summary"]["val"] + ": " + dateFormat(event["start"], 'ddd. dd.mm.yyyy');
        ctx.reply(msg);
    }
}); 

// the subscribe command will store the chatId
// TODO do not use a global variable but some kind of persistent storage for this
const chatIds = new Set();

bot.command('subscribe', (ctx) => {
    chatIds.add(ctx.chat.id);
    console.log("subscribe with chatId: "+ctx.chat.id+" chatIds: ("+Array.from(chatIds).join(", ")+")");
    ctx.reply("I will notify you the day before the trash will be taken away.");
});

// periodically (twice a day) send a message with all upcoming events to all subscribers
cron.schedule('0 16,18 * * *', () => {
//cron.schedule('* * * * *', () => {
    chatIds.forEach((chatId) => {
        const nextDayEvents = Object.values(events)
            .filter((e) => {
                return eventIsInTheNextDays(e, 1);
            });
        for(const i in nextDayEvents) {
            const event = nextDayEvents[i];
            const msg = event.summary.val + ": " + dateFormat(event.start, "ddd. dd.mm.yyyy");
            bot.telegram.sendMessage(chatId, msg);
            console.log("msg sent: "+msg);
        }
    });
});



bot.launch();
