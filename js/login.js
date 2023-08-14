//!yellow -------------------LOGIN-------------------------------------------
// const server = "http://localhost:8080";
const server = "ticketing-app.up.railway.app";

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.querySelector("#login-username").value;
  const password = document.querySelector("#login-password").value;

  const response = await fetch(`/users/login`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  const data = await response.json();

  // If login succesfull -> Store user data in browser session storage
  if (response.status == 200) {
    const user = data;
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "/index.html";
  } else {
    alert("Login failed...");
  }

  loginForm.reset();
  // console.log(data);
});

// let currentUser;

// console.log(currentUser);
