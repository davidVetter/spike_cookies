CREATE TABLE "team" (
	"id" serial NOT NULL,
	"name" varchar(50) NOT NULL UNIQUE,
	"league" varchar(6) NOT NULL,
	"year" varchar(4) NOT NULL DEFAULT 'YEAR(CURDATE())',
	CONSTRAINT "team_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_team" (
	"id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"team_id" serial NOT NULL,
	"number" int NOT NULL,
	"approved" bool NOT NULL DEFAULT 'false',
	CONSTRAINT "user_team_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "game" (
	"id" serial NOT NULL,
	"team_id" int NOT NULL,
	"date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"opponent" varchar(50) NOT NULL,
	"is_winner" BOOLEAN NOT NULL,
	"score_home_team" int NOT NULL,
	"score_away_team" int NOT NULL,
	"innings" int NOT NULL DEFAULT '7',
	"is_home_team" BOOLEAN NOT NULL,
	"tournament_id" int,
	CONSTRAINT "game_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_game" (
	"id" serial NOT NULL,
	"user_id" int NOT NULL,
	"game_id" int NOT NULL,
	"hits" int NOT NULL,
	"walks" int NOT NULL,
	"at_bats" int NOT NULL,
	"rbi" int NOT NULL,
	"strikeouts" int NOT NULL,
	"position" varchar(2) NOT NULL,
	"lineup_number" int NOT NULL,
	"single" int NOT NULL,
	"double" int NOT NULL,
	"triple" int NOT NULL,
	"hr" int NOT NULL,
	CONSTRAINT "user_game_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "tournaments" (
	"id" serial NOT NULL,
	"name" varchar(75) NOT NULL,
	"city" varchar(40) NOT NULL,
	CONSTRAINT "tournaments_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(75) NOT NULL UNIQUE,
	"password" varchar(75) NOT NULL,
	"first_name" varchar(30) NOT NULL,
	"last_name" varchar(40) NOT NULL,
	"phone_number" int NOT NULL,
	"street_address" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"state" varchar(2) NOT NULL,
	"zip" int NOT NULL,
	"jersey_size" varchar(3) NOT NULL,
	"hat_size" varchar(10) NOT NULL,
	"bats" varchar(1) NOT NULL,
	"throws" varchar(1) NOT NULL,
	"is_manager" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "user_team" ADD CONSTRAINT "user_team_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_fk1" FOREIGN KEY ("team_id") REFERENCES "team"("id");

ALTER TABLE "game" ADD CONSTRAINT "game_fk0" FOREIGN KEY ("team_id") REFERENCES "team"("id");
ALTER TABLE "game" ADD CONSTRAINT "game_fk1" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id");

ALTER TABLE "user_game" ADD CONSTRAINT "user_game_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "user_game" ADD CONSTRAINT "user_game_fk1" FOREIGN KEY ("game_id") REFERENCES "game"("id");

-- User Test Data
INSERT INTO "public"."user"("username", "password", "first_name", "last_name", "phone_number", "street_address", "city", "state", "zip", "jersey_size", "hat_size", "bats", "throws", "is_manager") VALUES('john.smith@test.com', 'test123', 'John', 'Smith', 7015551234, '123 Some St', 'West Fargo', 'ND', 58078, 'xl', 'l', 'r', 'r', FALSE) RETURNING "id", "username", "password", "first_name", "last_name", "phone_number", "street_address", "city", "state", "zip", "jersey_size", "hat_size", "bats", "throws", "is_manager";
INSERT INTO "public"."user"("username", "password", "first_name", "last_name", "phone_number", "street_address", "city", "state", "zip", "jersey_size", "hat_size", "bats", "throws", "is_manager") VALUES('frank.johnson@test2.com', 'test123', 'Frank', 'Johnson', 7015554578, '345 How St', 'Fargo', 'ND', 58104, 'xxl', 'l', 'r', 'r', FALSE) RETURNING "id", "username", "password", "first_name", "last_name", "phone_number", "street_address", "city", "state", "zip", "jersey_size", "hat_size", "bats", "throws", "is_manager";
INSERT INTO "public"."user"("username", "password", "first_name", "last_name", "phone_number", "street_address", "city", "state", "zip", "jersey_size", "hat_size", "bats", "throws", "is_manager") VALUES('tom.harris@test.com', 'test123', 'Tom', 'Harris', 7015554879, '678 Oppurtunity Ln', 'Moorhead', 'MN', 56560, 'l', 'm', 'l', 'l', TRUE) RETURNING "id", "username", "password", "first_name", "last_name", "phone_number", "street_address", "city", "state", "zip", "jersey_size", "hat_size", "bats", "throws", "is_manager";

-- Team test data
INSERT INTO "public"."team"("id","name","league","year")
VALUES
(1,E'Good Team',E'rec4',E'2022'),
(2,E'Other Team',E'rec4',E'2021');

-- User_Team test data
INSERT INTO "public"."user_team"("user_id", "team_id", "number", "approved") VALUES(1, 1, 5, TRUE) RETURNING "id", "user_id", "team_id", "number", "approved";
INSERT INTO "public"."user_team"("user_id", "team_id", "number", "approved") VALUES(1, 2, 4, TRUE) RETURNING "id", "user_id", "team_id", "number", "approved";
INSERT INTO "public"."user_team"("user_id", "team_id", "number", "approved") VALUES(2, 1, 10, TRUE) RETURNING "id", "user_id", "team_id", "number", "approved";
INSERT INTO "public"."user_team"("user_id", "team_id", "number", "approved") VALUES(3, 1, 4, TRUE) RETURNING "id", "user_id", "team_id", "number", "approved";

-- Test team_game data
INSERT INTO "public"."game"("team_id", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team") VALUES(1, 'Bad Team', TRUE, 10, 5, 7, TRUE) RETURNING "id", "team_id", "date", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team", "tournament_id";
INSERT INTO "public"."game"("team_id", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team") VALUES(1, 'Worse Team', TRUE, 13, 3, 7, TRUE) RETURNING "id", "team_id", "date", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team", "tournament_id";
INSERT INTO "public"."game"("team_id", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team") VALUES(1, 'Pickles', FALSE, 15, 7, 7, FALSE) RETURNING "id", "team_id", "date", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team", "tournament_id";
INSERT INTO "public"."game"("team_id", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team") VALUES(1, 'Cats', TRUE, 6, 12, 7, FALSE) RETURNING "id", "team_id", "date", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team", "tournament_id";
INSERT INTO "public"."game"("team_id", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team") VALUES(2, 'Dogs', FALSE, 8, 2, 7, FALSE) RETURNING "id", "team_id", "date", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team", "tournament_id";
INSERT INTO "public"."game"("team_id", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team") VALUES(2, 'Rays', TRUE, 16, 14, 7, TRUE) RETURNING "id", "team_id", "date", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team", "tournament_id";
INSERT INTO "public"."game"("team_id", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team") VALUES(2, 'Fish', FALSE, 8, 17, 7, TRUE) RETURNING "id", "team_id", "date", "opponent", "is_winner", "score_home_team", "score_away_team", "innings", "is_home_team", "tournament_id";

-- Test user_game data
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(1, 1, 2, 0, 4, 1, 0, 'LC', 2, 1, 1, 0, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(2, 1, 3, 1, 3, 2, 0, 'SS', 3, 0, 2, 1, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(3, 1, 1, 0, 4, 0, 2, 'RF', 8, 1, 0, 0, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(1, 5, 4, 0, 4, 5, 0, 'LC', 3, 1, 2, 0, 1) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(1, 6, 3, 0, 4, 3, 0, 'SS', 3, 0, 2, 1, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(1, 7, 1, 0, 4, 2, 0, 'LC', 2, 0, 1, 0, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(2, 2, 1, 1, 5, 1, 1, 'SS', 5, 1, 0, 0, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(3, 2, 3, 1, 3, 4, 0, 'RC', 6, 1, 2, 0, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(1, 2, 5, 0, 5, 5, 0, 'LC', 3, 0, 3, 1, 1) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(2, 3, 2, 0, 5, 3, 1, '3B', 6, 2, 1, 0, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(3, 3, 1, 1, 3, 1, 1, 'RF', 9, 1, 0, 0, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(1, 4, 4, 0, 5, 4, 0, 'LF', 4, 1, 2, 0, 1) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(2, 4, 2, 0, 5, 3, 0, 'SS', 1, 1, 0, 1, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";
INSERT INTO "public"."user_game"("user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr") VALUES(3, 4, 3, 1, 4, 1, 0, '2B', 7, 2, 1, 0, 0) RETURNING "id", "user_id", "game_id", "hits", "walks", "at_bats", "rbi", "strikeouts", "position", "lineup_number", "single", "double", "triple", "hr";

--SELECT all games for all players
SELECT "user"."first_name", "user"."last_name", "user_game".* FROM "user" JOIN "user_game" ON "user"."id"="user_game"."user_id";

--LIST OF PLAYERS AND TOTAL HITS, AT BATS AND A CALCULATED AVERAGE
SELECT "user"."first_name", "user"."last_name", sum("user_game"."hits") AS "total_hits", sum("user_game"."at_bats") AS "total_at_bats", (cast(sum("user_game"."hits") / sum("user_game"."at_bats") AS DECIMAL(3, 3))) AS "avg" FROM "user" JOIN "user_game" ON "user"."id"="user_game"."user_id" GROUP BY "user"."first_name", "user"."last_name";

-- LIST OF TEAMS AND PLAYERS (ADD WHERE clause to get a single team of players)
SELECT "team"."name", "team"."year", "user"."first_name", "user"."last_name" FROM "team" 
JOIN "user_team" ON "team"."id"="user_team"."team_id" 
JOIN "user" ON "user"."id"="user_team"."user_id" 
ORDER BY "team"."name";

-- DISPLAY ALL PLAYERS WITH TOTAL GAMES PLAYED IN A YEAR, NUMBER OF WINS, TOTAL HITS, TOTAL AT BATS, AND CALC AVG BY A YEAR
SELECT "user"."first_name", 
        "user"."last_name", 
        count("game"."id") AS "games_played", 
        count(case when "game"."is_winner"='true' then 1 else null end) AS "wins", 
        sum("user_game"."hits") AS "total_hits", sum("user_game"."at_bats") AS "total_at_bats", 
        (cast(sum("user_game"."hits") / sum("user_game"."at_bats") AS DECIMAL(3,3))) AS "avg" 
FROM "user" 
JOIN "user_game" ON "user_game"."user_id"="user"."id" 
JOIN "game" ON "game"."id"="user_game"."game_id" 
JOIN "team" ON "team"."id"="game"."team_id"
WHERE "team"."year"='2022'
GROUP BY "user"."first_name", "user"."last_name";

-- NOTHING AT THE MOMENT
SELECT "team"."name" AS "Team", ' ' AS " " FROM "team"
UNION
SELECT "user"."first_name", "user"."last_name" FROM "user" 
JOIN "user_team" ON "user_team"."user_id"="user"."id"
JOIN "team" ON "team"."id"="user_team"."team_id"
GROUP BY "team"."id","team"."year", "user"."first_name", "user"."last_name";


