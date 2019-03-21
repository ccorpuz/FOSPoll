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
          //  Check if user has voted
          const voted = poll.voters.some(
            item => item.user.toString() === localStorage.getItem("id")
          );

          var new_poll = document.createElement("fieldset");
          new_poll.class = "poll-bound";
          let new_HTML = `<legend id="poll-legend">\
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
            new_HTML += `<label>\
                <input type="radio" name="Poll" id="${poll.options[2]._id}" />\
                ${poll.options[2].text}
              </label>`;
          }

          if (poll.options[3].text !== undefined) {
            new_HTML += `<label>\
                <input type="radio" name="Poll" id="${poll.options[3]._id}" />\
                ${poll.options[3].text}
              </label>`;
          }

          if (!voted) {
            new_HTML += `<input type="submit" name="submit" id="submit" value="Vote" /></form>`;
          } else {
            new_HTML +=
              '<button\
            type="button"\
            name="button"\
            onclick=""\
          >\
            View results\
          </button>';
          }

          new_poll.innerHTML = new_HTML;
          document.getElementById("polls_container").appendChild(new_poll);
        }
      });
    });
}

function createPoll(e, form) {
  e.preventDefault();
  var new_question = document.getElementById("question").value;
  var new_option1 = document.getElementById("option1").value;
  var new_option2 = document.getElementById("option2").value;

  if (document.getElementById("option3").value.length > 0) {
    var new_option3 = document.getElementById("option3").value;
  }

  if (document.getElementById("option4").value.length > 0) {
    var new_option4 = document.getElementById("option4").value;
  }

  newPoll = {
    question: new_question,
    option1: new_option1,
    option2: new_option2,
    option3: new_option3,
    option4: new_option4
  };

  const new_poll = new Request("api/polls/newpoll", {
    method: "POST",
    body: JSON.stringify(newPoll),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    }
  });

  fetch(new_poll)
    .then(res => {
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

//  Main
getPolls();
