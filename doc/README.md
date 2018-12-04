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