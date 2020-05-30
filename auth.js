var CLIENT_ID =
  "772259605237-f6s3padrs11qhnkl4sbcjr8mcb37dvsb.apps.googleusercontent.com";
var SCOPES = [
  "https://www.googleapis.com/auth/tagmanager.manage.accounts",
  "https://www.googleapis.com/auth/tagmanager.edit.containers",
  "https://www.googleapis.com/auth/tagmanager.delete.containers",
  "https://www.googleapis.com/auth/tagmanager.edit.containerversions",
  "https://www.googleapis.com/auth/tagmanager.manage.users",
  "https://www.googleapis.com/auth/tagmanager.publish",
  "profile email",
];

// Parameter values used by the script
ACCOUNTS = [];
AUTH = {};
SUCCESS = false;

function callAuth() {
  checkAuth(true);
}

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
    .then(runTagManager)
    .catch(() => {
      console.log("You must authorize any access to the api.");
    });
}

function handleAuthResult(authResult) {
  return new Promise((resolve, reject) => {
    AUTH = authResult;
    if (authResult && !authResult.error) {
      resolve();
    } else {
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

function runTagManager() {
  return new Promise((resolve, reject) => {
    console.log("Running Tag Manager.");
    SUCCESS = true;
    var trigger = null;
    var workspace = null;
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
