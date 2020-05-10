'use strict';
// dependencies
import dateUtils from '../utils/date.js';

// the week command will display all the events of the next week
function week(ctx, events) {
    ctx.reply("Events in the next week:");
    const nextWeekEvents = Object.values(events)
        .filter((e) => {
            return dateUtils.eventIsInTheNextDays(e, 7);
        })
    for(const i in nextWeekEvents) {
        const event = nextWeekEvents[i];
        const msg = event["summary"]["val"] + ": " + dateUtils.formatForMessage(event["start"]);
        ctx.reply(msg);
    }
}

export {week};
