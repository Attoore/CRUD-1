import mysql from "mysql2";

import dontenv from "dotenv";
dontenv.config();

// Enviroment variables---------------------------------
//pool of connections to the database
const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise(); //promise api version so can use async awayt instead of callbacks

// Test the MySQL connection
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("Error connecting to MySQL database:", err);
//   } else {
//     console.log("Connected to MySQL database");
//     connection.release();
//   }
// });

// Query all users---------------------------------------
export async function getUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result[0]; // Relevant data in first array item
} //returns a promise

// Query all ticket---------------------------------------
export async function getTickets() {
  const result = await pool.query("SELECT * FROM tickets ORDER BY timestamp ASC;");
  return result[0]; // Relevant data in first array item
} //returns a promise

// Using
// await the promise and assign to variable
// const tickets = await getTickets();
// console.log(tickets);

// Query search-term---------------------------------------
export async function searchTickets(term) {
  const result = await pool.query(`
  SELECT * FROM tickets WHERE ticket_id LIKE "%${term}%"
  OR title LIKE "%${term}%"
  OR description LIKE "%${term}%"
  OR owner LIKE "%${term}%";
  `);
  return result[0]; // Relevant data in first array item
} //returns a promise

// Query one user---------------------------------------
export async function getOneUser(username) {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = ?`,
    [username] //provide username outside of query as second param to query function
  );
  return result[0][0]; // Relevant object out of result array
}

// Query one ticket---------------------------------------
export async function getOneTicket(id) {
  const result = await pool.query(
    `SELECT * FROM tickets WHERE ticket_id = ?`,
    [id] //provide id outside of query as second param to query function
  );
  return result[0][0]; // Relevant object out of result array
}

// Delete one ticket---------------------------------------
export async function deleteOneTicket(id) {
  const result = await pool.query(
    `DELETE FROM tickets WHERE ticket_id = ?`,
    [id] //provide id outside of query as second param to query function
  );
  // return result[0][0]; // Relevant object out of result array
}

export async function updateTicket(
  ticket_id,
  status,
  owner,
  title,
  description,
  priority,
  updated,
  timestamp
) {
  const result = await pool.query(
    `UPDATE tickets 
    SET status = ?, owner = ?, title = ?, description = ?, priority = ?, updated = ?, timestamp = ?
    WHERE ticket_id = ?`,
    [status, owner, title, description, priority, updated, timestamp, ticket_id]
  );
  // return new query that fetches that ticket with id (using the getOneTicket function)
  return getOneTicket(ticket_id);
}

// testing
// const ticket = await getOneTicket(1003);
// console.log(ticket);

// Create a ticket----------------------------------------
export async function createTicket(
  ticket_id,
  status,
  owner,
  title,
  description,
  priority,
  updated,
  timestamp
) {
  const result = await pool.query(
    `INSERT INTO tickets (ticket_id, status, owner, title, description, priority, updated, timestamp)
    VALUES(
    ?,?,?,?,?,?,?,?)`,
    [ticket_id, status, owner, title, description, priority, updated, timestamp]
  );
  // return new query that fetches that ticket with id (using the getOneTicket function)
  return getOneTicket(ticket_id);
}

// Create a user----------------------------------------
export async function createUser(username, role, password) {
  const result = await pool.query(
    `INSERT INTO users (username, role, password)
    VALUES(?,?,?)`,
    [username, role, password]
  );

  return getOneUser(username);
}

// testing
// const createResult = await createTicket(
//   "1007",
//   "Resolved",
//   "Bob-admin",
//   "test ticket 33344",
//   "Testticket desc 333",
//   "Medium",
//   "01.01.2023 - 11:11",
//   "12312321321424240"
// );
// console.log(createResult);
