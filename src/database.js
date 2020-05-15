// external config
import dotenv from 'dotenv'
dotenv.config()

import mysql from 'mysql';
import {promisify} from 'util';

const database = {
    checkConnection: function() {
        // Ping database to check for common exception errors.
        this.pool.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.')
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.')
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.')
                }
            }
            if (connection) connection.release()

            return
        })
    },
    init: function() {
        this.pool = mysql.createPool({
                connectionLimit: 10,
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
        });
        this.pool.query = promisify(this.pool.query)
    },
    getChatIds: async function() {
        const result = await this.pool.query('SELECT telegram_id FROM chats');
        return result.map(item => item.telegram_id);
    },
    addChatId: async function(chatId) {
        const chatIds = await this.getChatIds();
        if(chatIds.includes(''+chatId)) {
            console.log(chatId+' is already saved. Skipping...');
            return;
        }
        console.log('existing chatIds: '+chatIds);
        // FIXME this does NOT work: there might be concurrency errors
        await this.pool.query('INSERT INTO chats (telegram_id) VALUES (?)',[chatId]);
        console.log('saved '+chatId);
    }
}


export {database};
