const debug_apigen = false;
const divKeyPress = document.getElementById("divKeyPress");
var sqlConnStringInput = document.getElementById("sqlConnStringInput");
sqlConnStringInput.setAttribute("contenteditable", true);
const terminalWindow = document.getElementById("terminalWindow");
let transactionExecuteAPIGen;

terminalWindow.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    transactionExecuteAPIGen = setTimeout(validate(e));
  }
  if (e.key === 8 || e.key === 46) {
    if (!e.shiftKey) {
      history.back();
    } else {
      history.forward();
    }
  }
});

function rollbackTransactionExecuteAPIGen() {
  clearTimeout(transactionExecuteAPIGen);
}

// $('textarea').on('input', function() {
//   var blinkingCursor = document.getElementById("blinkingCursor");
//   var length = $(this).val().length;

//   if (length > 80)
//   {
//     $(this).attr('class', 'textareaLong');
//     $(this).attr('wrap', 'on');
//     blinkingCursor.style.visibility = "hidden";
//   }
//   else
//   {
//     //alert(this.scrollWidth); //10
//     $(this)
//     .width(2)
//     //.height(20)
//     .width(this.scrollWidth)
//     //.height(this.scrollHeight);
//     $(this).attr('wrap', 'off');
//     $(this).attr('class', 'textareaStart');
//     sqlConnStringInput.autofocus;
//     blinkingCursor.style.visibility = "visible";
//     // $("#sqlConnStringInput").css('background-color', 'red');
//     // $(this).css('background-color', 'black');
//     //setSQLConnStringTextAreaStyle(this);
//   }
// });

$("#textarea").on("input", function () {
  this.focus();
  $(this).css({ width: "2px" });
  var newWidth = this.scrollWidth + "px";
  $(this).css({ width: newWidth });

  var length = $(this).val().length;
  if (length > 80) {
    var first80 = $(this).val().trim().substring(0, 79);
    var charsAfter80 = $(this)
      .val()
      .trim()
      .substring(79, length - 1);
    var over80CharsText = first80 + "\r\n" + charsAfter80;
    $(this).css("height", "80px");
    $(this).css("padding-bottom", "30px");
    $(this).val(over80CharsText);
    blinkingCursor.style.visibility = "hidden";

    // var cursorPos = this.selectionEnd;
    // this.value = text + this.value;
    // this.selectionEnd = this.selectionStart = cursorPos + length;
    // this.focus();

    // var scrollLeft = window.pageXOffset ||
    // (document.documentElement || document.body.parentNode || document.body).scrollLeft;

    // var scrollTop  = window.pageYOffset ||
    // (document.documentElement || document.body.parentNode || document.body).scrollTop;

    // text.style.height = "auto";
    // text.style.height = text.scrollHeight + 'px';

    // window.scrollTo(scrollLeft, scrollTop);
  }
});

// function setSQLConnStringInputStyle(obj) {

// }

//setSQLConnStringInputStyle();

$("#sqlConnStringInput").keydown(function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
  }
  if (e.keyCode == 8) {
    if (sqlConnStringInput.value.length > 80) {
      e.preventDefault();
      backspace();
    }
  }

  var ctrl = e.ctrlKey ? e.ctrlKey : e.keyCode === 17 ? true : false;

  if (e.keyCode == 67 && ctrl) {
    rollbackTransactionExecuteAPIGen();
    alert("rollback");
    // console.log("Ctrl+C is pressed.");
    // }
  }
});

// function backspace() {
//   sqlConnStringInput.value = sqlConnStringInput.value.substring(0, sqlConnStringInput.value.length - 1);
//   textbox.focus();
// }

function backspace() {
  var textbox = sqlConnStringInput;
  var ss = textbox.selectionStart;
  var se = textbox.selectionEnd;
  var ln = textbox.value.length;

  var textbefore = textbox.value.substring(0, ss); //text in front of selected text
  var textselected = textbox.value.substring(ss, se); //selected text
  var textafter = textbox.value.substring(se, ln); //text following selected text

  if (ss == se) {
    // if no text is selected
    textbox.value =
      textbox.value.substring(0, ss - 1) + textbox.value.substring(se, ln);
    textbox.focus();
    textbox.selectionStart = ss - 1;
    textbox.selectionEnd = ss - 1;
  } // if some text is selected
  else {
    textbox.value = textbefore + textafter;
    textbox.focus();
    textbox.selectionStart = ss;
    textbox.selectionEnd = ss;
  }

  // sqlConnStringInput.focus();
  //s $("#sqlConnStringInput").css({"width": "2px"});
  var newWidth = $("#sqlConnStringInput").scrollWidth + "px";
  $("#sqlConnStringInput").css({ width: newWidth });
}

// const interruptibleFunction = setTimeout(myGreeting, 3000);

// function myGreeting() {
//   document.getElementById("demo").innerHTML = "Happy Birthday to You !!"
// }

// function myStopFunction() {
//   clearTimeout(interruptibleFunction);
// }

function validate(e) {
  const text = e.target.value;

  if (e.srcElement.id == "sqlConnStringInput") {
    var sqlConnString = text;
    if (sqlConnString.trim() == "") {
      apigenPopupMessageError("No connection string entered");
      sqlConnStringInput.focus();
    } else {
      if (!runAPIGen(sqlConnString)) {
        apigenPopupMessageError("API Create Error");
        return;
      }

      var process = document.getElementById("process");
      process.style.visibility = "visible";

      var spanInputPrompt = document.getElementById("spanInputPrompt");
      spanInputPrompt.style.visibility = "visible";
      spanInputPrompt.innerHTML = ">";
      sqlConnStringInput.setAttribute("contenteditable", false);
      sqlConnStringInput.style.visibility = "visible";
      sqlConnStringInput.innerText = text;
      var blinkingCursor = document.getElementById("blinkingCursor");
      // var divTerminalLine = document.getElementById("divTerminalLine");
      // var divTerminalLineCharCount = divTerminalLine.innerText.trim().length;
      // if (divTerminalLineCharCount < 100){
      //   divTerminalLine.style.height = "25px";
      // }
      blinkingCursor.style.visibility = "hidden";

      var complete1 = document.getElementById("complete1");
      var complete2 = document.getElementById("complete2");
      var complete3 = document.getElementById("complete3");
      var newcommand = document.getElementById("newcommand");
      var blinkingCursor2 = document.getElementById("blinkingCursor2");

      setTimeout(() => {
        complete1.style.visibility = "visible";
      }, 2000);
      setTimeout(() => {
        complete2.style.visibility = "visible";
      }, 4000);
      setTimeout(() => {
        complete3.style.visibility = "visible";
        newcommand.style.visibility = "visible";
        blinkingCursor2.style.visibility = "visible";
        newcommand.focus();
      }, 5000);
    }
  }
}

terminalWindow.addEventListener("click", focusInput);
divKeyPress.addEventListener("mouseover", focusInput);
function focusInput() {
  var complete3 = document.getElementById("complete3");
  if (complete3.style.visibility != "visible") {
    sqlConnStringInput.setAttribute("contenteditable", true);
    sqlConnStringInput.autofocus;
    $("#sqlConnStringInput").focus();
  }
}

async function runAPIGen(sqlConnString) {
  callGenerateAPI(sqlConnString).then(
    function (data2) {
      var results2 = data2.APIGenResponse;

      var msg = results2.Success;
      var outputPath = results2.Output.APIDirectoryPath;
      var zipFilePath = results2.Output.ZipFilePath;

      return true;
    },
    function (error) {
      console.log(error);
      return;
    }
  );
}

async function callGenerateAPI(sqlConnString) {
  var returnVal = "";
  var bodyPostString;

  sqlConnString = sqlConnString.replaceAll('"', "");
  sqlConnString = '"\\"' + sqlConnString + '\\""';

  bodyPostString = `{
    "databaseConnectionString": ${sqlConnString}
  }`;

  var jsonParsedBody = JSON.parse(bodyPostString);
  if (debug_apigen) {
    console.log("apigen body :" + jsonParsedBody);
  }
  return await fetch("http://0.0.0.0:2000/APIGen/GenerateAPI", {
    method: "POST",
    body: JSON.stringify(jsonParsedBody),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response2) {
      return response2.json();
    })
    .then(function (data2) {
      if (debug_apigen) {
        console.log("apigen raw response:" + data2);
      }
      var jsonReturn2 = data2; //s removeControlChars2(data2);
      return jsonReturn2;
    })
    .catch((error) => console.log("Error:", error));
}

// function removeControlChars2(rawString2) {

//   if (debug_apigen) {console.log(rawString2);}
//   var trimmedString = rawString2.toString().trim();
//   var sqlResultsLength = trimmedString.length;
//   let firstChar = trimmedString.slice(0, 1);
//   var strRemoveFirst = trimmedString;
//   if (firstChar == '"') { strRemoveFirst = trimmedString(1, trimmedString.length);}
//   let lastChar = strRemoveFirst.substr(trimmedString.length - 1);
//   var strRemoveLast = strRemoveFirst;
//   if (lastChar == '"') { strRemoveLast = strRemoveFirst(0,trimmedString.length - 1); }
//   var cleanedString1 = strRemoveLast;
//   var cleanedString2 = cleanedString1.replaceAll(/\\n/g, '');
//   var cleanedString3 = cleanedString2.replace(/\\/g, "");
//   var cleanedString4 = cleanedString3.replaceAll('"[','[').replaceAll('"]',']');
//   var lastArrayBracket = cleanedString4.lastIndexOf("]");
//   var closingBrackerChar = "}";
//   var lastClosingBracket = cleanedString4.lastIndexOf(closingBrackerChar);

//   var firstPart = "";
//   var secondPart = "";
//   var finalString = "";

//   var hasArray = false;
//   if (cleanedString4.includes("[")){hasArray=true}

//   if (hasArray)
//   {
//     if (lastArrayBracket == -1)
//     {
//       firstPart = cleanedString4.substring(0,lastClosingBracket+1);
//       finalString = firstPart + "]}";
//     }
//     else
//     {
//       firstPart = cleanedString4.substring(0,lastArrayBracket+1);
//       secondPart = cleanedString4.substring(lastClosingBracket-1,cleanedString4.length);
//       var finalString2 = firstPart + "}";
//     }
//   }
//   else
//   {
//     finalString2 = cleanedString4;
//   }

//   try {
//     if (debug_apigen) {console.log(finalString);}
//     return JSON.parse(finalString);
//   }
//   catch(error) {
//     console.error(error);
//     console.log("---------------------------");
//     console.log("rawString:                 " + rawString2);
//     console.log("finalString:               " + finalString2);
//   }
// }

function apigenPopupMessage(msg, myYes) {
  var alertBox = $("#apigenAlert");
  alertBox.find(".message").text(msg);
  alertBox
    .find(".ok")
    .unbind()
    .click(function () {
      alertBox.hide();
    });
  alertBox.find(".ok").click(myYes);
  alertBox.show();
}

function apigenPopupMessageError(msg, myYes) {
  var alertBox = $("#apigenAlertError");
  alertBox.find(".message").text(msg);
  alertBox
    .find(".ok")
    .unbind()
    .click(function () {
      alertBox.hide();
    });
  alertBox.find(".ok").click(myYes);
  alertBox.show();
}

function cl(msg) {
  console.log(msg);
}

$(function () {
  $("#terminalWindow").draggable({
    handle: "#trTerminalHeader",
  });
});
