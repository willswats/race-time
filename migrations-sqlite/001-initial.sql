-- Up
CREATE TABLE race_result (
    race_result_id CHAR(36) PRIMARY KEY,
    race_result_time DATETIME,
    race_result TEXT NOT NULL
);

-- Down
DROP TABLE race_result;
