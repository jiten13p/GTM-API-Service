//Success function
function Success() {
  document.getElementById("getAccounts").disabled = false;
  document.getElementById("getAccounts").classList.add("btn");
  setTimeout(function () {
    document.getElementById("getAccounts").click();
  }, 200);
}

EDITOR = {};

selectedComponent = "";

//Modal
function toggleModal() {
  // -------------------------

  // create the editor
  // const editId = document.getElementById("jsoneditor");
  // const options = {};
  // EDITOR = new JSONEditor(editId, options);

  // // set json
  // const initialJson = {
  //   type: "",
  //   key: "",
  //   value: "",
  // };
  // EDITOR.set(initialJson);

  // -------------------------

  const body = document.getElementById("modal-body");
  const modal = document.querySelector(".modal");
  modal.classList.toggle("opacity-0");
  modal.classList.toggle("pointer-events-none");
  body.classList.toggle("modal-active");
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
  await findAccounts().then((res) => {
    SelectAccount(res);
  });
  // document.getElementById("select-component").selectedIndex = 0;
  document.getElementById("wait").style.display = "none";
}

//Select Account
function SelectAccount(accounts) {
  const select = document.getElementById("select-account");
  if (select.childElementCount > 1) {
    return;
  } else {
    accounts.forEach((element) => {
      const option = document.createElement("option");
      option.setAttribute("value", element.name);
      option.setAttribute("path", element.path);
      option.innerText = element.name;
      select.appendChild(option);
    });
  }
}

// get Selected Account
function getSelectedAccount() {
  const select = document.getElementById("select-account");
  var selectedAccount = select.options[select.selectedIndex].getAttribute(
    "value"
  );

  if (selectedAccount == "NULL") {
    document.getElementById("gtm-acc").innerHTML = "GTM ACCOUNTS";
    document.getElementById("select-container").selectedIndex = 0;
    // document.getElementById("select-component").selectedIndex = 0;
  } else {
    sessionStorage.clear();
    sessionStorage.setItem("ACCOUNT", selectedAccount);

    document.getElementById("gtm-acc").innerHTML =
      "GTM ACCOUNTS > <b>" + selectedAccount + "</b>";

    var selectedAccountPath = select.options[select.selectedIndex].getAttribute(
      "path"
    );
    sessionStorage.setItem("ACCOUNT_PATH", selectedAccountPath);
    console.log(selectedAccountPath);
    document.getElementById("select-container").disabled = false;
    selectContainer(selectedAccountPath);
  }
}

//Select Container
function selectContainer(selectedAccountPath) {
  const select = document.getElementById("select-container");
  if (select.childElementCount > 1) {
    return;
  } else {
    findContainers(selectedAccountPath).then((res) => {
      res.forEach((element) => {
        const option = document.createElement("option");
        option.setAttribute("value", element.containerId);
        option.innerText = element.name + ": " + element.containerId;
        select.appendChild(option);
      });
    });
  }
}

// get Selected Container
function getSelectedContainer() {
  const select = document.getElementById("select-container");
  var selectedContainer = select.options[select.selectedIndex].getAttribute(
    "value"
  );

  if (selectedContainer == "NULL") {
    document.getElementById("gtm-acc").innerHTML =
      "GTM ACCOUNTS > <b>" + sessionStorage.getItem("ACCOUNT") + "</b>";
    // document.getElementById("select-component").selectedIndex = 0;
  } else {
    sessionStorage.setItem("CONTAINER", selectedContainer);
    var selectedContainerPath = select.options[select.selectedIndex].innerText;
    var selectedContainerName = selectedContainerPath.split(":")[0];

    sessionStorage.setItem("CONTAINER_NAME", selectedContainerName);

    document.getElementById("gtm-acc").innerHTML =
      "GTM ACCOUNTS > <b>" +
      sessionStorage.getItem("ACCOUNT") +
      " > " +
      selectedContainerName +
      "</b>";

    console.log(selectedContainerName);
    document.getElementById("wait").style.display = "block";
    // document.getElementById("select-component").disabled = false;
    findWorkspace();
    getVersion();
  }
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
    response.workspace.forEach((space) => {
      sessionStorage.setItem("WPATH", space.path);

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
    return response;
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

  var request = gapi.client.tagmanager.accounts.containers.version_headers.latest(
    {
      parent: path,
    }
  );

  return requestPromise(request).then((response) => {
    if (response.path != "accounts/0/containers/0/versions/0") {
      document.getElementById("select-acc").innerText = "SELECT MENU";
      document.getElementById("dash").classList.remove("hidden");
      getCTR(response.path);
    } else {
      console.log("404 : VERSION NOT FOUND !!!");
      document.getElementById("select-acc").innerText =
        "404 VERSION NOT FOUND! KINDLY CREATE A VERSION!";
      // var path = sessionStorage.getItem("ACCOUNT_PATH");
      // selectContainer(path);
      document.getElementById("dash").classList.add("hidden");
      document.getElementById("wait").style.display = "none";
    }
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
    document.getElementById("wait").style.display = "none";
    // createHelloWorldTrigger();
  });
}

function getSelectedComponent(selected) {
  document.getElementById("component-list").classList.remove("hidden");
  document.getElementById("wait").style.display = "block";

  selectedComponent = selected;

  if (selectedComponent == "NULL") {
    var list = document.getElementById("component");
    document.getElementById("gtm-acc").innerHTML =
      "GTM ACCOUNTS > <b>" +
      sessionStorage.getItem("ACCOUNT") +
      " > " +
      sessionStorage.getItem("CONTAINER_NAME") +
      "</b>";
    list.innerHTML = "";

    document.getElementById("component-list").classList.add("hidden");
    document.getElementById("component-name").innerText = "Component List";
    document.getElementById("edit-button").innerText = "Edit";
    document.getElementById("wait").style.display = "none";
  } else {
    document.getElementById("gtm-acc").innerHTML =
      "GTM ACCOUNTS > <b>" +
      sessionStorage.getItem("ACCOUNT") +
      " > " +
      sessionStorage.getItem("CONTAINER_NAME") +
      " > " +
      selectedComponent +
      "</b>";

    if (selectedComponent == "Tags") {
      document.getElementById("component-name").innerText =
        selectedComponent + " List";
      document.getElementById("edit-button").innerText = "Edit Selected Tags";

      tagList();
    } else if (selectedComponent == "Triggers") {
      document.getElementById("component-name").innerText =
        selectedComponent + " List";
      document.getElementById("edit-button").innerText =
        "Edit Selected Triggers";

      triggerList();
    } else if (selectedComponent == "Variables") {
      document.getElementById("component-name").innerText =
        selectedComponent + " List";
      document.getElementById("edit-button").innerText =
        "Edit Selected Variables";

      variableList();
    }
  }
}

function tagList() {
  var list = document.getElementById("component");
  list.innerHTML = "";
  CTR.tag.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        <input type="checkbox" class="check" id=${element.tagId}>
                        </input>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.tagId}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.type}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.name}
                      </div>
                    </td>
                  </tr>`;
    list.appendChild(tr);
    document.getElementById("wait").style.display = "none";
  });
}

function triggerList() {
  var list = document.getElementById("component");
  list.innerHTML = "";
  CTR.trigger.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        <input type="checkbox" class="check" id=${element.triggerId}>
                        </input>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.triggerId}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.type}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.name}
                      </div>
                    </td>
                  </tr>`;
    list.appendChild(tr);
    document.getElementById("wait").style.display = "none";
  });
}

function variableList() {
  var list = document.getElementById("component");
  list.innerHTML = "";
  CTR.variable.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        <input type="checkbox" class="check" id=${element.variableId}>
                        </input>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.variableId}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.type}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap">
                      <div class="text-sm leading-5 text-gray-900">
                        ${element.name}
                      </div>
                    </td>
                  </tr>`;
    list.appendChild(tr);
    document.getElementById("wait").style.display = "none";
  });
}

// Cart Arrays

Cart = [];

// Edit Functions
function edit() {
  var checkArray = document.getElementsByClassName("check");

  for (i in checkArray) {
    if (checkArray[i].checked == true) {
      Cart.push(checkArray[i].id);
    }
  }

  Cart = Cart.filter((v, i, a) => a.indexOf(v) === i);

  if (selectedComponent == "Tags") {
    editTags();
  } else if (selectedComponent == "Triggers") {
    editTriggers();
  } else if (selectedComponent == "Variables") {
    editVariables();
  }
}

function editTags() {
  var finalTags = [];

  CTR.tag.forEach((element) => {
    Cart.forEach((tag) => {
      if (tag == element.tagId) {
        finalTags.push(element);
      }
    });
  });
  console.log(finalTags);
  toggleModal();
}

function editTriggers() {
  var finalTriggers = [];

  CTR.trigger.forEach((element) => {
    Cart.forEach((trigger) => {
      if (trigger == element.triggerId) {
        finalTriggers.push(element);
      }
    });
  });
  console.log(finalTriggers);
  toggleModal();
}

function editVariables() {
  var finalVariables = [];

  CTR.variable.forEach((element) => {
    Cart.forEach((vars) => {
      if (vars == element.variableId) {
        finalVariables.push(element);
      }
    });
  });
  console.log(finalVariables);
  toggleModal();
}

function deleteSelected() {
  Cart.forEach(async (id) => {
    var path = (await sessionStorage.getItem("WPATH")) + "/tags/" + id;
    console.log(path);

    var request = await gapi.client.tagmanager.accounts.containers.workspaces.tags.delete(
      {
        path,
      }
    );
    return requestPromise(request).then(async (response) => {
      await console.log(response);
    });
  });

  toggleModal();
}

async function update() {
  var reqBody = EDITOR.get();

  Cart.forEach(async (id) => {
    await updateTag(reqBody, id);
  });
  toggleModal();
}

// Update a Tag
async function updateTag(reqBody, id) {
  path = sessionStorage.getItem("WPATH") + "/tags/" + id;
  console.log(reqBody);

  var tag = getTag(path);
  console.log(tag);

  // var request = gapi.client.tagmanager.accounts.containers.workspaces.tags.update(
  //   {
  //     path,
  //   },
  //   body
  // );
  // return requestPromise(request).then((response) => {
  //   console.log(response);
  // });
}

// function createHelloWorldTrigger() {
//   console.log("Creating hello world trigger in workspace");
//   path = sessionStorage.getItem("WPATH");
//   var helloWorldTrigger = { name: "Hello World Trigger", type: "PAGEVIEW" };
//   var request = gapi.client.tagmanager.accounts.containers.workspaces.triggers.create(
//     { parent: path },
//     helloWorldTrigger
//   );
//   return requestPromise(request).then((response) => {
//     console.log(response);
//   });
// }
