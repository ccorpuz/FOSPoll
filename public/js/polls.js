function logout() {
  localStorage.clear();
  alert("Successfully logged out!");
  window.location.replace("/");
}

function get_chart() {
  var ctx = document.getElementById("myChart");
  var pollName1, pollName2, pollName3, pollName4;
  var poll1, poll2, poll3, poll4;

  pollName1 = document.getElementById("Poll_0").value;
  pollName2 = document.getElementById("Poll_1").value;
  pollName3 = document.getElementById("Poll_2").value;
  pollName4 = document.getElementById("Poll_3").value;

  poll1 = 54;
  poll2 = 60;
  poll3 = 12;
  poll4 = 16;

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      labels: [pollName1, pollName2, pollName3, pollName4],
      datasets: [
        {
          label: "Results",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: [poll1, poll2, poll3, poll4]
        }
      ]
    },
    // Configuration options go here
    options: {
      responsive: true
    }
  });
}
