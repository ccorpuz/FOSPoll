function register(e, form) {
  e.preventDefault();
  var new_name = document.getElementById("register_name").value;
  var new_email = document.getElementById("register_email").value;
  var new_password = document.getElementById("register_password").value;
  var new_cpassword = document.getElementById("register_cpassword").value;

  newUser = {
    name: new_name,
    email: new_email,
    password: new_password,
    cpassword: new_cpassword
  };

  var register_request = new Request("api/users/register", {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: { "Content-Type": "application/json" }
  });

  fetch(register_request)
    .then(res => {
      if (res.ok) {
        //  Redirect
        window.location.replace("/");
      } else {
        return res.json();
      }
    })
    .then(data => {
      errors = Object.values(data);
      document.getElementById("err_label").innerHTML = "";
      errors.forEach(key => {
        document.getElementById("err_label").innerHTML += "\n" + key;
      });
    })
    .catch(err => console.log(err));
}

function login(e, form) {
  e.preventDefault();

  var login_email = document.getElementById("login_email").value;
  var login_password = document.getElementById("login_password").value;

  loginUser = {
    email: login_email,
    password: login_password
  };

  var login_request = new Request("api/users/login", {
    method: "POST",
    body: JSON.stringify(loginUser),
    headers: { "Content-Type": "application/json" }
  });

  fetch(login_request)
    .then(res => {
      if (res.ok) {
        //  Redirect on login
        window.location.replace("/home.html");
        return res.json();
      } else {
        return res.json();
      }
    })
    .then(data => {
      if ("token" in data) {
        localStorage.setItem("token", data["token"]);
      } else {
        errors = Object.values(data);
        document.getElementById("err_label1").innerHTML = "";
        errors.forEach(key => {
          document.getElementById("err_label1").innerHTML += "\n" + key;
        });
      }
    })
    .catch(err => console.log(err));
}
