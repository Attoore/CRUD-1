/*!
 * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */

// ---------------------------Side navigation-----------------------
window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }
});
const incidentForm = document.querySelector("#incident-form");
const userForm = document.querySelector("#user-form");
const userFormCard = document.querySelector("#user-form-card");
const incidentTable = document.querySelector("#incident-table");
const newBtn = document.querySelector("#new-btn");
const closeBtn = document.querySelector("#close-btn");
const closeBtn2 = document.querySelector("#close-btn-2");
const formTitle = document.querySelector("#form-title");
const currentUserEl = document.querySelector("#current-user");
const logOutBtn = document.querySelector("#log-out-btn");

// Server URL + Port
// const server = "http://localhost:8080";
const server = "https://t-app.up.railway.app";

//!pink --------------------FUNCTIONS----------------------------------

function checkCurrentUser() {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  // console.log(currentUser);

  // If current user not set redirect to login page
  if (!currentUser) {
    window.location.href = "/login.html";
  } else {
    currentUserEl.textContent = currentUser.username;
  }
}

//Fetch tickets from the database
async function fetchTicketData() {
  const response = await fetch(`${server}/tickets`);
  const data = await response.json();
  return data;
}

// populates form Owner field dropdown
async function loadOwnerDropdown() {
  const users = await fetchUsers();

  const selectDropDown = document.querySelector("#entryOwner");

  selectDropDown.innerHTML = "";

  // populate owner dropdown
  users.forEach((entry) => {
    //Create new option element
    const newOption = document.createElement("option");

    //Fill value
    newOption.textContent = entry.username;

    //Insert to DOM
    selectDropDown.insertBefore(newOption, selectDropDown.lastChild);
  });
}
//Search tickets with a searechterm in id, title or description)
async function searchTickets(searchTerm) {
  const response = await fetch(`${server}/tickets/search/${searchTerm}`);
  const data = await response.json();
  return data;
}

async function fetchOneTicket(id) {
  const response = await fetch(`${server}/tickets/${id}`);
  const data = await response.json();
  return data;
}

const fetchUsers = async function () {
  const response = await fetch(`${server}/users`);
  const data = await response.json();
  // console.log(data);
  return data;
};

const createUser = async function (username, password, role) {
  try {
    const response = await fetch(`${server}/users`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        role: role,
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const addNewTicket = async function (
  entryId,
  entryStatus,
  entryTitle,
  entryDescription,
  entryOwner,
  entryPriority,
  updated,
  timeCode
) {
  try {
    const response = await fetch(`${server}/tickets`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        ticket_id: entryId,
        timestamp: timeCode,
        status: entryStatus,
        title: entryTitle,
        description: entryDescription,
        owner: entryOwner,
        updated: updated,
        priority: entryPriority,
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateTicket = async function (
  entryId,
  entryStatus,
  entryTitle,
  entryDescription,
  entryOwner,
  entryPriority,
  updated,
  timeCode
) {
  try {
    const response = await fetch(`${server}/tickets/update/${entryId}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        ticket_id: entryId,
        timestamp: timeCode,
        status: entryStatus,
        title: entryTitle,
        description: entryDescription,
        owner: entryOwner,
        updated: updated,
        priority: entryPriority,
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteTicket = async function (id) {
  const response = await fetch(`${server}/tickets/delete/${id}`);
  const data = await response.json();
  console.log(data);
  return data;
};

//-------Alert function--------
const showAlert = function (alertType, message) {
  const incidentsEl = document.querySelector(".incidentsEl");

  // Create div named alertDiv
  const alertDiv = document.createElement("div");
  // Assign classes and add content
  alertDiv.className = `alert alert-${alertType}`;
  alertDiv.innerText = `${message}`;
  // Append to desired location
  incidentsEl.before(alertDiv);

  // Remove alert in 5 sec
  setTimeout(() => document.querySelector(".alert").remove(), 5000);
};

// -------Timestamp function-----
const timeStamp = function () {
  //  returns [date-hours, timestamp in milliseconds]

  const timeCode = Date.now();
  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const day = now.getDate();
  const month = now.getMonth() + 1; // this is 0 based. so +1 to get this month
  const year = now.getFullYear();

  return [
    `${day.toString().padStart(2, 0)}/${month.toString().padStart(2, 0)}/${year} - ${hours
      .toString()
      .padStart(2, 0)}:${minutes.toString().padStart(2, 0)}`,
    timeCode,
  ];
};

// --------Random ID function------
const uniqueID = function () {
  // Random 4 number ID for incidents - 1000-9999 = pakko olla 4 numeroa
  // const randomID = Math.trunc(Math.random() * 9000 + 1000);
  const randomID = Math.floor(Math.random() * 9000) + 1000;

  return randomID;

  //Add reroll if number used??
};

// --------Load table function-------------------------------
//load the table from database
const loadTable = async function () {
  // Clear the DOM table
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  const ticketsArray = await fetchTicketData();
  //   Loop through ticketsArray
  ticketsArray.forEach((entry) => {
    // Create tablerow element
    const newRow = document.createElement("tr");
    //Add content ** Inner HTMl vulnerable XSS attacks - replace with innerText
    newRow.innerHTML = `<td class="row-id">${entry.ticket_id}</td>
        <td class="row-status">${entry.status}</td>
        <td class="row-title">${entry.title}</td>
        <td class="row-owner">${entry.owner}</td>
        <td class="row-updated">${entry.updated}</td>
        <td class="row-priority">${entry.priority}</td>
        <td class="row-actions">
        <a href="#" class="edit-btn btn btn-warning btn-sm px-3 me-2">Edit</a>
        <a href="#" class="delete-btn btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</a>
        </td>`;

    // Insert to the DOM
    incidentTable.insertBefore(newRow, incidentTable.firstChild);
  });
};

// --------Save ticket function-------------------------------
// Function saves to ticketArray then render on page
const saveTicket = async function (
  entryId,
  entryStatus,
  entryTitle,
  entryDescription,
  entryOwner,
  entryPriority,
  updated,
  timeCode
) {
  // Fetch all tickets from database
  const ticketsArray = await fetchTicketData();
  // console.log(ticketsArray);

  // Try to find if this ticketid alrdy exist in the array
  // this returns that ticket - Undefenied if not = new ticket
  const targetTicket = ticketsArray.find((entry) => entryId == entry.ticket_id);
  // console.log(targetTicket);

  //   If undefined =  doesnt exist - create new ticket
  if (!targetTicket) {
    await addNewTicket(
      entryId,
      entryStatus,
      entryTitle,
      entryDescription,
      entryOwner,
      entryPriority,
      updated,
      timeCode
    );

    //   Show success alert
    showAlert("success", "New incident added");
  }

  //   If exists in array -> edit/overwrite values
  if (targetTicket) {
    await updateTicket(
      entryId,
      entryStatus,
      entryTitle,
      entryDescription,
      entryOwner,
      entryPriority,
      updated,
      timeCode
    );

    showAlert("info", "Incident Updated!");
  }

  await loadTable();
};

// ----------------------INITIAL LOAD-------------------------------
checkCurrentUser();
loadTable();
loadOwnerDropdown();
// ----------------------INITIAL LOAD-------------------------------

//!green --------------------Eventlisteners----------------------------------
// ---------------------------Add entry----------------------------
// ----NEW button eventlistener
newBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  //Update form title
  formTitle.textContent = "New Entry";

  //   reset form incase has values already
  incidentForm.reset();

  // generate new incident ID
  const newIncidentId = uniqueID();
  document.querySelector("#entryId").value = newIncidentId;

  //   Render form card
  document.querySelector("#form-card").classList.remove("d-none");
});

// ----SUBMIT btn eventlistener
incidentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Extract form values
  const entryId = document.querySelector("#entryId").value;
  const entryStatus = document.querySelector("#entryStatus").value;
  const entryTitle = document.querySelector("#entryTitle").value;
  const entryDescription = document.querySelector("#entryDescription").value;
  const entryOwner = document.querySelector("#entryOwner").value;
  const entryPriority = document.querySelector("#entryPriority").value;
  const updated = timeStamp()[0];
  const timeCode = timeStamp()[1];

  // Call saveTicket function & pass all values
  saveTicket(
    entryId,
    entryStatus,
    entryTitle,
    entryDescription,
    entryOwner,
    entryPriority,
    updated,
    timeCode
  );

  // Hide form & Reset form fields
  document.querySelector("#form-card").classList.add("d-none");
  incidentForm.reset();
});

// ----CLOSE button eventlistener ticket form
closeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Hide form & Reset form fields
  document.querySelector("#form-card").classList.add("d-none");
  incidentForm.reset();
});

// ----CLOSE button 2 eventlistener - user form
closeBtn2.addEventListener("click", function (e) {
  e.preventDefault();

  // Hide form & Reset form fields
  document.querySelector("#user-form-card").classList.add("d-none");
  userForm.reset();
});

// ----------------------Edit & Delete entry------------------------
let targetRowId; //global variable to save row id for eventlisteners
let targetRowTitle; //global variable to save row title for eventlisteners

// EDIT / DELETE  Event lsitener on incident table because these can be dynamicly created - Using event delegation to handle on parent
document.querySelector("#incident-table").addEventListener("click", async function (e) {
  e.preventDefault();

  const grandparent = e.target.parentElement.parentElement;
  const rowId = grandparent.querySelector(".row-id").textContent;
  const rowTitle = grandparent.querySelector(".row-title").textContent;

  //   ---------------Delete-----------------------------------
  //If clicked child has delete-btn class
  if (e.target.classList.contains("delete-btn")) {
    //save rowId to gloabl rowid variable
    targetRowId = rowId;
    targetRowTitle = rowTitle;
  }

  //   ---------------Edit-----------------------------------
  if (e.target.classList.contains("edit-btn")) {
    // Update form title from new entry to update entry
    formTitle.textContent = "Update Entry";

    // Render form card for editing
    document.querySelector("#form-card").classList.remove("d-none");

    //Fetch ticket from database
    const ticket = await fetchOneTicket(rowId);

    //Populate formfields from returned ticket object
    document.querySelector("#entryId").value = ticket.ticket_id;
    document.querySelector("#entryOwner").value = ticket.owner;
    document.querySelector("#entryStatus").value = ticket.status;
    document.querySelector("#entryTitle").value = ticket.title;
    document.querySelector("#entryDescription").value = ticket.description;
    document.querySelector("#entryPriority").value = ticket.priority;

    //from submit-btn will continue from here
  }
});

// Event listener on deletion modals confirm btn
const ConfirmBtn = document.querySelector("#deleteConfirmBtn");
ConfirmBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  e.stopPropagation();
  // console.log(e.target);

  // Call deleteTicket function with id taken from global variable
  await deleteTicket(targetRowId);

  await loadTable();

  showAlert("danger", `Incident ( ${targetRowId} - ${targetRowTitle} ) was deleted!`);

  //Wipe gobal row variables
  targetRowId = undefined;
  targetRowTitle = undefined;
});

// Search eventlistener - on submit event
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const searchTerm = document.querySelector("#search-bar").value;

  // if empty search
  if (searchTerm == "") {
    loadTable();
    return;
  }

  // Fetch corresponding tickets
  const results = await searchTickets(searchTerm);

  // Clear the DOM table
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  //   Loop through results
  results.forEach((entry) => {
    // Create tablerow element
    const newRow = document.createElement("tr");
    //Add content ** Inner HTMl vulnerable XSS attacks - replace with innerText
    newRow.innerHTML = `<td class="row-id">${entry.ticket_id}</td>
         <td class="row-status">${entry.status}</td>
         <td class="row-title">${entry.title}</td>
         <td class="row-owner">${entry.owner}</td>
         <td class="row-updated">${entry.updated}</td>
         <td class="row-priority">${entry.priority}</td>
         <td class="row-actions">
         <a href="#" class="edit-btn btn btn-warning btn-sm px-3 me-2">Edit</a>
         <a href="#" class="delete-btn btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</a>
         </td>`;

    // Insert to the DOM
    incidentTable.insertBefore(newRow, incidentTable.firstChild);
  });

  // console.log(results);
});

// Create user button eventlistener
const createUserBtn = document.querySelector("#CreateUserBtn");
createUserBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Render user form
  userFormCard.classList.remove("d-none");
});

// User form submit eventlistener
userForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  if (currentUser.role == "admin") {
    // Extract values from form
    const username = document.querySelector("#user-username").value;
    const password = document.querySelector("#user-password").value;
    const userRole = document.querySelector("#user-user-role").value;

    // Post request - username must be unique or fail - duplicate
    await createUser(username, password, userRole);

    // Update owner dropdown options
    await loadOwnerDropdown();

    showAlert("success", `User ${username} has been created`);
  } else {
    showAlert("danger", "You are not authorized for this action");
  }

  // Hide form
  userFormCard.classList.add("d-none");
  userForm.reset();
});

// Log out btn eventlistener
logOutBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Remove current user value from storage session
  sessionStorage.removeItem("currentUser");

  // Reload -> causes redirect to login page coz of (checkCurrentUser function)
  location.reload();
});
// ----------------Testing---------------

//Things to add
// - RandomID reroll
// - Authentication / Authorization
// - More error handling

// addUser("Juggi-user", "user", "olaabolaa123");

// addNewTicket(
//   "11111",
//   "Open",
//   "Yomada chiis 11",
//   "yomada desc desc",
//   "Bob-admin",
//   "Low",
//   "03.03.2023 - 11:11",
//   "123124312434444"
// );

// updateTicket(
//   "9511",
//   "Open",
//   "Yomada chiis 11",
//   "yomada desc desc",
//   "Bob-admin",
//   "Low",
//   "03.03.2023 - 11:11",
//   "123124312434444"
// );
