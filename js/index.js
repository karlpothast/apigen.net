const $cont = document.querySelector(".cont");
const $elsArr = [].slice.call(document.querySelectorAll(".el"));
const $closeBtnsArr = [].slice.call(
  document.querySelectorAll(".el__close-btn")
);
const imgLogoMenu = document.getElementById("imgLogoMenu");
const divGlow = document.getElementById("divGlow");
const divDim = document.getElementById("divDim");
const navMenu = document.getElementById("navMenu");

const btnStep2 = document.getElementById("btnStep2");
let currentTab;
const sideBarNav = document.getElementById("sideBarNav");
const sideBarButton1 = document.getElementById("sideBarButton1");
const sideBarButton2 = document.getElementById("sideBarButton2");
const sideBarButton3 = document.getElementById("sideBarButton3");
const divInner = document.getElementById("divInner");
const popupLogin = document.getElementById("popupLogin");

//#region init
setTimeout(function () {
  $cont.classList.remove("s--inactive");
}, 200);
$elsArr.forEach(function ($el) {
  $el.addEventListener("click", function () {
    if (this.classList.contains("s--active")) return;
    if (this.id == "divAPIGen") {
      setTimeout(function () {
      }, 0);
    }
    $cont.classList.add("s--el-active");
    this.classList.add("s--active");
  });
});
$closeBtnsArr.forEach(function ($btn) {
  $btn.addEventListener("click", function (e) {
    e.stopPropagation();
    $cont.classList.remove("s--el-active");
    document.querySelector(".el.s--active").classList.remove("s--active");
  });
});

function setInnerModeOn() {
  setTimeout(() => {
    $('#sideBarNav').css({opacity: 0.0});
    // $('#btnNewAPI').css({opacity: 0.0});
  }, 1);

  setTimeout(() => {
    sideBarNav.style.display='block'; 
  }, 100);

  setTimeout(() => {
    $('#sideBarNav').animate({opacity: 1.0}, 1000);
  }, 1000);

  let apiRunningResp = "";
  let isApiRunning = null;
  testAPI("6").then(
    function(value) 
    { 
      apiRunningResp = JSON.parse(value);
      isApiRunning = apiRunningResp.CmdResponse;
      if (isApiRunning == "1")
      {
        setTimeout(() => {
          // $('#btnNewAPI').css({opacity: 0.0});
          // btnNewAPI.style.display='block';
          // $('#btnNewAPI').animate({opacity: 1.0}, 1000);
        }, 1000);
      }
    },
    function(error) { 
      console.log('Test API Error');
      console.log(error);
    }
  );
}

function setInnerModeOff() {
  sideBarNav.style.display='none'; 
  // btnNewAPI.style.display='none';
}

function initIndex() {
  currentTab = getCookie("tab");
  switch (currentTab) {
    case "sql":
      fadeAppIn(1,100);
      document.getElementById("sqlTabTitle").click();
      break;
    case "apigen":
      fadeAppIn(1000,100);
      document.getElementById("execAPIGenPreviewTab").click();
      break;
    case "viewapi":
      fadeAppIn(1,100);
      $(document).ready(function () {
        setTimeout(() => {
          document.getElementById("viewAPIPreviewTabTitle").click();
        }, 1000);
      });
      break;
    default:
      fadeAppIn(1,100);
      break;
  }

  var step1 = 400;
  var step2 = Number(step1 + 1000);
  var step3 = Number(step2 + 300);
  var step4 = Number(step3 + 200);
  var step5 = Number(step4 + 200);
  var step6 = Number(step5 + 200);
  var step7 = Number(step6 + 1000);

  setTimeout(() => {
    $("#lightning0")
      .css({ visibility: "visible" })
      .animate({ opacity: 1.0 }, { duration: 100 })
      .animate({ opacity: 0.0 }, { duration: 1400 });
  }, step1);
  setTimeout(() => {
    $("#lightning1")
      .css({ visibility: "visible" })
      .css({ opacity: 1.0 })
      .animate({ opacity: 0.0 }, { duration: 800 });
  }, step2);
  setTimeout(() => {
    $("#lightning2")
      .css({ visibility: "visible" })
      .css({ opacity: 1.0 })
      .animate({ opacity: 0.0 }, { duration: 1000 });
  }, step3);
  setTimeout(() => {
    $("#divGlow")
      .css({ visibility: "visible" })
      .animate({ opacity: 1.0 }, { duration: 1000 });
  }, step4);
  setTimeout(() => {
    $("#divGlow")
      .css({ opacity: 1.0 })
      .animate({ opacity: 0.0 }, { duration: 1000 });
  }, step5);
  setTimeout(() => {
    $("#imgLogoMenu").animate({ opacity: 1.0 }, { duration: 3000 });
  }, step6);
  setTimeout(() => {
    $("#lightning1").css({ visibility: "hidden" });
  }, 2500);
}

function checkUrl() {
  let url = window.location.href;
  let loopbackAddress = "127.0.0.1";
  if (url.includes(loopbackAddress)) {
    window.location.replace(
      url.replace(loopbackAddress,"localhost"),
    );
  }
}
//#endregion

//#region events
const homeBtn = document.getElementById("tdLogo");
homeBtn.addEventListener("mouseenter", logoFadeIn);
homeBtn.addEventListener("mouseleave", logoFadeOut);
homeBtn.addEventListener("click", navHome);
function logoFadeIn() {
  $("#divGlow").animate({ opacity: 0.6 });
}
function logoFadeOut() {
  $("#divGlow").animate({ opacity: 0.0 });
}
function navHome() {
  removeCookie("tab");
  location.href = "/";
}
const nav = document.querySelector(".nav-container");
if (nav) {
  const toggle = nav.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      if (nav.classList.contains("is-active")) {
        nav.classList.remove("is-active");
        navMenu.style.visibility = "hidden";
      } else {
        nav.classList.add("is-active");
        navMenu.style.visibility = "visible";
      }
    });
  }
}
const sqlPreviewTab = document.getElementById("sqlPreviewTab"); //sql open 1
const sqlTabTitle = document.getElementById("sqlTabTitle"); //sql open 2
const sqlTabCloseBtn = document.getElementById("sqlTabCloseBtn"); //sql close
sqlPreviewTab.addEventListener("click", () => {
  openSQLWindow();
});
sqlTabCloseBtn.addEventListener("click", () => {
  closeSQLWindow();
});

sideBarButton1.addEventListener("click", sideBarButton1Click);
function sideBarButton1Click() {
  openSQLFromInnerMode();
}
sideBarButton2.addEventListener("click", sideBarButton2Click);
function sideBarButton2Click() {
  openAPIGenFromInnerMode(false);
}
sideBarButton3.addEventListener("click", sideBarButton3Click);
function sideBarButton3Click() {
  openAPIViewFromInnerMode();
}
btnStep2.addEventListener("click", () => {  
  openAPIGenFromInnerMode(true);
});

function openSQLFromInnerMode(closePopUp) {
  setCookie("tab", "sql");
  setTimeout(() => {
    fadeToBlack();
  }, 1);
}
function openAPIGenFromInnerMode(closePopUp) {
  setCookie("tab", "apigen");
  if (closePopUp) { easeIn();}
  setTimeout(() => {
    fadeToBlack();
  }, 1);
}
function openAPIViewFromInnerMode(closePopUp) {
  setCookie("tab", "viewapi");
  setTimeout(() => {
    fadeToBlack();
  }, 1);
}

const execAPIGenPreviewTab = document.getElementById("execAPIGenPreviewTab"); //exec api open 1
const execAPIGenTabTitle = document.getElementById("execAPIGenTabTitle"); //exec api open 2
const execAPIGenCloseBtn = document.getElementById("execAPIGenCloseBtn"); //exec api close
execAPIGenPreviewTab.addEventListener("click", () => {
  openAPIGenWindow("execAPIGenPreviewTab");
});

execAPIGenCloseBtn.addEventListener("click", () => {
  closeAPIGenWindow();
});

const viewAPIPreviewTab = document.getElementById("viewAPIPreviewTab"); //new api open
const viewAPIPreviewTabTitle = document.getElementById(
  "viewAPIPreviewTabTitle"
); //new api open
const viewAPIPreviewCloseBtn = document.getElementById(
  "viewAPIPreviewCloseBtn"
); //new api close
viewAPIPreviewTab.addEventListener("click", () => {
  openViewAPIWindow();
});
viewAPIPreviewTabTitle.addEventListener("click", () => {
  openViewAPIWindow();
});
viewAPIPreviewCloseBtn.addEventListener("click", () => {
  closeViewAPIWindow();
});

$(document).on("mousedown", function (event) {
  let x = event.clientX;
  let y = event.clientY;
  let elements = document.elementsFromPoint(x, y);
  let hoveringOverInfoWindow = false;
  let divInfoVisibility = divInfo.style.visibility;

  let elementId = "";
  for (let i = 0; i < elements.length; i++) {
    elementId = elements[i].id.toString();
    if (elementId == "divInfo") {
      hoveringOverInfoWindow = true;
    }
  }
  if (divInfoVisibility == "visible" && hoveringOverInfoWindow == false) {
    closeModal();
  }
});

function closeModal() {
  //closeInfoWindow();
}
//#endregion

//#region methods
function openSQLWindow() {
  console.log("check loggedIn from index");
  console.log(loggedIn);
  if (loggedIn) {
    //divDim.style.visibility = "hidden";
    setInnerModeOn();
    setCookie("tab", "sql");
    $(document).ready(function () {
      setTimeout(() => {
        $("#winBg")
          .css({ visibility: "visible" })
          .animate({ opacity: 1.0 }, { duration: 1000 });
      }, 1);
      setTimeout(() => {
        btnInfoCircle.disabled = false;
        btnInfoCircle.style.opacity = "1.0";
        $("#btnInfoCircle")
          .css({ visibility: "visible" })
          .animate({ opacity: 1.0 }, { duration: 1000 });
      }, 1000);
      
    });
  }
  else {
    popupLoginMessageAndFade();
  }
}
function closeSQLWindow() {
  setInnerModeOff();
  removeCookie("tab");
  $(document).ready(function () {
    setTimeout(() => {
      $("#winBg")
        .animate({ opacity: 0.0 }, { duration: 500 })
        .css({ visibility: "hidden" });
    }, 1);
    setTimeout(() => {
      $("#btnInfoCircle").animate({ opacity: 0.0 }, { duration: 500 });
    }, 1);
    setTimeout(() => {
      $("#btnInfoCircle")
        .css({ visibility: "hidden" })
        .css({ border: "1 solid #ffffff" });
    }, 1);
  });
}
function openAPIGenWindow(from) {
  if (loggedIn) {
    setInnerModeOn();
    setCookie("tab", "apigen");
    $(document).ready(function () {
      loadCmdFromIndex("");

      setTimeout(() => {
        $("#btnInfoCircle")
          .css({ visibility: "visible" })
          .animate({ opacity: 0.4 }, { duration: 1000 });
          $("#btnInfoCircle").prop("disabled", true);
      }, 1000);

      }, 1);
  }
  else {
    popupLoginMessageAndFade();
  }
}
function closeAPIGenWindow() {
  //setInnerModeOff();
  //hideCmdFromIndex();
  removeCookie("tab");

  setTimeout(() => {
   fadeToBlack();
  }, 800);

}
function openViewAPIWindow() {
  if (loggedIn) {
    setInnerModeOn();
    setCookie("tab", "viewapi");
    $(document).ready(function () {
      loadCmdFromIndex("");

        setTimeout(() => {
          $("#btnInfoCircle")
            .css({ visibility: "visible" })
            .animate({ opacity: 1.0 }, { duration: 1000 });
        }, 1000);

      }, 1);
  }
  else 
  {
    popupLoginMessageAndFade();
  }
}

function closeViewAPIWindow() {
  //setInnerModeOff();
  removeCookie("tab");

  setTimeout(() => {
   fadeToBlack();
  }, 800);

}
function dim() {
  setTimeout(() => {
    $("#divDim").css({ visibility: "visible" });
  }, 0);
  setTimeout(() => {
    $("#divDim").css({ opacity: 1.0 });
  }, 0);
}
function undim() {
  setTimeout(() => {
    $("#divDim").animate({ opacity: 0 }, { duration: 1500 });
  }, 0);
  setTimeout(() => {
    $("#divDim").css({ visibility: "hidden" });
  }, 3000);
}
function setCookie(name, value) {
  document.cookie = name + "=" + value + ";secure";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function removeCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
//#endregion

window.onload = (event) => {
  //log("index.js load event")
  if (loggedIn) {
    divDim.style.visibility = "hidden";
    //console.log('logged in');
  }
  else
  {
    //console.log('not logged in');
  }
  initIndex();
  checkUrl();
};

function fadeToBlack() {

  setTimeout(() => {
    $('#btnInfoCircle').animate({opacity: 0.0}, 500);
    $('#app').animate({opacity: 0.0}, 500);
  }, 100);

  setTimeout(() => {
     location.href="";
  }, 200);
}

function fadeAppIn(timeoutVal, durationVal) {
  
  setTimeout(() => {
    $('#app').animate({opacity: 1.0}, durationVal);
  }, timeoutVal);

}


window.addEventListener("unhandledrejection", function (evt) {
  console.log("Promise exception");
  console.log(evt);
});


function popupLoginMessageAndFade() {
  setTimeout(() => {
    $("#divDim")
      .css({ visibility: "visible" })
      .animate({ opacity: 0.7 }, { duration: 1000 })
    }, 1000);

    setTimeout(() => {
    $("#popupLogin")
      .css({ display: "block" })
      .animate({ opacity: 1.0 }, { duration: 1000 })
  }, 1000);

}

let popupLoginClicked = false;
document.addEventListener('click', function(event) {
  //console.log('anywhere clicked');
  if (!popupLoginClicked) {
    if (divDim.style.visibility == "visible") {
      let divDimOpacity = Number(divDim.style.opacity);
      if (divDimOpacity > 0.5) {
  
        setTimeout(() => {
          $("#divDim")
            .animate({ opacity: 0.0 }, { duration: 1000 })
          }, 1000);

          setTimeout(() => {
              divDim.style.visibility = "hidden";
          }, 1001);

          removeCookie("tab");
          window.location.assign("/");

      }
    }

  }
  
});


popupLogin.addEventListener("click", (e) => {
  popupLoginClicked = true;
  divDim.style.visibility = "hidden";
  window.location.assign("/signin");
});


