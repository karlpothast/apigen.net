
let userAuthCode;
let userSessionToken;
const lblUserAuthCode = document.getElementById("lblUserAuthCode");    
const lblMsg = document.getElementById("lblMsg"); 
let octokit;
const linuxApiBaseUrl = "http://localhost:8078";
let userObj;
const btnGithubSignIn = document.getElementById("btnGithubSignIn"); 
const btnGithubLogOut = document.getElementById("btnGithubLogOut");
const lblUserSessionCode = document.getElementById("lblUserSessionCode");
const lblLog = document.getElementById("lblLog");
const lblWelcome = document.getElementById("lblWelcome");
const lblSignIn = document.getElementById("lblSignIn");
const imgGithubSvg = document.getElementById("imgGithubSvg");
let user = {};
const welcomeText = document.getElementById("welcomeText");
let loggedIn = false;

window.addEventListener("load", (event) => {
  initialize();
});

const initialize = async () => {
  let loggedInUser = getCookie("loggedInUser_"+env);
  let loggedInUserArray;
  if (loggedInUser && loggedInUser.length > 0) {
    loggedIn = true;
    loggedInUserArray = loggedInUser.split("|");
    for (let i = 0; i < loggedInUserArray.length; i++) {
      let item = loggedInUserArray[i];
      let result;
      const index = item.indexOf(":");
      if (index !== -1) {
        result = item.substring(index + 1); 
      }
      if (item.includes("ghid")) {user.ghid = result}
      if (item.includes("email")) {user.email = result}
      if (item.includes("name")) {user.name = result}
      if (item.includes("login")) {user.login = result}
      if (item.includes("type")) {user.type = result}
      if (item.includes("gh_avatar_url")) {user.gh_avatar_url = result}
    }
  }
  if (user.ghid) {
    welcomeUser();
  }
  else
  {
    getUserSessionToken();
  }
}

btnGithubSignIn.addEventListener("click", (e) => {
  location.href="https://github.com/login/oauth/authorize?client_id=" + clientId;
});

function welcomeUser() {
  let displayName = "";
  spanSignIn.style.color = "cyan";
  btnGithubSignIn.style.boxShadow = "none";
  btnGithubSignIn.style.boxShadow = "none";
  btnGithubSignIn.classList.remove("ghbtn");
  btnGithubSignIn.classList.add("logged-in");
  btnGithubLogOut.classList.remove("display-none");
  btnGithubSignIn.classList.add("display-none");
  btnGithubSignIn.disabled = true;
  imgGithubSvg.src = "githubLoggedIn.svg";
  if (!user.name) {
    welcomeText.innerText = "Welcome " + user.login;
  }
  else {
    welcomeText.innerText = "Welcome " + user.name;
  }
}

async function getUserSessionToken() {
  if (!userSessionToken) {
      userAuthCode = getUrlParameter("code");
      if (userAuthCode) {
        let userAuthTokenJsonString = await getUserAuthToken(userAuthCode);
        let userAuthTokenJsonObj = JSON.parse(userAuthTokenJsonString);
        let userAuthToken = userAuthTokenJsonObj.user_auth_token;
        if (userAuthToken) {
          let ghuser = await getGithubUser(userAuthToken);
          let gh_avatar_url = "";
          if(ghuser.avatar_url) { gh_avatar_url = ghuser.avatar_url} 
          else {gh_avatar_url = ""};
          let gh_email = ghuser.email;
          if(ghuser.gh_email) { gh_email = ghuser.email} 
          else {gh_email = ""};
          let gh_name = ghuser.name;
          if(ghuser.gh_name) { gh_name = ghuser.name} 
          else {gh_name = ""}; 
          let gh_login = ghuser.login;
          let gh_id = ghuser.id;
          let gh_type = ghuser.type;
          let cookieValue = "ghid:" + gh_id + "|gh_type:" + gh_type + "|gh_email:" +  gh_email + "|gh_login:" + gh_login + "|gh_name:" + gh_name + "|gh_avatar_url:" + gh_avatar_url;
          setCookie("loggedInUser_"+env, cookieValue, 8);
          window.location.replace("/")
        }
        else {
          location.href="/?m=i"
        }
      }
  }
  else
  {
    console.log('user session token exists');
  }
}

async function getGithubUser(userSessionToken) {
  let response = await fetch('https://api.github.com/user', {
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${userSessionToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    },
    method: 'GET'
  });
    return await response.json();
}

async function getUserAuthToken(code) {
  return await LinuxCmdWithArgs("/home/kp/workspaces/devops/github/login_with_github/ghbutton/ghusertoken.sh", code);
}

async function LinuxCmdWithArgs(cmd, args) {
  try
  {
    const response = await fetch(linuxApiBaseUrl + "/runanycmdwithargs"
      + "?" + new URLSearchParams({
        cmd:cmd, 
        args:args
      })
    );

    const obj = await response.text();
    return obj;
  }
  catch (error) {
    console.error(error);
  }
}

function setMessage() {
  let msg = getUrlParameter("m");
  if (msg == "i") {
    lblMsg.style.color = "#D2042D";
    lblMsg.innerText = "Invalid or expired code.  Please re-authenticate to GitHub."
    setTimeout(() => {
      $("#lblMsg").animate({ opacity: 0.0 }, { duration: 1000 });
    }, 2000);
  
    setTimeout(() => {
      $("#lblMsg").text("");
    }, 3000);
  
    setTimeout(() => {
      $("#lblMsg").css('opacity', '1');
    }, 3100);
  }
  else {
    lblMsg.text = "blank";
    lblMsg.style.color = "darkblue";
  }
}
    
function log(msg) {
  lblLog.innerHTML += msg + "<br>";
}

function logout() {
  document.cookie = "loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); 
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

btnGithubLogOut.addEventListener("click", (e) => {
  logout();
  window.location.assign("/")
});


