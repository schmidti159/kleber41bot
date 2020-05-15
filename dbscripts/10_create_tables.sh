
#!/bin/bash

cd "$(dirname "$0")"
source ../.env

mysql -e "
USE $DB_NAME;

CREATE TABLE patch_level (
    uid             int NOT NULL AUTO_INCREMENT,
    version         varchar(255) NOT NULL,
    comment         varchar(4000),
    created         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(uid)
);

CREATE TABLE chats (
    uid             int NOT NULL AUTO_INCREMENT,
    telegram_id     varchar(255) NOT NULL,
    PRIMARY KEY(uid)
);
INSERT INTO patch_level 
        (version, comment)
    VALUES
        ('1.0.0', 'Initial db-setup')
;

"
