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

-- Down
DROP TABLE race_results;

DROP TABLE race_result;
