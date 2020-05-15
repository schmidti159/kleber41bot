'use strict';
// dependencies
import cron from 'node-cron';

function subscribe(ctx, database) {
    database.addChatId(ctx.chat.id);
    console.log("subscribe with chatId: "+ctx.chat.id);
    ctx.reply("I will notify you the day before the trash will be taken away.");
}

export {subscribe};
