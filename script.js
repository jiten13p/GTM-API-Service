//logic

var CLIENT_ID =
  "772259605237-f6s3padrs11qhnkl4sbcjr8mcb37dvsb.apps.googleusercontent.com";
var SCOPES = [
  "https://www.googleapis.com/auth/tagmanager.manage.accounts",
  "https://www.googleapis.com/auth/tagmanager.edit.containers",
  "https://www.googleapis.com/auth/tagmanager.delete.containers",
  "https://www.googleapis.com/auth/tagmanager.edit.containerversions",
  "https://www.googleapis.com/auth/tagmanager.manage.users",
  "https://www.googleapis.com/auth/tagmanager.publish",
];

// Parameter values used by the script
ACCOUNT_PATH = "accounts/6001211589";
CONTAINER_NAME = "Greetings";
WORKSPACE_NAME = "Example workspace";

function checkAuth(immediate) {
  var authorizeCheckPromise = new Promise((resolve) => {
    gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPES.join(" "),
        immediate: immediate,
      },
      resolve
    );
  });
  authorizeCheckPromise
    .then(handleAuthResult)
    .then(loadTagManagerApi)
    .then(runTagManagerExample)
    .catch(() => {
      console.log("You must authorize any access to the api.");
    });
}

function handleAuthClick(event) {
  checkAuth(true);
  return false;
}

function handleAuthResult(authResult) {
  return new Promise((resolve, reject) => {
    var authorizeDiv = document.getElementById("authorize-div");
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = "none";
      resolve();
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      authorizeDiv.style.display = "inline";
      reject();
    }
  });
}

function loadTagManagerApi() {
  return new Promise((resolve, reject) => {
    console.log("Load Tag Manager api");
    gapi.client.load("tagmanager", "v2", resolve);
  });
}

function runTagManagerExample() {
  return new Promise((resolve, reject) => {
    console.log("Running Tag Manager Example.");
    var trigger = null;
    var workspace = null;
    // findContainer(ACCOUNT_PATH, CONTAINER_NAME).catch(handleError);
    resolve();
  });
}

function handleError(error) {
  console.log("Error when interacting with GTM API");
  console.log(error);
}

function requestPromise(request) {
  return new Promise((resolve, reject) => {
    request.execute((response) => {
      if (response.code) {
        reject(response);
      }
      resolve(response);
    });
  });
}

//Find Accounts
function findAccounts() {
  var request = gapi.client.tagmanager.accounts.list({});
  return requestPromise(request).then((response) => {
    var accounts = response.account || [];
    return accounts || Promise.reject("Unable to find Accounts.");
  });
}

//Find Containers
function findContainers(accountPath) {
  console.log("Finding container in account:" + accountPath);
  var request = gapi.client.tagmanager.accounts.containers.list({
    parent: accountPath,
  });
  return requestPromise(request).then((response) => {
    var containers = response.container || [];
    return containers || Promise.reject("Unable to find containers.");
  });
}

//Find Container
function findContainer(accountPath, containerName) {
  console.log("Finding container in account:" + accountPath);
  var request = gapi.client.tagmanager.accounts.containers.list({
    parent: accountPath,
  });
  return requestPromise(request).then((response) => {
    var containers = response.container || [];
    var container = containers.find(
      (container) => container.name === containerName
    );
    return (
      container ||
      Promise.reject("Unable to find " + containerName + " container.")
    );
  });
}

//Workspace
function createWorkspace(container) {
  console.log("Creating workspace in container:" + container.path);
  var request = gapi.client.tagmanager.accounts.containers.workspaces.create(
    { parent: container.path },
    { name: WORKSPACE_NAME, description: "my workspace created via api" }
  );
  return requestPromise(request);
}

//Retrive Accounts
async function getAccounts() {
  const div = document.createElement("div");
  await findAccounts().then((res) => {
    res.forEach((element) => {
      const p = document.createElement("p");
      p.innerHTML = `AccountId: ${element.accountId} <br/> Path: ${element.path} <br/> Name: ${element.name} <br/>`;
      div.appendChild(p);
    });
  });
  document.getElementById("accounts").appendChild(div);
}

//State
async function state() {
  console.log("Hey, calling from state");
}
