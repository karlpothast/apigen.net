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
let innerMode = false;

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

function setInnerModeOnDemo() {

  innerMode=true;
  setTimeout(() => {
    $('#sideBarNav').css({opacity: 0.0});
  }, 1);

  setTimeout(() => {
    sideBarNav.style.display='block'; 
  }, 100);

  setTimeout(() => {
    $('#sideBarNav').animate({opacity: 1.0}, 1000);
  }, 1000);

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
  location.href = "/demo/index.html";
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
  openSQLWindowDemo();
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

function setDefaultPositions()
{
  $(document).ready(function () {
    setTimeout(() => {

      var currentTextInputId = "input" + lblRowCount.innerText;
      var textInput = document.getElementById(currentTextInputId);

      var closeBtnAdjPx = -65;
      var closeBtnAdjVw = pixelToVWval(closeBtnAdjPx);
      var closeBtnMarginRightText = closeBtnAdjVw + "vw";
      $("#execAPIGenCloseBtn").css({"margin-right" : closeBtnMarginRightText});
      $("#execAPIGenTabTitle").css({"margin-right" : closeBtnMarginRightText});
      
  

    }, 100);
  });
}

const viewAPIPreviewTab = document.getElementById("viewAPIPreviewTab"); //new api open
const viewAPIPreviewTabTitle = document.getElementById(
  "viewAPIPreviewTabTitle"
); //new api open
const viewAPIPreviewCloseBtn = document.getElementById(
  "viewAPIPreviewCloseBtn"
); //new api close
viewAPIPreviewTab.addEventListener("click", () => {
  //openViewAPIWindow();
});
viewAPIPreviewTabTitle.addEventListener("click", () => {
  //openViewAPIWindow();
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

function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
function dropV(ev) {
  ev.preventDefault();
  var topDiv = document.getElementById("topDiv");
  var topDivPos = getElementPosition(topDiv);
  var bottomDiv = document.getElementById("bottomDiv");
  var boxHeight = topDivPos.height;
  var boxHeight = 399;
  var verticalDividerMidPoint = verticalDividerY - boxHeight / 2;
  var droppedYPosition = ev.clientY;
  //var diff = (verticalDividerMidPoint - droppedYPosition).toFixed(1);
  var pixelDistance = (droppedYPosition - verticalDividerY).toFixed(1);
  var upDown = "";
  if (pixelDistance > 0) {
    upDown = "down";
  } else {
    upDown = "up";
  }

  var pixelDistancePct = 100 * (pixelDistance / boxHeight);
  var changePct = pixelDistancePct;

  var topBoxNewHeightPct = 0.0;
  var bottomBoxNewHeightPct = 0.0;
  var resultDivsNewHeight = 0;
  if (droppedYPosition > verticalDividerMidPoint) {
    topBoxNewHeightPct = 49.5 + Number(changePct);
    bottomBoxNewHeightPct = 49.5 - Number(changePct);
    resultDivsNewHeight = Number(265 - Number(pixelDistance));
  } else if (droppedYPosition < verticalDividerMidPoint) {
    topBoxNewHeightPct = 49.5 - Number(changePct);
    bottomBoxNewHeightPct = 49.5 + Number(changePct);
    resultDivsNewHeight = Number(265 + Number(pixelDistance));
  }

  topDiv.style.height = topBoxNewHeightPct + "%";
  bottomDiv.style.height = bottomBoxNewHeightPct + "%";
  var sqlResultsDiv = document.getElementById("sqlResultsDiv");
  var jsonResultsDiv = document.getElementById("jsonResultsDiv");
  var tableDiv = document.getElementById("tableDiv");
  var jsonDiv = document.getElementById("jsonDiv");

  sqlResultsDiv.style.height = resultDivsNewHeight + "px";
  jsonResultsDiv.style.height = resultDivsNewHeight + "px";
  tableDiv.style.height = resultDivsNewHeight + "px";
  jsonDiv.style.height = resultDivsNewHeight + "px";
f=
  queryWindow.style.height = "96%";
}
function closeModal() {
  //closeInfoWindow();
}
//#endregion

//#region methods
function openSQLWindowDemo() {
  //setInnerModeOnDemo();
  //setCookie("tab", "sql");
  $(document).ready(function () {
    setTimeout(() => {
      $("#winBg")
        .css({ visibility: "visible" })
        .animate({ opacity: 1.0 }, { duration: 1000 });
    }, 1);
    setTimeout(() => {
      $("#btnInfoCircle").css({ visibility: "visible" }).animate({ opacity: 1.0 }, { duration: 1000 });
      $("#btnInfoCircle").prop("disabled", true);
    }, 1000);
  });
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
  //setInnerModeOnDemo();
  //setCookie("tab", "apigen");
  $(document).ready(function () {
    innerMode = true;
    loadCmdDemo();

    setTimeout(() => {
      $("#btnInfoCircle")
        .css({ visibility: "visible" })
        .animate({ opacity: 0.4 }, { duration: 1000 });
        $("#btnInfoCircle").prop("disabled", true);
    }, 1000);

    }, 1);
}
function closeAPIGenWindow() {
  innerMode = false;
  //console.log('innermode :' + innerMode);
  clearCmdHistory();
  setInnerModeOff();
 
  //hideCmdFromIndex();
  removeCookie("tab");
  fadeToBlack();
}

function openViewAPIWindow() {
  setInnerModeOn();
  setCookie("tab", "viewapi");
   $(document).ready(function () {
    loadCmdDemo();

      setTimeout(() => {
        $("#btnInfoCircle")
          .css({ visibility: "visible" })
          .animate({ opacity: 1.0 }, { duration: 1000 });
      }, 1000);

    }, 1);
}

function loadCmdDemo(){

    clearCmdHistory();
    lblRowCount.innerText = "0";
    addTerminalRow(true, false, "i ›");
    var currentTextInputId = "input" + lblRowCount.innerText;
    var textInput = document.getElementById(currentTextInputId);
    getWindowZoomPct();
    setDefaultPositions();
    setTimeout(() => {
      //showBlinker2();
      $("#termShimImg").animate({ left: "980px" }, 200);
    }, 2500);

}
function getWindowZoomPct() {
  let zoom = ((window.outerWidth - 10) / window.innerWidth) * 100;
  return zoom;
}

function clearCmdHistory() {
  sessionStorage.clear();
  cmdHistoryPosition = 0;
  cmdCnt = 0;
}

function addTerminalRow(includePrompt, lineBreakBeforePrompt) {

  let rowCount = lblRowCount.innerText;
  let newRowId = Number(rowCount) + 1;

  if (includePrompt) {
    if (lineBreakBeforePrompt) {
      var br = document.createElement("br");
      terminalWindow.appendChild(br);
    }
    var label = document.createElement("label");
    label.setAttribute("for", "input" + newRowId.toString());
    label.setAttribute("id", "lblPrompt");
    label.innerText = ">:";
    label.className = "terminal-prompt";
    terminalWindow.appendChild(label);
  }

  var inputId = "input" + newRowId.toString();
  var input = document.createElement("input");
  input.id = inputId;
  input.type = "text";
  input.maxLength = 80;
  input.className = "terminal-input";
  terminalWindow.appendChild(input);
  var newElement = document.getElementById(inputId);
  lblRowCount.innerText = newRowId;
  
  var newInputElement = document.getElementById(inputId);
  inputFocus(newInputElement);

  return newRowId;
}

function inputFocus(element) {
  if (innerMode){
    element.focus();
  }
}

if (terminalWindow) {
  terminalWindow.addEventListener("keydown", (e) => {
    var ctrl = e.ctrlKey ? e.ctrlKey : ((e.keyCode === 17) 
    ? true : false); 

    if (e.keyCode === 13) {
      processCommand(e);
    }
    if (e.keyCode === 8) {
      var $target = $(e.target || e.srcElement);
      if (e.keyCode == 8 && $target.is("input")) {
        e.preventDefault();
        handleBackspace(e);
      }
    }
    if (e.keyCode === 38) {
      var currentHistoryCmd = cmdCnt - cmdHistoryPosition;

      let cmdHistoryText;
      if (currentHistoryCmd != "0") {
        cmdHistoryText = sessionStorage.getItem("command" + currentHistoryCmd);
        var currentTextInputId = "input" + lblRowCount.innerText;
        $("#" + currentTextInputId).val(cmdHistoryText);
        lastInputValueProgrammaticallySet = true;
        //adjustCursor(1);
      } else {
      }
      if (cmdCnt > cmdHistoryPosition) {
        incrementCmdHistoryPosition(1);
      }
      lastInputValueProgrammaticallySet = true;
    }
    if (e.keyCode === 40) {
      if (cmdCnt > 0 && cmdCnt == cmdHistoryPosition) {
        setCmdHistoryPosition(cmdCnt - 1);
      }
      if (cmdHistoryPosition > 0) {
        console.log("decrement history by 1 ");
        decrementCmdHistoryPosition(1);
        //console.log('currentHistoryCmd value is now : ' +  currentHistoryCmd);
        var currentHistoryCmd = cmdCnt - cmdHistoryPosition;
        console.log(
          "cmdCnt - cmdHistoryPosition = show currentHistoryCmd (" +
            currentHistoryCmd +
            ")"
        );
        let cmdHistoryText;
        cmdHistoryText = sessionStorage.getItem("command" + currentHistoryCmd);
        var currentTextInputId = "input" + lblRowCount.innerText;

        $("#" + currentTextInputId).val(cmdHistoryText);
        lastInputValueProgrammaticallySet = true;
      } else if (cmdHistoryPosition == 0) {
        var currentTextInputId = "input" + lblRowCount.innerText;

        $("#" + currentTextInputId).val("");
      } else {
      }
    }
    if (e.keyCode == 67 && ctrl) { 
      processCommand(e, true);
    } 
    else
    {

    }
  });
}

function handleBackspace(evt) {
  var currentTextInputId = "input" + lblRowCount.innerText;
  var textInput = document.getElementById(currentTextInputId);
  var textInputLength = textInput.value.length;
  textInput.value = textInput.value.substring(0, textInputLength - 1);
}

function processCommand(e, ctrl) {
  //get active command text
  let command = e.srcElement.value;
  let commandId = e.srcElement.id;
  let rowCount = lblRowCount.innerText;
  let commandArg;
  
  let commandText = e.srcElement.value;
  if (commandText.toUpperCase().includes("ECHO"))
  {
    command = "echo";
    commandArg = commandText.replace("echo ","");
  }


    if (command.trim() != "") {
      var currentHistoryCmd = cmdCnt - cmdHistoryPosition;
      let cmdHistoryText = sessionStorage.getItem("command" + currentHistoryCmd);
  
      if (cmdHistoryText != command.trim()) {
        incrementCmdCnt(); //sets cmdCnt
        setCmdHistoryPosition(0);
        sessionStorage.setItem("command" + cmdCnt, command.trim());
      } else {
      }
  
      switch (command) {
        case "apigen":
          // apigenMode = true;
          // var cr = "<br/>";
          // var indent = "&nbsp;";
          // var apigenSplashMsg = `APIGen  ${cr}
          // Please enter the SQL connection string ${cr}
          // ex: ${cr}
          // ${indent} Server=sqlserver;Database=Northwind;User Id=sa;Password=p@ssword1;TrustServerCertificate=True
          // `;
          // addCommandOutputMultiLine(true, apigenSplashMsg);
          // addAPIGenRow(true, true, "default command");  
          break;
        case "clear":
          terminalWindow.innerHTML = '<img id="termShimImg" src="/assets/images/shimblur.png"/>';
          addTerminalRow(true, false, "clear command");
          break;
        case "pwd":
          addCommandOutputRowHTML(true, "<span style=\"color:blue\">/</span>");
          addTerminalRow(true, true, "ls command");
          break;
        case "ls":
          addCommandOutputRowHTML(true, "<span style=\"color:blue\">bin</span>");
          addTerminalRow(true, true, "ls command");
          break;
        case "ls -a":
          addCommandOutputRowHTML(true, "<span style=\"color:white\">. .. </span> <span style=\"color:blue\">bin</span> <span style=\"color:white\">.profile</span>");
          addTerminalRow(true, true, "ls command");
          break;
        case "echo":
          addCommandOutputRowHTML(true, "<span style=\"color:blue\">"+ commandArg +"</span>");
          addTerminalRow(true, true, "default command");
          break;
        case "exit":
          addCommandOutputRow(true, "");
          addTerminalRow(true, true, "default command");
          break;
        default:
          if (command.includes("cd ")) {
            addCommandOutputRow(true, "cd: permission denied");
            addTerminalRow(true, true, "default command");
            break;
          }
          else
          {
            addCommandOutputRow(true, "command not found: " + e.srcElement.value);
            addTerminalRow(true, true, "default command");
            break;
          }
      }

    }
    else
    {
        addTerminalRow(true, true, "default command");
    }
}

//#region dragAndDrop
$(".termDropArea").mouseout(function(e){

  if (e.clientY < 75)
  {
    $('#divContainer').draggable( 'option', 'revert', true ).trigger( 'mouseup' );
    $('#divContainer').draggable( 'option', 'revert', false ).trigger( 'mouseup' );
  }

  if (e.clientY > 730)
  {
    $('#divContainer').draggable( 'option', 'revert', true ).trigger( 'mouseup' );
    $('#divContainer').draggable( 'option', 'revert', false ).trigger( 'mouseup' );
  }

  if (e.clientX < 100)
  {
    $('#divContainer').draggable( 'option', 'revert', true ).trigger( 'mouseup' );
    $('#divContainer').draggable( 'option', 'revert', false ).trigger( 'mouseup' );
  }

  if (e.clientX > 1400)
  {
    $('#divContainer').draggable( 'option', 'revert', true ).trigger( 'mouseup' );
    $('#divContainer').draggable( 'option', 'revert', false ).trigger( 'mouseup' );
  }

});
//$(function () {
//  $("#divContainer").draggable();
  //hideBlinker2();
//});
//$(".termDropArea").droppable();
//$(".termDropArea").droppable({
//  drop: function (e) {
    //adjustCursor(2);
//  },
//});
//#endregion 

//#region commandHistory
function clearCmdHistory() {
  // terminalWindow.innerHTML = '<img id="termShimImg" src="/assets/images/shimblur.png"/>';
  // addTerminalRow(true, false, "clear command");
  sessionStorage.clear();
  cmdHistoryPosition = 0;
  cmdCnt = 0;
}
function setCmdHistoryPosition(num) {
  cmdHistoryPosition = num;
  return cmdHistoryPosition;
}
function incrementCmdHistoryPosition(num) {
  cmdHistoryPosition += num;
  //console.log('incrementing history level to : ' + cmdHistoryPosition);
  return cmdHistoryPosition;
}
function decrementCmdHistoryPosition(num) {
  cmdHistoryPosition -= num;
  //console.log('decrementing history level to : ' + cmdHistoryPosition);
  return cmdHistoryPosition;
}
function incrementCmdCnt() {
  cmdCnt += 1;
  return cmdCnt;
}
function addCommandOutputRow(lineBreakBeforePrompt, outputString) {
  var terminalWindow = document.getElementById("terminalWindow");
  let rowCount = lblRowCount.innerText;
  let newRowId = Number(rowCount) + 1;

  if (lineBreakBeforePrompt) {
    var br = document.createElement("br");
    terminalWindow.appendChild(br);
  }

  var inputId = "input" + newRowId.toString();
  var input = document.createElement("input");
  input.id = inputId;
  input.type = "text";
  input.maxLength = 80;
  input.className = "terminal-output";
  input.value = outputString;
  terminalWindow.appendChild(input);
  lblRowCount.innerText = newRowId;

  var newInputElement = document.getElementById(inputId);
  inputFocus(newInputElement);
  return newRowId;
}
function addCommandOutputRowHTML(lineBreakBeforePrompt, outputString) {
  var terminalWindow = document.getElementById("terminalWindow");
  let rowCount = lblRowCount.innerText;
  let newRowId = Number(rowCount) + 1;

  if (lineBreakBeforePrompt) {
    var br = document.createElement("br");
    terminalWindow.appendChild(br);
  }

  var inputId = "input" + newRowId.toString();
  var input = document.createElement("span");
  input.id = inputId;
  input.type = "text";
  input.maxLength = 80;
  input.className = "terminal-output";
  input.innerHTML = outputString;
  terminalWindow.appendChild(input);
  lblRowCount.innerText = newRowId;

  var newInputElement = document.getElementById(inputId);
  inputFocus(newInputElement);
  return newRowId;
}
function addCommandOutputMultiLine(lineBreakBeforePrompt, outputString) {
  var terminalWindow = document.getElementById("terminalWindow");
  let rowCount = lblRowCount.innerText;
  let newRowId = Number(rowCount) + 1;

  if (lineBreakBeforePrompt) {
    var br = document.createElement("br");
    terminalWindow.appendChild(br);
  }

  var spanOutputText = document.createElement("span");
  spanOutputText.innerHTML = outputString;
  spanOutputText.className = "terminal-output";
  terminalWindow.appendChild(spanOutputText);

  return newRowId;
}
//#endregion

function closeViewAPIWindow() {
  setInnerModeOff();
  removeCookie("tab");
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
  //document.cookie = name + "=" + value + ";secure";
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
  initIndex();
  setTimeout(() => {$('#divDim').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#divDim').css({opacity: 0.7})}, 0);
  setTimeout(() => {$('#app').addClass("blurred"); }, 0);

};

function fadeToBlack() {

  setTimeout(() => {
    $('#btnInfoCircle').animate({opacity: 0.0}, 500);
    $('#app').animate({opacity: 0.0}, 1000);
  }, 100);

  setTimeout(() => {
     //window.reload();
     location.href="";
  }, 1500);
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









//#region calc_PX_to_VH_VW
function pixelToVH(value) {
  return `${((100 * value) / window.innerHeight).toFixed(2)}vh`;
}
function pixelToVW(value) {
  return `${((100 * value) / window.innerWidth).toFixed(2)}vw`;
}
function vhToPixel(value) {
  return `${((window.innerHeight * value) / 100).toFixed(2)}px`;
}
function vwToPixel(value) {
  return `${((window.innerWidth * value) / 100).toFixed(2)}px`;
}
function pixelToVHval(value) {
  return `${((100 * value) / window.innerHeight).toFixed(2)}`;
}
function pixelToVWval(value) {
  return `${((100 * value) / window.innerWidth).toFixed(2)}`;
}
//#endregion
