'use strict';
const telegraf = require('telegraf');
const ical = require('node-ical');
const dateFormat = require('dateformat');

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
bot.startPolling()


bot.launch();