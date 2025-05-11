-- Up
CREATE TABLE race_results (
    race_results_id CHAR(36) PRIMARY KEY,
    race_results_time DATETIME,
    race_result_id CHAR(36),
    FOREIGN KEY (race_result_id) REFERENCES race_result (race_result_id)
);

CREATE TABLE race_result (
    race_result_id CHAR(36),
    race_result TEXT NOT NULL,
    race_result_first_name TEXT,
    race_result_last_name TEXT
);

CREATE TABLE timer (timer_start_date TEXT);

CREATE TABLE users (user_id CHAR(36), user_role TEXT);

INSERT INTO
    users
VALUES
    (
        'c9a2afcc-598a-49f8-a2cd-63ab27ab7a07',
        'organiser'
    ),
    ('690000bf-ba18-4919-9312-0182a9b0e153', 'marshal'),
    ('5c18d76d-693a-4d9f-8157-d927dfa5600e', 'runner');

-- Down
DROP TABLE race_results;

DROP TABLE race_result;

DROP TABLE timer;

DROP TABLE users;
