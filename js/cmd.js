const termHeader = document.getElementById("termHeader");
const terminalWindow = document.getElementById("terminalWindow");
const termBackground = document.getElementById("termBackground");
const termShimImg = document.getElementById("termShimImg");
const divContainer = document.getElementById("divContainer");
const termHeaderText = document.getElementById("termHeaderText");
const lblRowCountDisplay = document.getElementById("lblRowCountDisplay");
const lblCurrentInputIdDisplay = document.getElementById("lblCurrentInputIdDisplay");
const lblCursorPositionDisplay = document.getElementById("lblCursorPositionDisplay");
const lblCurrentCommandText = document.getElementById("lblCurrentCommandText");
const lblSingleCharWidth = document.getElementById("lblSingleCharWidth");
const blinker2 = document.getElementById("blinker2");
const debug_apigen = false;

let msg;
let outputPath;
let zipFilePath;
let apigenMode = false;
let YChange = 0;
let XChange = 0;
let cmdHistoryPosition = 0;
let cmdCnt = 0;
let terminalIsFocused = false;
let lastInputValueProgrammaticallySet = false;
let lastCommandText = "";

//#region events
window.addEventListener("resize", windowResized);
function windowResized(getPos) {
  adjustCursor(4);
}
function getWindowZoomPct() {
  let zoom = ((window.outerWidth - 10) / window.innerWidth) * 100;
  return zoom;
}
document.onclick = clickAnywhere;
function clickAnywhere(evt) {
  let activeElement = document.activeElement;
  let srcElement = evt.srcElement;
  if (evt.srcElement.id == "terminalWindow" ||
    evt.srcElement.id == "blinker2" ||
    evt.srcElement.id == "lblPrompt" ||
    evt.srcElement.id.includes("input"))  {
      if (activeElement.id != "terminalWindow" &&
        evt.srcElement.id != "blinker2" &&
        evt.srcElement.id != "lblPrompt" &&
        !activeElement.id.includes("input")) { 
        }
  } 
  else {
    if (evt.srcElement.id != "terminalWindow" &&
        evt.srcElement.id != "blinker2" &&
        evt.srcElement.id != "lblPrompt" &&
        evt.srcElement.id.includes("input")) {
        unfocusCurrentTerminalInput()
    }
    else {
      unfocusCurrentTerminalInput();
      if (srcElement.id != "execAPIGenTabTitle"){
        hideBlinker2();
      }
    }
  }
}

function terminalPaste(elementId) {}
window.addEventListener("paste", (e) => {
  handlePaste(e);
});
function handlePaste(e) {
  var clipboardData, pastedData;
  // Stop data actually being pasted into div
  e.stopPropagation();
  e.preventDefault();
  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData("Text");
  lastCommandText = pastedData;
  var pastedDataLength = pastedData.trim().length;
  let str_1_80;
  let str_81_160;
  let str_161_240;
  let pastedRowId1;
  let pastedRowId2;
  let pastedRowId3;
  switch (true) {
    case pastedDataLength <= 80:
      pastedRowId1 = lblRowCount.innerText;
      setRowText(pastedRowId1, pastedData);
      break;
    case pastedDataLength > 80 && pastedDataLength <= 160:
      pastedRowId1 = lblRowCount.innerText;
      setRowText(pastedRowId1, pastedData.substring(0, 80));
      pastedRowId2 = addTerminalRow(false, true, "paste");
      setRowText(pastedRowId2, pastedData.substring(80, pastedDataLength));
      break;
    case pastedDataLength >= 160:
      var maxLength = 240;
      if (pastedDataLength > maxLength) {
        pastedDataLength = maxLength;
      }
      pastedRowId1 = lblRowCount.innerText;
      setRowText(pastedRowId1, pastedData.substring(0, 80));
      pastedRowId2 = addTerminalRow(false, true, "paste row 2");
      setRowText(pastedRowId2, pastedData.substring(81, 160));
      pastedRowId3 = addTerminalRow(false, true, "paste row 3");
      setRowText(pastedRowId3, pastedData.substring(161, pastedDataLength));
    default:
      break;
  }
}
//#endregion

//#region terminalWindowKeyPress
if (terminalWindow) {
  terminalWindow.addEventListener("keydown", (e) => {
    var ctrl = e.ctrlKey ? e.ctrlKey : ((e.keyCode === 17) 
    ? true : false); 

    //log("terminal key pressed " +  e.keyCode);
    if (e.keyCode === 13) {
      processCommand(e);
      //log("adjust cursor key13");
      adjustCursor(1);
    }
    if (e.keyCode === 8) {
      var $target = $(e.target || e.srcElement);
      if (e.keyCode == 8 && $target.is("input")) {
        //alert("input ")
        e.preventDefault();
        handleBackspace(e);
        //log("adjust cursor key 8");
        adjustCursor(1);
      }
    }
    if (e.keyCode === 38) {
      // console.log("-----up arrow hit -------");
      // console.log("cmdCnt :" + cmdCnt);
      // console.log("cmdHistoryPosition :" + cmdHistoryPosition);
      var currentHistoryCmd = cmdCnt - cmdHistoryPosition;
      // console.log(
      //   "cmdCnt - cmdHistoryPosition = show currentHistoryCmd (" +
      //     currentHistoryCmd +
      //     ")"
      // );

      let cmdHistoryText;
      if (currentHistoryCmd != "0") {
        cmdHistoryText = sessionStorage.getItem("command" + currentHistoryCmd);
        var currentTextInputId = "input" + lblRowCount.innerText;
        $("#" + currentTextInputId).val(cmdHistoryText);
        lastInputValueProgrammaticallySet = true;
        //log("adjust cursor up key");
        adjustCursor(1);
      } else {
        //console.log("at command history limit");
      }
      if (cmdCnt > cmdHistoryPosition) {
        // console.log(
        //   "cmdCnt " +
        //     cmdCnt +
        //     " > cmdHistoryPosition " +
        //     cmdHistoryPosition +
        //     "; so increment by 1"
        // );
        incrementCmdHistoryPosition(1);
        //console.log("cmdHistoryPosition is now : " + cmdHistoryPosition);
      }
      lastInputValueProgrammaticallySet = true;
    }
    if (e.keyCode === 40) {
      console.log("-----down arrow hit----");
      console.log("cmdCnt :" + cmdCnt);
      console.log("cmdHistoryPosition :" + cmdHistoryPosition);
      if (cmdCnt > 0 && cmdCnt == cmdHistoryPosition) {
        //at max up count so make cmdHistoryPosition cmdCnt - 1
        console.log("at max up count so make cmdHistoryPosition cmdCnt - 1");
        setCmdHistoryPosition(cmdCnt - 1);
        console.log("cmdHistoryPosition now :" + cmdHistoryPosition);
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
        //log("adjust cursor key down arrow");
        adjustCursor(1);
      } else if (cmdHistoryPosition == 0) {
        var currentTextInputId = "input" + lblRowCount.innerText;

        $("#" + currentTextInputId).val("");
        //log("adjust cursor down arrow 2");
        adjustCursor(1);
      } else {
        // console.log(
        //   "at command negative history limit - current history cmd is " +
        //     currentHistoryCmd
        // );
      }
    }
    if (e.keyCode == 67 && ctrl) { 
      //console.log("Ctrl+C is pressed."); 
      processCommand(e, true);
    } 
    else
    {
      adjustCursor(1);
    }
  });
}

function handleBackspace(evt) {
  var currentTextInputId = "input" + lblRowCount.innerText;
  var textInput = document.getElementById(currentTextInputId);
  var textInputLength = textInput.value.length;
  //if (lastInputValueProgrammaticallySet == true)
  //{
  // console.log('textInputLength :' + textInputLength);
  // console.log('textInput.value :' + textInput.value);
  // console.log('new value :' + textInput.value.substring(0, textInputLength - 1));
  textInput.value = textInput.value.substring(0, textInputLength - 1);
  //lastInputValueProgrammaticallySet = false;


  // }
}
//#endregion

//#region load

function loadCmdFromIndex(from) {
    clearCmdHistory();
    lblRowCount.innerText = "0";
    addTerminalRow(true, false, "i ›");
    var currentTextInputId = "input" + lblRowCount.innerText;
    var textInput = document.getElementById(currentTextInputId);
    getWindowZoomPct();
    adjustTerminal();
    setDefaultPositions();
    setTimeout(() => {
      //showBlinker2();
      $("#termShimImg").animate({ left: "980px" }, 200);
    }, 2500);

    let apiRunningResp = "";
    let isApiRunning = null;
    testAPI("6").then(
      function(value) 
      { 
        apiRunningResp = JSON.parse(value);
        isApiRunning = apiRunningResp.CmdResponse;

        if (isApiRunning == "1")
        {
          let apiNameResp = "";
          let apiName = null;
          testAPI("8").then(
            function(value) 
            { 
           
              var firstTextInputId = "input1";
              var textInput = document.getElementById(firstTextInputId);
              textInput.style.display = "none";
              var firstPromptId = "lblPrompt";
              var firstPromptLabel = document.getElementById(firstPromptId);
              firstPromptLabel.style.display = "none";

              apiNameResp = JSON.parse(value);
              apiName = apiNameResp.CmdResponse;
        
              addCommandOutputMultiLine(true, "\"" + apiName + "\"" + " has been created, built and started.");
              addCommandOutputMultiLine(true, "To download, view or test the API, navigate to the <strong>View API </strong>section.");
            
              apigenMode = false;
              addTerminalRow(true, true)

            },
            function(error) { 
              console.log('Get API Name Error');
              console.log(error);
            });
        }
        else
        {
          typeCommand(1500,"apigen");
        }
      },
      function(error) { 
        console.log('Get API Name Error');
        console.log(error);
      });
};
function typeCommand(timeoutStart, str) {
  var currentTextInputId = "input" + lblRowCount.innerText;
  var textInput = document.getElementById(currentTextInputId);
  textInput.disabled = true;
    for (let i = 0; i < str.length; i++) {
      timeoutStart += 100;
      setTimeout(() => {
        textInput.value += str[i];
      }, timeoutStart);
    };

    setTimeout(() => {
      apigenMode = true;
      var cr = "<br/>";
      var indent = "&nbsp;";
      var apigenSplashMsg = `APIGen  ${cr}
      Please enter the SQL connection string. (paste with ctrl-v) ${cr}
      ex: ${cr}
      ${indent} "Server=sqlserver;Database=Northwind;User Id=sa;Password=p@ssword1;TrustServerCertificate=True"
      `;
      addCommandOutputMultiLine(true, apigenSplashMsg);
      addAPIGenRow(true, true, "default command");        
    }, timeoutStart + 500);

}

function typeCompleteCommand(timeoutStart, apiName) {
  console.log(apiName);
  var str = "apigen";
  var currentTextInputId = "input" + lblRowCount.innerText;
  var textInput = document.getElementById(currentTextInputId);
  textInput.disabled = true;

    for (let i = 0; i < str.length; i++) {
      timeoutStart += 100;
      setTimeout(() => {
        textInput.value += str[i];
      }, timeoutStart);
    };

    setTimeout(() => {
      apigenMode = true;
      var cr = "<br/>";
      var indent = "&nbsp;";
      var apigenSplashMsg = `APIGen  ${cr}
      ${apiName} has been created.
      `;
      addCommandOutputMultiLine(true, apigenSplashMsg);
      apigenMode = false;
      addTerminalRow(true, true);      
    }, timeoutStart + 500);

}
function setDefaultPositions()
{
  $(document).ready(function () {
    setTimeout(() => {

      var currentTextInputId = "input" + lblRowCount.innerText;
      var textInput = document.getElementById(currentTextInputId);

      // var computedStyle = window.getComputedStyle(divContainer); //.getPropertyValue('font-size');
      // var computeLeft = computedStyle.left.replace();
      // var computeTop = computedStyle.top;

      // //checkPosition(divContainer);

      var closeBtnAdjPx = -65;
      var closeBtnAdjVw = pixelToVWval(closeBtnAdjPx);
      var closeBtnMarginRightText = closeBtnAdjVw + "vw";
      $("#execAPIGenCloseBtn").css({"margin-right" : closeBtnMarginRightText});
      // //$("#blinker2").css({"margin-left" : "2vw" });

      // // var currentTextInputId = "input" + lblRowCount.innerText;
      // // var textInput = document.getElementById(currentTextInputId);

      // //var widthOfTextChangePX = Number(numOfChars) * (Number(charWidth) * Number(zoomPct));

      // var zoomPct = (window.outerWidth - 10) / window.innerWidth;
      // //log(zoomPct);
      // var adjustedX = Number(computeLeft) + 73;
      // var adjustedY = Number(computeTop) + 70;
      // var adjustedX = adjustedX * zoomPct;
      // var adjustedY = adjustedY * zoomPct;

      // var adjustedXvw = pixelToVWval(adjustedX) + "vw";
      // var adjustedYvh = pixelToVHval(adjustedY) + "vh";

      // //log("default x and y : " + adjustedXvw + ". " + adjustedYvh);

      // blinker2.style.top = adjustedYvh;
      // blinker2.style.left = adjustedXvw;
  
    }, 100);
  });
}
function adjustTerminal() {
  $(document).ready(function () {
    setTimeout(() => {
      //log("adj term - turn on blinker");
    }, 100);
  });
}
//#endregion

//#region focusUnfocusTerminal
function focusCurrentTerminalInput() {
  //log("focusCurrentTerminalInput");
  var currentTextInputId = "input" + lblRowCount.innerText;
  $("#" + currentTextInputId).focus();
  $("#termShimImg").animate({ left: "980px" }, 200);
  //showBlinker2();
  terminalIsFocused = true;
}
function unfocusCurrentTerminalInput() {
  //hideBlink
  terminalIsFocused = false;
}
$("#terminalWindow").mouseenter(function () {
  let activeElement = document.activeElement;

  if (activeElement) {
    if (!activeElement.id.includes("input")) {
      focusCurrentTerminalInput();
    }
  }
});
$("#terminalWindow").mouseout(function () {
  $("#termShimImg").css("left", "-1000px");
});
function inputFocus(element) {
  //log("inputFocus : " + element.id)
  element.focus();
}
//#endregion

//#region terminalOutput
function processCommand(e, ctrl) {
  //get active command text
  let command = e.srcElement.value;
  let commandId = e.srcElement.id;
  let rowCount = lblRowCount.innerText;

  if (rowCount > 1)
  {
    var previousCommandId = Number(rowCount) - 1;
    var previousCommandInputId = "input" + previousCommandId;
    var previousCommandInputElement = document.getElementById(previousCommandInputId); 

    var previousCommandInputElementValue = "";
    if (previousCommandInputElement)
    {
      previousCommandInputElementValue = previousCommandInputElement.value;
    }
    if (rowCount > 2)
    {
      var secondPreviousCommandId = Number(rowCount) - 2;
      var secondPreviousCommandInputId = "input" + secondPreviousCommandId;
      var secondPreviousCommandInputElement = document.getElementById(secondPreviousCommandInputId);
      var secondPreviousCommandInputElementValue = "";
      if(secondPreviousCommandInputElement)
      {
        secondPreviousCommandInputElementValue = secondPreviousCommandInputElement.value;
      }

      if (secondPreviousCommandInputElementValue == "apigen") {
        //connection string end
        var connString = "";
        connString = previousCommandInputElementValue + command;
        command = "processingSql";
  
      }
    }
  }

  //apigen>:
  if (apigenMode) {
    if (ctrl == true && e.keyCode == 67) {
       //exit
      apigenMode = false;
      addCommandOutputRow(true, "exit " + e.srcElement.value);
      addTerminalRow(true, true, "default command");
    } 
    else {
      var cr = "<br/>";
      var apigenHelpMsg = `APIGen Help  ${cr}
      SQL Connection String Example : ${cr}
        "Server=sqlserver;Database=Northwind;User Id=sa;Password=p@ssword;TrustServerCertificate=True" ${cr}
      ${cr}
      Options:${cr}
         -h, --help                                display help menu ${cr}
         -v, --version                             print APIGen version ${cr}
      ${cr}
      Documentation can be found at https://apigen.net/documentation ${cr}
      `;

      switch (command) {
        case "":
          //check sql connection string
          break;
        case "-h":
          //help
          addCommandOutputMultiLine(true, apigenHelpMsg);
          addAPIGenRow(true, true, "default command"); 
          //addCommandOutputMultiLine(true, apigenSplashMsg);
          //addAPIGenRow(true, true, "default command");  
          break;
        case "--help":
          //help
          addCommandOutputMultiLine(true, apigenHelpMsg);
          addAPIGenRow(true, true, "default command"); 
          //addCommandOutputMultiLine(true, apigenSplashMsg);
          //addAPIGenRow(true, true, "default command");  
          break;
        case "exit":
          //exit
          apigenMode = false;
          addCommandOutputRow(true, "exit " + e.srcElement.value);
          addTerminalRow(true, true, "default command");
          break;        
        case "":
          //help
          addCommandOutputMultiLine(true, apigenHelpMsg);
          addAPIGenRow(true, true, "default command"); 
          break;
        case "processingSql":
          //help
          addCommandOutputMultiLine(true, "Processing SQL..");
          var lastCommandTextLength = 0;
          lastCommandTextLength = lastCommandText.trim().length;
          if (lastCommandTextLength > 0) {
            //async call
            generateAPI(lastCommandText).then(
              function(value) 
              { 
                setViewAPI(value);
                setDesktopFile();
              },
              function(error) { 
                setViewAPIError(error);
              }
            )
          }
          else
          {
            console.log('last command length = 0');
          }
          break;
        default:
          //not found
          addCommandOutputMultiLine(true, "APIGen command \"" + command +  "\" not found <br/> Enter -h for help.");
          addAPIGenRow(true, true, "default command");  
          break;
      }
    }
  }
  else {
    if (command.trim() != "") {
      //only change if command is different
      //get last command
      var currentHistoryCmd = cmdCnt - cmdHistoryPosition;
      let cmdHistoryText = sessionStorage.getItem("command" + currentHistoryCmd);
  
      if (cmdHistoryText != command.trim()) {
        incrementCmdCnt(); //sets cmdCnt
        //console.log(cmdCnt);
        setCmdHistoryPosition(0);
        //console.log("cmd id (cmdCnt): " + cmdCnt + ", value : " + command.trim());
        sessionStorage.setItem("command" + cmdCnt, command.trim());
      } else {
        //console.log("command same as previous - do not add to history");
      }
  
      switch (command) {
        case "apigen":
          apigenMode = true;
          var cr = "<br/>";
          var indent = "&nbsp;";
          var apigenSplashMsg = `APIGen  ${cr}
          Please enter the SQL connection string ${cr}
          ex: ${cr}
          ${indent} Server=sqlserver;Database=Northwind;User Id=sa;Password=p@ssword1;TrustServerCertificate=True
          `;
          addCommandOutputMultiLine(true, apigenSplashMsg);
          addAPIGenRow(true, true, "default command");  
          break;
        case "clear":
          terminalWindow.innerHTML = '<img id="termShimImg" src="assets/images/shimblur.png"/>';
          addTerminalRow(true, false, "clear command");
          break;
        case "ls":
          addCommandOutputRowHTML(true, "<span style=\"color:blue\">bin</span>");
          addTerminalRow(true, true, "ls command");
          break;
        case "ls -a":
          addCommandOutputRowHTML(true, "<span style=\"color:white\">. .. </span> <span style=\"color:blue\">bin</span> <span style=\"color:white\">.profile</span>");
          addTerminalRow(true, true, "ls command");
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
  
    } else {
      //ctrl key pressed 
      if (ctrl == true && e.keyCode == 67) {
          //log("ctrl-c entered")
      } else { //unrecognized command
        addTerminalRow(true, true, "default command");
      }
    }
  }
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
function addCommandOutputLink(lineBreakBeforePrompt, outputString) {
  var terminalWindow = document.getElementById("terminalWindow");
  let rowCount = lblRowCount.innerText;
  let newRowId = Number(rowCount) + 1;

  if (lineBreakBeforePrompt) {
    var br = document.createElement("br");
    terminalWindow.appendChild(br);
  }

  const linkTextArray = outputString.split("|");
  let regularText = linkTextArray[0];
  let linkText = linkTextArray[1];

  var spanRegularText = document.createElement("span");
  spanRegularText.innerHTML = regularText;
  spanRegularText.className = "terminal-output";

  var spanLinkText = document.createElement("span");
  spanLinkText.innerHTML = linkText;
  spanLinkText.className = "terminal-output-link";
  spanLinkText.id = "spanLinkText";

  terminalWindow.appendChild(spanRegularText);
  terminalWindow.appendChild(spanLinkText);
  
  spanLinkText.addEventListener("click", () => {
    openAPIViewFromInnerMode();
  });

  return newRowId;
}

function setRowText(rowId, rowText) {
  let elementId = "input" + rowId;
  let currentTextInputId = document.getElementById(elementId);
  if (rowId) {
    currentTextInputId.value = rowText;
  }
}
function addAPIGenRow(includePrompt, lineBreakBeforePrompt) {

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
    label.innerText = "apigen>";
    label.className = "terminal-prompt-apigen";
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
  //log("adjust cursor add inputId");
  //newElement.addEventListener("input", adjustCursor(3), false);

  var newInputElement = document.getElementById(inputId);
  inputFocus(newInputElement);

  return newRowId;
}
function setViewAPI(viewAPIData)
{
  var resp = viewAPIData.APIGenResponse;
  addCommandOutputMultiLine(true, resp.Message);
  addCommandOutputMultiLine(true, "<div class=\"loading1\">Building API...</div>");

  var buildResp = "";

  testAPI("3").then(
    function(value)
    {
      buildResp = JSON.parse(value);
      console.log(buildResp);
      addCommandOutputMultiLine(true, buildResp.CmdResponse);
      addCommandOutputLink(true, "Download or View API: |https://apigen.net/viewapi");


     //terminalWindow.innerHTML = '<img id="termShimImg" src="assets/images/shimblur.png"/>';
     //addTerminalRow(true, false, "clear command");
     //addCommandOutputMultiLine(true, "<div class=\"loading1\">Starting API...</div>");

      //var startResp = "";
     // testAPI("4").then(
       // function(value)
      //  {
      //    startResp = JSON.parse(value);
          //console.log(startResp);
          //terminalWindow.innerHTML = '<img id="termShimImg" src="assets/images/shimblur.png"/>';
          //addTerminalRow(true, false, "clear command");
    //      addCommandOutputMultiLine(true, startResp.CmdResponse);
     //   },
      //  function(error) {
      //    console.log('Build API Error');
      //    console.log(error);
     //     return null;
     //   });

    },
    function(error) {
      console.log('Build API Error');
      console.log(error);
      return null;
    });







  // startAPI();
  // apigenMode = false;
  // addTerminalRow(true, true);
}
function setViewAPIError(viewAPIError)
{
  console.log("viewAPIError:");
  console.log(viewAPIError);
}

function setDesktopFile() {
  
}
async function generateAPI(connString) {
  let connStringFirstChar = connString.charAt(0);
  let connStringLastChar = connString.charAt(connString.length-1);
  var dbConnStringText = "databaseConnectionString";
  dbConnStringText = "\"" + dbConnStringText + "\"";
  var jsonString;
  connString = connString.replace(/^"(.*)"$/, '$1');//remove any double quotes to start
  connString="\\\"" + connString + "\\\"";
  jsonString = "{" + dbConnStringText + ":" + "\"" + connString.trim() + "\"" + "}";
  var JSONStringifiedText = JSON.stringify(jsonString);
  var JSONParsedJSONStringifiedText = JSON.parse(JSONStringifiedText);
  var bodyPostJSON = JSONParsedJSONStringifiedText;

  const apiBaseURL = "https://apigenapi.net";
  var request = document.getElementById("request");

  return await fetch(apiBaseURL + "/APIGen/GenerateAPI", {
    method: "POST",
    body: bodyPostJSON,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    }})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    })
    .catch(error => { 
      return error;
    });
}
//#endregion

//#region cursor
function adjustCursor() {
}
function adjustCursor2(adjustFor) {
  $(document).ready(function () {
    setTimeout(() => {
      var blinkXStartVW = 10.2;
      var blinkYStartVH = 19.7;

      // const singleCharPX = "0.604"; //monospace, 16pt, 100%, maximized
      // const singleCharVW = "0.604"; //monospace, 16pt, 100%, maximized
      //const singleCharVW = "0.766";  //monospace, 16pt, 100%    
      //var singleCharVW_CSS = singleCharVW + "vw";
      var zoomPct = (window.outerWidth - 10) / window.innerWidth;
     //log("zoompct:" +  zoomPct);

      if (adjustFor == 1)  //key presss
      {  
        var currentTextInputId = "input" + lblRowCount.innerText;
        var currentTextInput = document.getElementById(currentTextInputId);

        if (currentTextInput) {
          //var currenTextInputValueJS = currentTextInput.value;
          var computedStyle = getComputedCSS(currentTextInput);
          var computedFontDef;
          var currenTextInputLengthJS = currentTextInput.value.length;
          var numOfChars = currenTextInputLengthJS;
          computedFontDef = computedStyle.font;
         //log("num of chars : " + numOfChars);
          var charWidth = getOneCharWidth(computedFontDef);
         //log("char Width : " + charWidth);
          var widthOfTextChangePX = Number(numOfChars) * (Number(charWidth) * Number(zoomPct));
         //log("widthOfTextChangePX :" + widthOfTextChangePX);
          var widthOfTextChangeVW = pixelToVWval(widthOfTextChangePX);
         //log("widthOfTextChangeVW :" + widthOfTextChangeVW);

          if (widthOfTextChangeVW > 0) {
            
            var blinker2Pos = getElementPositionJS(blinker2);
            var blinker2PosLeft = blinker2Pos.left;
           //log("blinker2 Pos Left : " + blinker2PosLeft)
            var blinkerPosLeftVW = pixelToVWval(blinker2Pos.left);
           //log("current blinker pos left vw: " + blinkerPosLeftVW);
            var newPosLeftVW = Number(blinkerPosLeftVW) + Number(widthOfTextChangeVW);
           //log("new blink left : " +  newPosLeftVW);
            var newPosLeftVW_rounded = newPosLeftVW.toFixed(2);
           //log("new blink left rounded : " + newPosLeftVW_rounded);
            var adjX = 2.1;
           //log("adjX : " + adjX);
            var newPosLeftVW_rounded_minus_adjx = newPosLeftVW_rounded - adjX;
           //log("newPosLeftVW_rounded_minus_adjx: " + newPosLeftVW_rounded_minus_adjx);
            var newPosLeftVW_text = newPosLeftVW_rounded_minus_adjx + "vw";
           //log("new blink left text : " + newPosLeftVW_text);
            blinker2.style.left = newPosLeftVW_text;

            // var directSetting = "10.1vw";
            ////log("new blink left text direct set: " + directSetting);
            // blinker2.style.left = directSetting;
          }

        }
        else
        {
         //log("textInput doesn't exist");
        }
       
 
      }
      else if (adjustFor == 2)  //window drag
      {
       //log("adj cursor for drag");
        let dragChangeX;
        let dragChangeY;

        if (Number(dragChangeX) > 0) {
          XChange = dragChangeX;
          YChange = dragChangeY;
          var XChangeInVW = pixelToVWval(XChange);
          var YChangeInVH = pixelToVHval(YChange);
          blinkX = blinkXStartVW + XChangeInVW;
          blinkY = blinkYStartVH + YChangeInVH;
          var blinkChangeXtoVW = Number(blinkXStartVW) + Number(XChangeInVW);
          var blinkChangeYtoVH = Number(blinkYStartVH) + Number(YChangeInVH);
          var adjX = 0;
          var adjY = 0;
          var blinkChangeXtoVWAdj = Number(blinkChangeXtoVW) + Number(adjX);
          var blinkChangeYtoVHAdj = Number(blinkChangeYtoVH) + Number(adjY);
          var blinkChangeXtoVWAdjTxt = blinkChangeXtoVWAdj + "vw";
          var blinkChangeYtoVHAdjTxt = blinkChangeYtoVHAdj + "vh";
          blinker2.style.left = blinkChangeXtoVWAdjTxt;
          blinker2.style.top = blinkChangeYtoVHAdjTxt; 
        }
      }
      else
      {
        if (adjustFor == 3)
        {
         //log("adjusting cursor for 3 - add terminal row/add input");
        }
      }


    }, 100);
  });
}
function hideBlinker2() {
  blinker2.style.visibility = "hidden";
}
function showBlinker2() {
  blinker2.style.visibility = "visible";
}
//#endregion

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
$(function () {
  $("#divContainer").draggable();
  hideBlinker2();
});

$(".termDropArea").droppable();

$(".termDropArea").droppable({
  drop: function (e) {
    adjustCursor(2);
  },
});
//#endregion 

//#region commandHistory
function clearCmdHistory() {
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
//#endregion

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

