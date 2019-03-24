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
        //  Check if user has voted
        const voted = poll.voters.some(
          item => item.user.toString() === localStorage.getItem("id")
        );

        var new_poll = document.createElement("fieldset");
        new_poll.class = "poll-bound";
        new_poll.id = "fieldset" + poll._id;

        let new_HTML = `<legend id="poll-legend">\
              ${poll.question} -\
              <strong>${localStorage.getItem("name")}</strong>\
            </legend>`;

        if (!voted) {
          //  Generate form
          new_HTML += `<form onsubmit="vote(event, this)" id="${
            poll._id
          }" name="form1" method="POST">\
                  <label>\
                    <input type="radio" name="Poll" id="${
                      poll.options[0]._id
                    }" />\
                    ${poll.options[0].text}
                  </label>\
                  <label>\
                    <input type="radio" name="Poll" id="${
                      poll.options[1]._id
                    }" />\
                    ${poll.options[1].text}
                  </label>`;

          if (poll.options[2].text !== undefined) {
            new_HTML += `<label>\
                    <input type="radio" name="Poll" id="${
                      poll.options[2]._id
                    }" />\
                    ${poll.options[2].text}
                  </label>`;
          }

          if (poll.options[3].text !== undefined) {
            new_HTML += `<label>\
                    <input type="radio" name="Poll" id="${
                      poll.options[3]._id
                    }" />\
                    ${poll.options[3].text}
                  </label>`;
          }

          new_HTML += `<input type="submit" name="submit" id="submit" value="Vote" /></form>`;
          new_poll.innerHTML = new_HTML;
          document.getElementById("polls_container").appendChild(new_poll);
        } else {
          //  Generate chart with id of chart+poll_id
          new_HTML += `<canvas id="chart${
            poll._id
          }" aria-label="Shows poll results" role="img"/></canvas>`;
          new_poll.innerHTML = new_HTML;
          document.getElementById("polls_container").appendChild(new_poll);

          var ctx = document.getElementById("chart" + poll._id);

          var new_labels = [poll.options[0].text, poll.options[1].text];

          if (poll.options[2].text !== undefined) {
            new_labels.push(poll.options[2].text);
          }

          if (poll.options[3].text !== undefined) {
            new_labels.push(poll.options[3].text);
          }

          var new_votes = [poll.options[0].votes, poll.options[1].votes];

          if (poll.options[2].text !== undefined) {
            new_votes.push(poll.options[2].votes);
          }

          if (poll.options[3].text !== undefined) {
            new_votes.push(poll.options[3].votes);
          }

          var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: "bar",

            // The data for our dataset
            data: {
              labels: new_labels,
              datasets: [
                {
                  label: "Results",
                  backgroundColor: ["#27ae60", "#2980b9", "#e67e22", "#e74c3c"],
                  borderColor: "#2c3e50",
                  data: new_votes
                }
              ]
            },
            // Configuration options go here
            options: {
              responsive: true,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      stepSize: 1
                    }
                  }
                ]
              }
            }
          });
        }
      });
    });
}

function vote(e, form) {
  e.preventDefault();
  let option_id;
  let options = form.elements["Poll"];

  for (var i = 0; i < options.length; i++) {
    if (options[i].checked) {
      option_id = options[i].id;
      break;
    }
  }

  if (option_id === undefined) {
    alert("Please select an option to vote!");
  } else {
    let newVote = {
      poll: form.id,
      option: option_id
    };

    var vote_request = new Request("api/polls/vote", {
      method: "POST",
      body: JSON.stringify(newVote),
      headers: new Headers({
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      })
    });

    fetch(vote_request)
      .then(res => {
        if (!res.ok) {
          alert("You have already voted!");
          return res.json();
        } else {
          //  Success! Emit something here
          alert("Thank you for your vote!");
        }
      })
      .then(err => console.log(err));
  }
}

// Main
getPolls();
var socket = io();

//  Update chart
socket.on("newvote", data => {
  //  Get poll
  const get_poll = new Request("api/polls/" + data, {
    method: "GET"
  });

  fetch(get_poll)
    .then(res => {
      return res.json();
    })
    .then(poll => {
      //  Replace div
      document.getElementById(
        "fieldset" + poll._id
      ).innerHTML = `<legend id="poll-legend">\
      ${poll.question} -\
      <strong>${localStorage.getItem("name")}</strong>\
    </legend><canvas id="chart${
      poll._id
    }" aria-label="Shows poll results" role="img" />`;

      //  Generate Chart
      var ctx = document.getElementById("chart" + poll._id);

      var new_labels = [poll.options[0].text, poll.options[1].text];

      if (poll.options[2].text !== undefined) {
        new_labels.push(poll.options[2].text);
      }

      if (poll.options[3].text !== undefined) {
        new_labels.push(poll.options[3].text);
      }

      var new_votes = [poll.options[0].votes, poll.options[1].votes];

      if (poll.options[2].text !== undefined) {
        new_votes.push(poll.options[2].votes);
      }

      if (poll.options[3].text !== undefined) {
        new_votes.push(poll.options[3].votes);
      }

      var chart = new Chart(ctx, {
        type: "bar",

        data: {
          labels: new_labels,
          datasets: [
            {
              label: "Results",
              backgroundColor: ["#27ae60", "#2980b9", "#e67e22", "#e74c3c"],
              borderColor: "#2c3e50",
              data: new_votes
            }
          ]
        },

        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  stepSize: 1
                }
              }
            ]
          }
        }
      });
    });
});
