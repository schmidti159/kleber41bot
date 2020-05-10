'use strict';
// dependencies
import dateFormat from 'dateformat';
// constants
const dayMilliseconds = 24 * 60 * 60 * 1000;

const dateUtils = {
    eventIsInTheNextDays: function (e, days) {
        const now = +new Date();
        const dateDiff = (e.start - now);
        const isInTheNextDays = dateDiff < days * dayMilliseconds && dateDiff > 0;
        const isToday = dateFormat(e.start, 'dd.mm.yyyy') == dateFormat(now, 'dd.mm.yyyy');
        return isInTheNextDays && !isToday;
    },
    formatForMessage: function(date) {
        return dateFormat(date, 'ddd. dd.mm.yyyy');
    }


}

export default dateUtils;
