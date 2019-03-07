function testFunc() {
  console.log("Hello World");
}

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

  var request = new Request("api/users/register", {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: { "Content-Type": "application/json" }
  });

  fetch(request)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data.name);
    })
    .catch(err => console.log(err));
}
