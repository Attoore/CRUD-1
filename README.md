# Frontend

https://t-app-frontend.netlify.app/

Testing credentials:

Username: test-user

password: test-user

---

# Info

### Frontend - Bootstrap & Vanilla JavaScript

- Simple, clean and user friendly interface
- Users can perform all the CRUD operations and interact with data stored in the database

### Backend - Node.js(Express.js) & MySQL

- Various routes in `server.js` file, that handle different tasks like retrieving, creating and deleting users/tickets and handling user login
- These routes interact with MySQL database using functions defined in the `database.js` file
- Error handling middle-ware to catch any errors during database operations

### Authentication

- Server-side authentication using the `/users/login` route
- Using Bcrypt to compare username & password provided by users to the ones stored in database

### Authorization

- Role based authorization. Current user role stored in browser session storage
- `Create user` form works only for admins

---
