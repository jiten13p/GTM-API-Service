//Success function
function Success() {
  document.getElementById("getAccounts").disabled = false;
  document.getElementById("getAccounts").classList.add("btn");
  setTimeout(function () {
    document.getElementById("getAccounts").click();
  }, 200);
}

//Global
CTR = {};

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

//Retrive Accounts
async function getAccounts() {
  const div = document.createElement("div");
  await findAccounts().then((res) => {
    SelectAccount(res);
    res.forEach((element) => {
      const p = document.createElement("p");
      p.innerHTML = `AccountId: ${element.accountId} <br/> Path: ${element.path} <br/> Name: ${element.name} <br/>`;
      div.appendChild(p);
    });
  });
  document.getElementById("accounts").appendChild(div);
  document.getElementById("wait").style.display = "none";
}

//Select Account
function SelectAccount(accounts) {
  const select = document.getElementById("select-account");
  accounts.forEach((element) => {
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

// get Selected Container
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
  document.getElementById("wait").style.display = "block";
  findWorkspace();
  getVersion();
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
    // console.log(response.tag);
    console.log("tags list here");
    getTag(response.tag[0].path);
  });
}

// Get a Tag
function getTag(path) {
  var request = gapi.client.tagmanager.accounts.containers.workspaces.tags.get({
    path,
  });
  return requestPromise(request).then((response) => {
    // console.log(response);
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
    console.log("triggers list here");
    getTag(response.trigger[0].path);
  });
}

// Get a Trigger
function getTrigger(path) {
  var request = gapi.client.tagmanager.accounts.containers.workspaces.triggers.get(
    {
      path,
    }
  );
  return requestPromise(request).then((response) => {
    // console.log(response);
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
    console.log("vars list here");
    getTag(response.variable[0].path);
  });
}

// Get a Variable
function getVariable(path) {
  var request = gapi.client.tagmanager.accounts.containers.workspaces.variables.get(
    {
      path,
    }
  );
  return requestPromise(request).then((response) => {
    // console.log(response);
  });
}

// Get CTR by Version
function getVersion() {
  var path =
    sessionStorage.getItem("ACCOUNT_PATH") +
    "/containers/" +
    sessionStorage.getItem("CONTAINER");

  console.log(path);
  var request = gapi.client.tagmanager.accounts.containers.version_headers.latest(
    {
      parent: path,
    }
  );
  return requestPromise(request).then((response) => {
    getCTR(response.path);
  });
}

// Get CTR by Version
function getCTR(path) {
  var request = gapi.client.tagmanager.accounts.containers.versions.get({
    path,
  });
  return requestPromise(request).then((response) => {
    CTR = response;
    console.log("Response saved in CTR");
    tagList();
    triggerList();
    variableList();
    document.getElementById("wait").style.display = "none";
  });
}

function tagList() {
  var list = document.getElementById("tag");
  CTR.tag.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="flex items-center">
                        <div class="ml-4">
                          <div
                            class="text-sm leading-5 font-medium text-gray-900"
                          >
                            ${element.tagId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.name}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        <button id="add${element.tagId}" onclick="add(${element.tagId})">+</button>
                      </div>
                    </td>
                  </tr>`;
    list.appendChild(tr);
  });
}

function triggerList() {
  var list = document.getElementById("trigger");
  CTR.trigger.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="flex items-center">
                        <div class="ml-4">
                          <div
                            class="text-sm leading-5 font-medium text-gray-900"
                          >
                            ${element.triggerId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.name}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        <button id="add${element.triggerId}" onclick="add(${element.triggerId})">+</button>
                      </div>
                    </td>
                  </tr>`;
    list.appendChild(tr);
  });
}

function variableList() {
  var list = document.getElementById("variable");
  CTR.variable.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="flex items-center">
                        <div class="ml-4">
                          <div
                            class="text-sm leading-5 font-medium text-gray-900"
                          >
                            ${element.variableId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.name}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        <button id="add${element.variableId}" onclick="add(${element.variableId})">+</button>
                      </div>
                    </td>
                  </tr>`;
    list.appendChild(tr);
  });
}

function add(id) {
  document.getElementById("add" + id).innerText = "x";
  console.log(id);
}
