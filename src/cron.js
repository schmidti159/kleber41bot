'use strict';
// dependencies
import nodeCron from 'node-cron';

import dateUtils from './utils/date.js';

const cron = {
    launch: function (bot, events, chatIds) {
        // periodically (twice a day) send a message with all upcoming events to all subscribers
//        nodeCron.schedule('0 16,18 * * *', () => {
        nodeCron.schedule('* * * * *', () => {
            chatIds.forEach((chatId) => {
                const nextDayEvents = Object.values(events)
                    .filter((e) => {
                        return dateUtils.eventIsInTheNextDays(e, 4);
                    });
                for(const i in nextDayEvents) {
                    const event = nextDayEvents[i];
                    const msg = event.summary.val + ": " + dateUtils.formatForMessage(event.start);
                    bot.telegram.sendMessage(chatId, msg);
                    console.log("msg sent: "+msg);
                }
            });
        });
    }
}

export default cron;
