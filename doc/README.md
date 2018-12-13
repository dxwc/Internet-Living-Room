# Dev

+ Start: `npm start` (ensure database server has been started before this, see below)
+ Automatic test: `npm test`
+ Manual test: `npm run dev` and then go to `/test` route (ex: `localhost:9001/test`)

# Node

+ Run once: `nvm install 10.9.0`
    + This version can be necessary to have bcrypt installed without error
    + Remember to run `nvm use` on the root of the project directory before
      running
      anything including initial `npm install` OR
    + Set `nvm alias default 10.9.0` which will use that version by default

# DB

May need to run `systemctl start postgresql` or similar command to start postgresql service on your OS at every reboot.

Run once:

+ `sudo -u postgres createuser -P -s -e ilr_admin` and set account password: `ilr_pass`
+ `sudo -u postgres createdb ilr --owner ilr_admin`

One way to browse and manipulate data :

+ `sudo psql -U ilr_admin -d ilr -W` and then enter password `ilr_pass`
+ Accepts all valid postgres SQL commands, example :
    + Count number of entry in users table: `SELECT COUNT(*) FROM users;`
    + Get max of 5 username from db: `SELECT uname FROM users LIMIT 5;`
    + Deletes/removes everything: `DROP OWNED BY current_user CASCADE;`
+ Additional commands example:
    + `\d <table name>` shows description of table
    + `\dt` or `\dt+` to list relations
    + `\l` lists all database
    + `\conninfo` shows connection info
    + `\?` prints available `psql` command and help text
    + `\q` to quit
+ SQL output from `sync` with logging enabled (last updated 12/13/2018) :


```
CREATE TABLE IF NOT EXISTS "users" ("id" UUID , "uname" TEXT NOT NULL UNIQUE, "upass" TEXT NOT NULL, "fname" TEXT, "lname" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'users' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;

CREATE TABLE IF NOT EXISTS "channels" ("id" UUID , "host" UUID REFERENCES "users" ("id"), "capacity" INTEGER DEFAULT 1, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt"TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'channels' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;

CREATE TABLE IF NOT EXISTS "videos" ("id" TEXT , "channel" UUID  REFERENCES "channels" ("id"), "length" INTEGER NOT NULL, "by" UUID REFERENCES "users" ("id"), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id","channel"));

SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'videos' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;

CREATE TABLE IF NOT EXISTS "main_ch_videos" ("id" TEXT , "length" INTEGER NOT NULL, "by" UUID REFERENCES "users" ("id"), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'main_ch_videos' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
```

# Heroku

+ Init
    + `heroku login`
    + `heroku create ilr`
    + `heroku addons:create heroku-postgresql:hobby-dev`
    + Copy and paste above sql commands to a `setup.sql` file
        + `heroku pg:psql < setup.sql`
        + To reset use web dashboard instead of a sql command
    + `heroku info` to see info
    + `heroku pg:psql` to use psql
    + Ensure branch that is ready to deploy has all important changes committed and then
      run `git push heroku <branch to deploy>:master` to deploy
    + `heroku ps:scale web=0` to turn off
    + `heroku ps:scale web=1` to turn back on
+ <https://devcenter.heroku.com/articles/getting-started-with-nodejs>
+ <https://devcenter.heroku.com/articles/heroku-postgresql>