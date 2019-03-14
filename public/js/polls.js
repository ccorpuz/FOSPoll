function logout() {
  localStorage.clear();
  alert("Successfully logged out!");
  window.location.replace("/");
}
