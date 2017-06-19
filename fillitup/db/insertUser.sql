insert into user 
  (username, firstname, lastname, email, password, active, locked, created)
  values ($1, $2, $3, $4, $5, $6, $7, 'now');
