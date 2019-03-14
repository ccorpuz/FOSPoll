function logout() {
  localStorage.removeItem("token");
  alert("Successfully logged out!");
  window.location.replace("/");
}
