//Success function
function Success() {}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("account-name").innerText = sessionStorage.getItem(
    "ACCOUNT"
  );
  document.getElementById("account-path").innerText = sessionStorage.getItem(
    "ACCOUNT_PATH"
  );
  document.getElementById("container-name").innerText = sessionStorage.getItem(
    "CONTAINER_NAME"
  );
  document.getElementById("container").innerText = sessionStorage.getItem(
    "CONTAINER"
  );
});
