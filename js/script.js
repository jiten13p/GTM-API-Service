//Success function
function Success() {
  if (SUCCESS == true) {
    document.getElementById("auth").innerText = "Success";
    //document.getElementById("proceed").style.display = "none";
    document.getElementById("auth").style.display = "none";
    setTimeout(function (){document.getElementById("proceed").click()},200);
  }
}
