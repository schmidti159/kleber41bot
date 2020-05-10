'use strict';
// external config
import dotenv from 'dotenv'
dotenv.config()
// dependencies
import telegraf from 'telegraf';
import ical from 'node-ical';

import {week} from "./cmds/week.js";
import {subscribe} from "./cmds/subscribe.js";
import cron from "./cron.js";

// get the events
const events = ical.sync.parseFile('input/Leerungstermine50655.ics');

// create the bot
const bot = new telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('I will remind you to take out the trash the day before it is necessary. Features: Use /week to display the events of the next week.'));
bot.help((ctx) => ctx.reply('Nothing to configure.'));

// the week command will display all the events of the next week
bot.command('week', (ctx) => {
    week(ctx, events);
}); 

// the subscribe command will store the chatId
// TODO do not use a global variable but some kind of persistent storage for this
const chatIds = new Set();

bot.command('subscribe', (ctx) => {
    subscribe(ctx, chatIds)
});

// periodically (twice a day) send a message with all upcoming events to all subscribers
cron.launch(bot, events, chatIds);


bot.launch();
