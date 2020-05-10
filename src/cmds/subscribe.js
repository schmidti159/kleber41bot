'use strict';
// dependencies
import cron from 'node-cron';

function subscribe(ctx, chatIds) {
    chatIds.add(ctx.chat.id);
    console.log("subscribe with chatId: "+ctx.chat.id+" chatIds: ("+Array.from(chatIds).join(", ")+")");
    ctx.reply("I will notify you the day before the trash will be taken away.");
}

export {subscribe};
