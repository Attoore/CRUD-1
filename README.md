Frontend
t-app-frontend.netlify.app/

Backend
https://t-app.up.railway.app/

Info

Frontend HTML, CSS, and Vanilla JavaScript - Simple, clean and user friendly interface - Users able to perform all the CRUD operations and interact with data stored in a database
Backend Node.js(Express.js) and MySQL - Various routes in `server.js` file, that handle different tasks like retrieving, creating and deleting users/tickets and handling user login - These routes interact with MySQL database using functions defined in the `database.js` file - Error handling middleware to catch any errors during database operations

Authentication

- Serverside authentication using the `/users/login` route - Using bcrypt to compare username & password provided by users to the ones stored in database
  Authorization - Role based authorization. Current user role stored in browser session storage - `Create user` form works only for admins

How the app works

Login

Extract form values
POST request to server /users/login -> getOneUser -> DB user-qurey -> Bcrypt.compare passwords
· Passwords match -> successful login
§ Save user information to browser session storage
· Passwords dont match -> failed login

Initial Load

checkCurrentUser
· Checks current user from session storage -> Redirect to Login page if empty
loadTable
• Clear table content
• Fetch tickets from DB and loop trough them
• Create table-row for for each one
loadOwnerDropdown
• Clear ticket owner dropdown options
• Fetch user list from DB
• Add each to dropdown options

New-btn
• Update form title
• Reset form
• Call uniqueID -> Generates ID  
 • Populates forms id field
• Render form
Submit-btn
• Extract form values
• Call timeStamp to populate timestamp values (updated/timestamp)
• Call saveTicket passing all necessay args -> function searches ticket with passed ID from DB
§ If doesnt exist -> call AddNewTicket -> POST request to server /tickets -> CreateTicket -> DB create-qurey
§ If exists -> call updateTicket -> POST request to server /tickets/update/id -> UpdateTicket -> DB update-qurey
§ Call loadTable to refresh incident table
§ Show created or updated alert
• Hide form card and reset form fields

NOTE: because Edit-btn & Delete-btn are dynamically created they use common parent event listener distinguished by class name

Edit-btn
• Update form title
• Render form
• Call fetchOneTicket passing rowID as arg
• Populate form values with values from DB
• Submit-btn wiill continue from here

Delete-btn
• Save rowID and status to global variables targetrowID and targetRowTitle to use on other functions
• Render deletion conformation modal
• Modal confirm-btn
§ Call deleteTicket(id) -> GET request to server /tickets/delete/id -> deleteTicket -> DB delete-qurey
§ Call loadTable to refresh incident table
§ Show deletion success alert
§ Wipe global variables targetrowID and targetRowTitle

Search-btn
• Exctract search-term from search bar
• If empty -> Call loadTable to refresh incident table
• If not -> Call searchTickets(term) GET request to server /tickets/search/term -> searchTickets -> DB search-qurey
§ Clear incident table
§ Loop trough result tickets and create table-row for each one

Create user-btn
• Render user form
• Submit-btn
• Get currentUser role from session storage
§ If admin
▫ Exctract from values
▫ Call createUser passing args -> POST request /users -> Add salt and hash the password using Bcrypt -> createUser -> DB create-qurey
§ If not admin
▫ Show not authorized alert
• Hide and reset form

Logout-btn
• Remove currentUser variable from session storage
Reload the page -> initial load kicks in -> redirect to login page
