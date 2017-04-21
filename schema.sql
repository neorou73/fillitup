
DROP TABLE IF EXISTS useractivity;
DROP TABLE IF EXISTS user;

CREATE TABLE user
  (username varchar, firstname varchar, lastname varchar, email varchar, password varchar, active boolean, locked boolean, created timestamp DEFAULT CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX useremail on user(email);

CREATE TABLE useractivity
  (loggedon date, email text, accesstoken text, foreign key(email) references user(email));
