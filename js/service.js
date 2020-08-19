//Success function
function Success() {
  document.getElementById("getTags").disabled = false;
  document.getElementById("getTags").classList.add("btn-success");
}

// function getTags() {
//   console.log("called");
// }

//Find Tags
// function getTags() {
//   var request = gapi.client.tagmanager.accounts.containers.workspaces.tags.list({
//     accountId='6001856086',
//     containerId='32222110'
//   });
//   return requestPromise(request).then((response) => {
//     console.log(response)
//     var tags = response.container || [];
//     // var container = containers.find(
//     //   (container) => container.name === containerName
//     // );
//     return (
//       tags ||
//       Promise.reject("Unable to find " + tags + "in container.")
//     );
//   });
// }

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
