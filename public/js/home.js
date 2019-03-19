function logout() {
  localStorage.clear();
  alert("Successfully logged out!");
  window.location.replace("/");
}

function getPolls() {
  //  Fetch polls
  const get_polls = new Request("api/polls/", {
    method: "GET"
  });

  fetch(get_polls)
    .then(res => {
      if (!res.ok) {
        return res.status(404).json({ error: "Polls not found." });
      } else {
        if (localStorage.getItem("id") === null) {
          setTimeout(getPolls, 1000);
        }
        return res.json();
      }
    })
    .then(allpolls => {
      allpolls.forEach(poll => {
        if (poll.user === localStorage.getItem("id")) {
          var new_poll = document.createElement("fieldset");
          new_poll.class = "poll-bound";
          new_poll.innerHTML = `<legend id="poll-legend">\
              ${poll.question} -\
              <strong>${localStorage.getItem("name")}</strong>\
            </legend>\
            <form action="" id="${poll._id}" name="form1" method="POST">\
              <label>\
                <input type="radio" name="Poll" id="${poll.options[0]._id}" />\
                ${poll.options[0].text}
              </label>\
              <label>\
                <input type="radio" name="Poll" id="${poll.options[1]._id}" />\
                ${poll.options[1].text}
              </label>`;

          if (poll.options[2].text !== undefined) {
            new_poll.innerHTML += `<label>\
                <input type="radio" name="Poll" id="${poll.options[2]._id}" />\
                ${poll.options[2].text}
              </label>`;
          }

          if (poll.options[3].text !== undefined) {
            new_poll.innerHTML += `<label>\
                <input type="radio" name="Poll" id="${poll.options[3]._id}" />\
                ${poll.options[3].text}
              </label>`;
          }

          new_poll.innerHTML += `<input type="submit" name="submit" id="submit" value="Vote" />\
          <button\
            type="button"\
            name="button"\
            onclick="document.getElementById(\'view-results\').style.display=\'block\'"\
          >\
            View results\
          </button>\
          <input type="hidden" name="id" value="form1" />\
          <input type="hidden" name="MM_insert" value="form1" />\
        </form>`;

          document.getElementById("polls_container").appendChild(new_poll);
        }
      });
    });
}

getPolls();

function createPoll(e, form) {
  e.preventDefault();
  var new_question = document.getElementById("question").value;
  var new_option1 = document.getElementById("option1").value;
  var new_option2 = document.getElementById("option2").value;

  var new_option3 = document.getElementById("option3").value;
  var new_option4 = document.getElementById("option4").value;

  newPoll = {
    question: new_question,
    option1: new_option1,
    option2: new_option2,
    option3: new_option3,
    option4: new_option4
  };

  const get_polls = new Request("api/polls/newpoll", {
    method: "POST",
    body: JSON.stringify(newPoll),
    headers: { "Content-Type": "application/json" }
  });

  fetch(get_polls)
    .then((req, res) => {
      if (res.ok) {
        alert("Created new poll!");
        window.location.replace("/home.html");
      } else {
        return res.json();
      }
    })
    .then(data => {
      errors = Object.values(data);
      document.getElementById("create_error").innerHTML = "";
      errors.forEach(key => {
        document.getElementById("create_error").innerHTML += "\n" + key;
      });
    })
    .catch(err => console.log(err));
}
