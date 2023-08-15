import express from "express";
import bcrypt from "bcrypt";
import cors from "cors"; //**********

import {
  getUsers,
  getTickets,
  searchTickets,
  getOneUser,
  getOneTicket,
  createUser,
  deleteUser,
  createTicket,
  deleteOneTicket,
  updateTicket,
} from "./database.js";

const app = express();
app.use(cors()); //*************
app.use(express.json()); // so json body is accepted in POST - createTicket function below

// app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Route for quering all users-------------------------------
app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

// Route for quering all tickets-----------------------------
app.get("/tickets", async (req, res) => {
  const tickets = await getTickets();
  res.send(tickets);
});

// Route for searching tickets-----------------------------
app.get("/tickets/search/:term", async (req, res) => {
  const term = req.params.term;
  const tickets = await searchTickets(term);
  res.send(tickets);
});

// Route for quering specific user--------------------------
// app.get("/users/:username", async (req, res) => {
//   const username = req.params.username;
//   const user = await getOneUser(username);
//   res.send(user);
// });

// Route for LOGIN = quering specific user--------------------------
app.post("/users/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await getOneUser(username);

  if (user == null) {
    return res.status(400).json("Login failed");
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      // res.redirect("/index.html");
      res.status(200).send(user);
    } else {
      res.status(400).json("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

// Route for quering specific ticket--------------------------
app.get("/tickets/:id", async (req, res) => {
  const id = req.params.id;
  const ticket = await getOneTicket(id);
  res.send(ticket);
});

// Route for deleting specific ticket--------------------------
app.get("/tickets/delete/:id", async (req, res) => {
  const id = req.params.id;
  const ticket = await deleteOneTicket(id);
  res.json(`Ticket ${id} was deleted`);
});

// Route for creating a user-------------------------------------
app.post("/users", async (req, res) => {
  const { username, password, role } = req.body;
  //   if these listed variables are supplied in req.body...

  //Hashing the password
  const salt = await bcrypt.genSalt(); // generating salt
  const hashedPassword = await bcrypt.hash(password, salt); // hashing pass with salt
  // console.log(salt);
  // console.log(hashedPassword);

  //Create new user with supplied variables
  //calling creator function with necessary args
  const user = await createUser(username, hashedPassword, role);

  //   send back "created" sastuscode and the created user
  res.status(201).send(user);
});

// Route for deleting specific user--------------------------
app.get("/users/delete/:username", async (req, res) => {
  const username = req.params.username;
  const ticket = await deleteUser(username);
  res.json(`User ${username} was deleted`);
});

// Route for creating ticket
app.post("/tickets", async (req, res) => {
  const { ticket_id, status, owner, title, description, priority, updated, timestamp } = req.body;
  //   if these listed variables are supplied in req.body...

  //try create new ticket with supplied variables
  //calling creator function with necessary args
  const ticket = await createTicket(
    ticket_id,
    status,
    owner,
    title,
    description,
    priority,
    updated,
    timestamp
  );

  //   send back created sastuscode and created ticket
  res.status(201).send(ticket);
});

// Route for updating a ticket
app.post("/tickets/update/:id", async (req, res) => {
  const id = req.params.id;

  const { status, owner, title, description, priority, updated, timestamp } = req.body;
  //   if these listed variables are supplied in req.body...

  //try update given ticket with supplied variables
  //calling update function with necessary args
  const ticket = await updateTicket(
    id,
    status,
    owner,
    title,
    description,
    priority,
    updated,
    timestamp
  );

  //   send back updated ticket
  res.send(ticket);
});

// Add Espress v5 error handling? - middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  // res.status(500).send("Something broke! (database)");
  res.status(500).json("ERROR: Something broke! (database)");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is runnin on port 8080 http://localhost:${port}`);
});
// ----
