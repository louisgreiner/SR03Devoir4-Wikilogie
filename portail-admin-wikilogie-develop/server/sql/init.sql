-- Adminer 4.7.7 PostgreSQL dump
DROP TABLE IF EXISTS "fields" CASCADE;
CREATE TABLE "public"."fields" (
    "field" character varying PRIMARY KEY
) WITH (oids = false);
INSERT INTO "fields" ("field") VALUES
('it'),
('mecanic');


DROP TABLE IF EXISTS "users" CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;
DROP SEQUENCE IF EXISTS articles_id_seq CASCADE;
CREATE SEQUENCE articles_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "login" character varying(20) NOT NULL,
    "password" character varying(64) NOT NULL,
    "email" character varying(64) NOT NULL,
    "score" integer NOT NULL,
    "email_confirmed" integer NOT NULL,
    "is_admin" integer NOT NULL,
    UNIQUE ("login"),
    UNIQUE ("email"),
    CONSTRAINT "users_id" PRIMARY KEY ("id"),
    CONSTRAINT "is_admin_check" CHECK ("is_admin" = 0 OR "is_admin" = 1)
) WITH (oids = false);


DROP TABLE IF EXISTS "user_fields" CASCADE;
CREATE TABLE "public"."user_fields" (
    "user" integer REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "field" character varying REFERENCES "fields"("field") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("user", "field")
) WITH (oids = false);



DROP TABLE IF EXISTS "follows" CASCADE;
CREATE TABLE "public"."follows" (
    "login" character varying(20),
    "following" character varying(20),
    CONSTRAINT "fk_login"
        FOREIGN KEY("login") 
        REFERENCES "users"("login")
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT "fk_following"
        FOREIGN KEY("following") 
        REFERENCES "users"("login")
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY ("login", "following")
) WITH (oids = false);



DROP TABLE IF EXISTS "quizz" CASCADE;
CREATE TABLE "public"."quizz" (
    "user" character varying REFERENCES "users"("login") ON DELETE CASCADE ON UPDATE CASCADE,
    "quizz" character VARYING,
    "title" character VARYING,
    "score" INTEGER,
    PRIMARY KEY ("user", "quizz")
) WITH (oids = false);



DROP TABLE IF EXISTS "articles_to_verify" CASCADE;
CREATE TABLE "public"."articles_to_verify" (
    "article_id" integer DEFAULT nextval('articles_id_seq') NOT NULL,
    "title" character varying(255),
    "author" character varying NOT NULL,
    "reason" character varying NOT NULL,
    "is_verified" integer CHECK ("is_verified" = 0 OR "is_verified" = 1),
    "date_report" timestamptz NOT NULL,
    "date_verification" timestamptz CHECK ("date_report" < "date_verification"),
    "status" integer CHECK ("status" = 0 OR "status" = 1),
    "verified_by" integer,
    PRIMARY KEY ("article_id", "author", "date_report"),
    CONSTRAINT fk_author FOREIGN KEY("author") REFERENCES "users"("login") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_admin FOREIGN KEY("verified_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
) WITH (oids = false);



-- DROP FUNCTION IF EXISTS get_number_of_reports CASCADE;

-- CREATE FUNCTION get_number_of_reports(character varying) RETURNS bigint AS $$
--     SELECT count(*) FROM "public"."articles_to_verify"
--     WHERE "article_id" = $1
--     $$ LANGUAGE SQL;

-- example : select get_number_of_reports('1xGMUnYBicKd1J03U54U'); 
-- 2020-12-14 18:55:32.382959+00

INSERT INTO users(login, password, email, score, email_confirmed, is_admin) VALUES ('lgreiner', 'aze', 'louis.greiner@etu.utc.fr', 20, 1, 1);
INSERT INTO users(login, password, email, score, email_confirmed, is_admin) VALUES ('bmissaoui', 'aze', 'benjamin.missaoui@etu.utc.fr', 17, 1, 1);
INSERT INTO users(login, password, email, score, email_confirmed, is_admin) VALUES ('wguilbaud', 'aze', 'william.guilaud@etu.utc.fr', 15, 1, 1);
INSERT INTO users(login, password, email, score, email_confirmed, is_admin) VALUES ('lhusson', 'aze', 'loic.husson@etu.utc.fr', 16, 1, 1);
INSERT INTO users(login, password, email, score, email_confirmed, is_admin) VALUES ('alounis', '1234', 'ahmed.lounis@hds.utc.fr', 2, 0, 0);
INSERT INTO users(login, password, email, score, email_confirmed, is_admin) VALUES ('gquentin', '1234', 'gregory.quentin@utc.fr', 5, 0, 0);
INSERT INTO users(login, password, email, score, email_confirmed, is_admin) VALUES ('makheraz', '1234', 'mohamed.akheraz@utc.fr', 7, 1, 0);

INSERT INTO fields VALUES ('biology');
INSERT INTO fields VALUES ('astronomy');
INSERT INTO fields VALUES ('statistics');

INSERT INTO user_fields VALUES (1,'astronomy');
INSERT INTO user_fields VALUES (1,'biology');
INSERT INTO user_fields VALUES (2,'statistics');
INSERT INTO user_fields VALUES (2,'it');
INSERT INTO user_fields VALUES (3,'mecanic');
INSERT INTO user_fields VALUES (4,'astronomy');

INSERT INTO follows VALUES ('lgreiner','bmissaoui');
INSERT INTO follows VALUES ('lgreiner','lhusson');
INSERT INTO follows VALUES ('bmissaoui','lgreiner');
INSERT INTO follows VALUES ('bmissaoui','wguilbaud');
INSERT INTO follows VALUES ('wguilbaud','bmissaoui');
INSERT INTO follows VALUES ('lhusson','wguilbaud');

INSERT INTO quizz VALUES ('lgreiner','quizz5142.com','Recyclage','16');
INSERT INTO quizz VALUES ('bmissaoui','quizz5632.com','Voiture','19');
INSERT INTO quizz VALUES ('bmissaoui','quizz1242.com','Pissenlit','20');
INSERT INTO quizz VALUES ('lhusson','quizz5142.com','Thermodynique des fluides','10');

INSERT INTO articles_to_verify(title, author, reason, is_verified, date_report, date_verification, status, verified_by) VALUES ('Nouvelle aire de jeu a Margny','bmissaoui','Affaire urgente',1,'2020-05-05T10:20:30.000Z','2020-07-10T15:27:30.000Z',1,1);
INSERT INTO articles_to_verify(title, author, reason, is_verified, date_report, date_verification, status, verified_by) VALUES ('Vive le petrole','lhusson','Pas de sources',0,'2020-12-02T17:13:57.000Z',null,0,null);
INSERT INTO articles_to_verify(title, author, reason, is_verified, date_report, date_verification, status, verified_by) VALUES ('49.3','lgreiner','En scred',0,'2020-08-12T12:35:07.000Z',null,0,null);
INSERT INTO articles_to_verify(title, author, reason, is_verified, date_report, date_verification, status, verified_by) VALUES ('IoT','lgreiner','internet des objets',0,'2021-05-08T06:29:58.000Z',null,0,null);
INSERT INTO articles_to_verify(title, author, reason, is_verified, date_report, date_verification, status, verified_by) VALUES ('Barbecue','wguilbaud','Impact des BBQ',0,'2021-06-12T21:18:45.000Z',null,0,null);
