# Node

+ Run once: `nvm install 10.9.0`
    + This version can be necessary to have bcrypt installed without error
    + Remember to run `nvm use` on the root of the project directory before
      running
      anything including initial `npm install` OR
    + Set `nvm alias default 10.9.0` which will use that version by default

# DB

Run once every time necessary: `systemctl start postgresql` or similar
command to start postgresql service on your OS

Run once: `sudo -u postgres createuser -P -s -e ilr_admin` and set account password: `ilr_pass`
