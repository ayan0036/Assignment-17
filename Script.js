 function showPage(pageId) {
    ["registerPage", "loginPage", "welcomePage"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
    const showEl = document.getElementById(pageId);
    if (showEl) showEl.classList.remove("hidden");
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function getLastLogin(username) {
    const logins = JSON.parse(localStorage.getItem("lastLogins")) || {};
    return logins[username];
  }

  function setLastLogin(username) {
    const logins = JSON.parse(localStorage.getItem("lastLogins")) || {};
    logins[username] = new Date().toLocaleString();
    localStorage.setItem("lastLogins", JSON.stringify(logins));
  }

  // Auto-login support for welcome page
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    const welcome = document.getElementById("welcomePage");
    if (welcome) {
      showPage("welcomePage");
      document.getElementById("welcomeMessage").textContent = `Welcome, ${loggedInUser.name}`;
      const last = getLastLogin(loggedInUser.username);
      document.getElementById("lastLoginText").textContent = last ? `Last login: ${last}` : "";
    }
  }

  // Show/hide password toggles
  const regPwd = document.getElementById("regPassword");
  const regToggle = document.getElementById("regShowPassword");
  if (regPwd && regToggle) {
    regToggle.onchange = () => regPwd.type = regToggle.checked ? "text" : "password";
  }

  const loginPwd = document.getElementById("loginPassword");
  const loginToggle = document.getElementById("loginShowPassword");
  if (loginPwd && loginToggle) {
    loginToggle.onchange = () => loginPwd.type = loginToggle.checked ? "text" : "password";
  }

  // Register Form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const username = document.getElementById("regUsername").value.trim().toLowerCase();
      const password = document.getElementById("regPassword").value.trim().toLowerCase();
      const regMsg = document.getElementById("regMsg");

      if (password.length < 6) {
        regMsg.textContent = "❌ Password must be at least 6 characters.";
        regMsg.style.color = "red";
        return;
      }

      const users = getUsers();
      if (users.some(u => u.username === username)) {
        regMsg.textContent = "❌ Username already taken.";
        regMsg.style.color = "red";
        return;
      }

      users.push({ name, username, password });
      saveUsers(users);
      regMsg.textContent = "✅ Registered successfully!";
      regMsg.style.color = "green";
      window.location.href = "login.html";
    });
  }

  // Login Form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value.trim().toLowerCase();
      const loginMsg = document.getElementById("loginMsg");
      const users = getUsers();

      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        loginMsg.textContent = "❌ Invalid username or password.";
        loginMsg.style.color = "red";
        return;
      }

      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
      setLastLogin(user.username);
      window.location.href = "welcome.html";
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }

  // Delete Account Button
  const deleteBtn = document.getElementById("deleteBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
      if (user && confirm("Are you sure you want to delete your account?")) {
        const users = getUsers().filter(u => u.username !== user.username);
        saveUsers(users);
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "register.html";
      }
    });
  }
