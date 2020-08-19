//Success function
function Success() {
  document.getElementById("getAccounts").disabled = false;
  document.getElementById("getAccounts").classList.add("btn-success");
}

//Find Accounts
function findAccounts() {
  document.getElementById("getAccounts").disabled = true;
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

//Retrive Accounts
async function getAccounts() {
  const div = document.createElement("div");
  await findAccounts().then((res) => {
    ACCOUNTS = res;
    res.forEach((element) => {
      const p = document.createElement("p");
      p.innerHTML = `AccountId: ${element.accountId} <br/> Path: ${element.path} <br/> Name: ${element.name} <br/>`;
      div.appendChild(p);
    });
  });
  document.getElementById("accounts").appendChild(div);
  SelectAccount();
}

//Select Account
function SelectAccount() {
  const select = document.getElementById("select-account");
  ACCOUNTS.forEach((element) => {
    const option = document.createElement("option");
    option.setAttribute("value", element.name);
    option.setAttribute("path", element.path);
    option.innerText = element.name;
    select.appendChild(option);
  });
}

// get Selected Account
function getSelectedAccount() {
  const select = document.getElementById("select-account");
  var selectedAccount = select.options[select.selectedIndex].getAttribute(
    "value"
  );
  sessionStorage.clear();
  sessionStorage.setItem("ACCOUNT", selectedAccount);
  var selectedAccountPath = select.options[select.selectedIndex].getAttribute(
    "path"
  );
  sessionStorage.setItem("ACCOUNT_PATH", selectedAccountPath);
  console.log(selectedAccountPath);
  selectContainer(selectedAccountPath);
}

//Select Container
function selectContainer(selectedAccountPath) {
  const select = document.getElementById("select-container");
  findContainers(selectedAccountPath).then((res) => {
    res.forEach((element) => {
      const option = document.createElement("option");
      option.setAttribute("value", element.containerId);
      option.innerText = element.name + ": " + element.containerId;
      select.appendChild(option);
    });
  });
}

// get Selected Account
function getSelectedContainer() {
  const select = document.getElementById("select-container");
  var selectedContainer = select.options[select.selectedIndex].getAttribute(
    "value"
  );
  sessionStorage.setItem("CONTAINER", selectedContainer);
  var selectedContainerPath = select.options[select.selectedIndex].innerText;

  var selectedContainerName = selectedContainerPath.split(":")[0];

  sessionStorage.setItem("CONTAINER_NAME", selectedContainerName);
  console.log(selectedContainerName);
  findWorkspace();
}

// Find Workspace
function findWorkspace() {
  var path =
    sessionStorage.getItem("ACCOUNT_PATH") +
    "/containers/" +
    sessionStorage.getItem("CONTAINER");

  var request = gapi.client.tagmanager.accounts.containers.workspaces.list({
    parent: path,
  });
  return requestPromise(request).then((response) => {
    var workspacesArr = response;
    workspacesArr.workspace.forEach((space) => {
      tags(space.path);
      triggers(space.path);
      variables(space.path);
    });
  });
}

// Tags
function tags(path) {
  var request = gapi.client.tagmanager.accounts.containers.workspaces.tags.list(
    {
      parent: path,
    }
  );
  return requestPromise(request).then((response) => {
    getTag(response.tag[0].path);
  });
}

// Get a Tag
function getTag(path) {
  console.log(path);
  var request = gapi.client.tagmanager.accounts.containers.workspaces.tags.get({
    parent: path,
  });
  return requestPromise(request).then((response) => {
    console.log(response);
  });
}

// Triggers
function triggers(path) {
  var request = gapi.client.tagmanager.accounts.containers.workspaces.triggers.list(
    {
      parent: path,
    }
  );
  return requestPromise(request).then((response) => {
    // console.log(response.trigger);
  });
}

// Variables
function variables(path) {
  var request = gapi.client.tagmanager.accounts.containers.workspaces.variables.list(
    {
      parent: path,
    }
  );
  return requestPromise(request).then((response) => {
    // console.log(response.variable);
  });
}
