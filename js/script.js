//Success function
function Success() {
  if (SUCCESS == true) {
    setTimeout(function () {
      document.getElementById("proceed").click();
      document.getElementById("auth").innerText = "Authenticated";
      document.getElementById("proceed").style.display = "block";
    }, 100);
  }
}
