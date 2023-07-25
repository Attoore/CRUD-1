/*!
 * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//

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
const incidentTable = document.querySelector("#incident-table");
const newBtn = document.querySelector("#new-btn");
const closeBtn = document.querySelector("#close-btn");
const formTitle = document.querySelector("#form-title");

// Array that holds ticket objetcs
const ticketsArray = [
  {
    id: "1111",
    timestamp: 1111111,
    status: "New",
    title: "Test indicent 111",
    description: "blaablaaablaaablaaablaaablaaa",
    owner: "Mike-User",
    updated: "10/10/2023 - 10:15",
    priority: "Low",
  },
  {
    id: "2222",
    timestamp: 1111111,
    status: "Pending",
    title: "Test incident 222",
    description: "blaablaaablaaablaaablaaablaaa",
    owner: "Bob-Admin",
    updated: "10/10/2023 - 10:15",
    priority: "High",
  },
];

// --------Alert function-------------------------------
const showAlert = function (alertType, message) {
  const incidentsEl = document.querySelector(".incidentsEl");

  // Create div named alertDiv
  const alertDiv = document.createElement("div");
  // Assign classes and add content
  alertDiv.className = `alert alert-${alertType}`;
  alertDiv.innerText = `${message}`;
  // Append to desired location
  incidentsEl.before(alertDiv);

  // Remove alert in 4 sec
  setTimeout(() => document.querySelector(".alert").remove(), 4000);
};

// --------Timestamp function----------------------------
//  returns [date-hours, timestamp in milliseconds]
const timeStamp = function () {
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

// --------Random ID function-------------------------------
// Random 4 number ID for incidents - 1000-9999 = pakko olla 4 numeroa
const uniqueID = function () {
  const randomID = Math.trunc(Math.trunc(Math.random() * 9999) + 1000);

  return randomID;
};

// --------Load table function-------------------------------
//load the table from database(array)
const loadTable = function () {
  // Clear the DOM table
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  //   Loop through ticketsArray
  ticketsArray.forEach((entry) => {
    // Create taberow element
    const newRow = document.createElement("tr");

    //Add content ** Inner HTMl vulnerable XSS attacks - replace with innerText
    newRow.innerHTML = `<td class="row-id">${entry.id}</td>
        <td class="row-status">${entry.status}</td>
        <td class="row-title">${entry.title}</td>
        <td class="row-owner">${entry.owner}</td>
        <td class="row-updated">${entry.updated}</td>
        <td class="row-priority">${entry.priority}</td>
        <td class="row-actions">
        <a href="#" class="edit-btn btn btn-warning btn-sm px-3 me-2">Edit</a>
        <a href="#" class="delete-btn btn btn-danger btn-sm">Delete</a>
        </td>`;

    // Add to the DOM
    incidentTable.insertBefore(newRow, incidentTable.firstChild);
  });
};

// --------Save ticket function-------------------------------
// Function saves to ticketArray then render on page
const saveTicket = function (
  entryId,
  entryStatus,
  entryTitle,
  entryDescription,
  entryOwner,
  entryPriority,
  updated,
  timeCode
) {
  // Try to find if this ticketid alrdy exist in the array
  // this returns that ticket - Undefenied if not = new ticket
  const targetTicket = ticketsArray.find((entry) => entryId === entry.id);

  //   If undefined create new ticket
  if (!targetTicket) {
    ticketsArray.push({
      id: entryId,
      timestamp: timeCode,
      status: entryStatus,
      title: entryTitle,
      description: entryDescription,
      owner: entryOwner,
      updated: updated,
      priority: entryPriority,
    });

    // Create taberow element
    const newRow = document.createElement("tr");

    //Add content ** Inner HTMl vulnerable XSS attacks - replace with innerText
    newRow.innerHTML = `<td class="row-id">${entryId}</td>
            <td class="row-status">${entryStatus}</td>
            <td class="row-title">${entryTitle}</td>
            <td class="row-owner">${entryOwner}</td>
            <td class="row-updated">${updated}</td>
            <td class="row-priority">${entryPriority}</td>
            <td class="row-actions">
            <a href="#" class="edit-btn btn btn-warning btn-sm px-3 me-2">Edit</a>
            <a href="#" class="delete-btn btn btn-danger btn-sm">Delete</a>
            </td>`;

    // Add to the DOM
    incidentTable.insertBefore(newRow, incidentTable.firstChild);
    //incidentTable.appendChild(newRow); this adds as lst

    //   Show success alert
    showAlert("success", "New incident added");
  }

  //   If exists in array -> edit values
  if (targetTicket) {
    targetTicket.status = entryStatus;
    targetTicket.title = entryTitle;
    targetTicket.owner = entryOwner;
    targetTicket.description = entryDescription;
    targetTicket.priority = entryPriority;
    targetTicket.updated = timeStamp()[0];
    targetTicket.timestamp = timeStamp()[1];

    showAlert("info", "Incident Updated!");
  }

  console.log(ticketsArray);
  loadTable();
};

// ---------------------INITIAL LOAD-------------------------------
loadTable();
console.log(ticketsArray);

// ---------------------------Add entry----------------------------
// -----------------------------------------------------------------
// ----New button eventlistener
newBtn.addEventListener("click", function (e) {
  e.preventDefault;

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

// ----Submit event listener
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

// ----Close button eventlistener
closeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Hide form & Reset form fields
  document.querySelector("#form-card").classList.add("d-none");
  incidentForm.reset();
});

// ----------------------Edit & Delete entry------------------------
// -----------------------------------------------------------------

// Event lsitener on incident table
document.querySelector("#incident-table").addEventListener("click", function (e) {
  e.preventDefault();

  const grandparent = e.target.parentElement.parentElement;
  const rowId = grandparent.querySelector(".row-id").textContent;
  const rowStatus = grandparent.querySelector(".row-status").textContent;
  const rowTitle = grandparent.querySelector(".row-title").textContent;
  const rowPriority = grandparent.querySelector(".row-priority").textContent;

  //   ---------------Delete-----------------------------------
  //If clicked child has delete-btn class
  if (e.target.classList.contains("delete-btn")) {
    // Save ticket status for alert message

    //Find index of clicked ticket in the array
    const entryId = ticketsArray.findIndex((entry) => entry.id === rowId);

    // Conformation popup--------------------
    console.log("Add conformation popup");

    // Remove that index from the array
    ticketsArray.splice(entryId, 1);

    console.log(ticketsArray);

    loadTable();

    showAlert("danger", `Incident Deleted! - ( ${rowTitle} )`);
  }

  //   ---------------Edit-----------------------------------
  if (e.target.classList.contains("edit-btn")) {
    //Update form title from new entry to update entry
    formTitle.textContent = "Update Entry";
    //   Render form card for editing
    document.querySelector("#form-card").classList.remove("d-none");

    //Find index in array
    const entryId = ticketsArray.findIndex((entry) => entry.id === rowId);

    //Populate formfields from array
    document.querySelector("#entryId").value = ticketsArray[entryId].id;
    document.querySelector("#entryOwner").value = ticketsArray[entryId].owner;
    document.querySelector("#entryStatus").value = ticketsArray[entryId].status;
    document.querySelector("#entryTitle").value = ticketsArray[entryId].title;
    document.querySelector("#entryDescription").value = ticketsArray[entryId].description;
    document.querySelector("#entryPriority").value = ticketsArray[entryId].priority;

    //from submit-btn will continue from here
  }
});

// --------------------------------
// object testing

// console.log(ticketsArray);
// console.log(timeStamp()[0]);
