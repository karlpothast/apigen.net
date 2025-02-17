//#region "Constants"
const debug = false;
const sqlAPIBaseURL = apiBaseURL;
const username = "sa";
const password = "n3wsdminDockr2022";
const exampleDBList = "NORTHWIND;TODOLIST;";
const builtInDBList = "MASTER;MODEL;TEMPDB;MSDB;"; //MASTER
let userDbList;
const noDropDBList = builtInDBList + exampleDBList;
const sqlConnString =
  "Server=sqlserver;Database=***dbplaceholder***;User Id=sa;Password=n3wsdminDockr2022;TrustServerCertificate=True";
const queryWindow = document.getElementById("queryWindow");
const divAddDB = document.getElementById("divAddDB");
const divAddTable = document.getElementById("divAddTable");
const divDropDB = document.getElementById("divDropDB");
const divDropTable = document.getElementById("divDropTable");
const divSubMenuItem = document.getElementById("divSubMenuItem");
const divSubMenuItem2 = document.getElementById("divSubMenuItem2");
const divSubMenuItem3 = document.getElementById("divSubMenuItem3");
const divSubMenuItem4 = document.getElementById("divSubMenuItem4");
const btnMenu = document.getElementById("btnMenu");
const divMenu = document.getElementById("divMenu");
const lblMsg = document.getElementById("lblMsg");
const txtNewDB = document.getElementById("txtNewDB");
const divObjects = document.getElementById("divObjects");
//#endregion

function getOffset(el) {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}
const initSql = async () => {

  console.log("check login sql");
  console.log(loggedIn);
  if (loggedIn) {
    try {
      const dividerV = document.getElementById("dividerV");
      const dividerVAdjustedCoords = getOffset(dividerV);
      verticalDividerY = dividerVAdjustedCoords.top;
      tabContent = document.getElementsByClassName("tabContent");
      tab = document.getElementsByClassName("tab");
      hideTabsContent(1);
  
      var SQLServerDomainURL = apiBaseURL;
      var SQLServerAvailable;
  
      checkSQLServer(SQLServerDomainURL).then(
        function (value) {
          SQLServerAvailable = value;
          if (SQLServerAvailable == true) {
            getServerInfo();
            userDbList = getUserDb();
            getDBList();
          } else {
            popupMessageError("SQL Server API Unavailable");
          }
        },
        function (error) {}
      );
    } catch (error) {
      console.log("init error : " + error);
    }
  }


};

async function checkSQLServer(SQLServerDomainURL) {
  let SQLServerOnline = false;
  await $.get(SQLServerDomainURL)
    .done(function () {
      SQLServerOnline = true;
    })
    .fail(function () {
      SQLServerOnline = false;
      popupMessageError("SQL Server API Unavailable");
      sqlDiv.style.opacity = 0.8;
      //sqlDiv.style.backgroundColor = "black";
    });
  return SQLServerOnline;
}

async function checkSQLServerAvailability(url) {
  var online = false;

  return (
    await fetch(apiBaseURL),
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }.then(function (response) {
      $.get(url)
        .done(function () {
          SQLServerAvailable = true;
          online = true;
          return true;
        })
        .fail(function () {
          SQLServerAvailable = false;
          online = false;
          return false;
        });
      return true;
    })
  );
}

function displayError(err) {
  console.log("Display Error : ");
  console.error(err);
}

function getConnString(dbName) {
  if (dbName == "") {
    popupMessageError("Choose a database from the dropdown");
    selectDatabase.focus();
    return;
  }

  var connString = sqlConnString.replace("***dbplaceholder***", dbName.trim());
  navigator.clipboard.writeText(connString);

  popupMessage("Connection string copied to clipboard");
}

function focusSelectDatabase(){
  selectDatabase.focus();
  selectDatabase.style.border = "1px darkred solid";
}

async function getServerStatus() {
  getSQLResults(server).then(
    function (data) {
      if (data && data.SQLResponse) {
        var sqlResults = data.SQLResponse;
        var htmlSpan1 = "<span ";
        var htmlSpan2 = "";
        var htmlSpan3 = "</span>";
        var htmlString =
          "<img class='expandRetract' src='\\assets\\images\\minus.png'><img src='\\assets\\images\\server.png'>";
        for (let i = 0; i < sqlResults.length; i++) {
          let sqlResp = sqlResults[i];
          var serverInfo = sqlResp.serverInfo.replace("|", "\\");
          var toolTip = serverInfo;

          if (serverInfo.length > 45) {
            serverInfo = serverInfo.substring(0, 45) + "..";
          }

          htmlSpan2 = " title='" + toolTip + "'>";
          htmlString =
            htmlSpan1 + htmlSpan2 + htmlString + serverInfo + htmlSpan3;
        }
        htmlString += "</span>";
        divServerInfo.innerHTML = htmlString;
      }
    },
    function (error) {
      return;
    }
  );
}

async function getSQLResults(username, password, database, sqlCommandText) {
  var sqlDebug = false;

  if (sqlDebug) {
    console.log("getSQLResults begin");
  }
  var returnVal = "";
  if (sqlCommandText == "") {
    popupMessageError("SQL command text is blank");
    return;
  }

  let httpPostRequestBody = {
    "username": `${username}`,
    "password": `${password}`,
    "database": `${database}`,
    "sqlCommandText": `${sqlCommandText}`
  };

  if (sqlDebug) {
    console.log(sqlCommandText);
  }

  var jsonStringifiedBody = JSON.stringify(httpPostRequestBody);
  var jsonParsedBody = JSON.parse(jsonStringifiedBody);

  if (sqlDebug) {
    console.log(jsonParsedBody);
  }
  return await fetch(sqlAPIBaseURL + "/sql/sqlcommand", {
    method: "POST",
    body: jsonStringifiedBody,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    }})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (debug) {
        console.log(data);
      }
      var jsonReturn = removeControlChars(data);

      var jsonStringifiedReturn = JSON.stringify(data);
      // var jsonReturnObject = JSON.parse(jsonStringifiedReturn);
      return jsonReturn;

    })
    .catch(error => { 
      console.log(error);
    });
}

function getServerInfo() {
  var divServerInfo = document.getElementById("divServerInfo");

  const serverInfoQuery =
    "DECLARE @tblServerInfo TABLE (serverInfo VARCHAR(500)); " +
    "INSERT INTO @tblServerInfo SELECT UPPER(HOST_NAME()) + '|' + @@SERVERNAME + ' (' + LEFT(@@VERSION, (CHARINDEX('(', @@VERSION)-1)) + ' - ' + SYSTEM_USER + ')' as 'ServerInfo';" +
    "SELECT serverInfo FROM @tblServerInfo FOR JSON AUTO; ";

  dbName = "master";

  getSQLResults(username, password, dbName, serverInfoQuery).then(
    function (data) {
      if (data) {
        var sqlResults = data.SQLResponse;
        var htmlSpan1 = "<span ";
        var htmlSpan2 = "";
        var htmlSpan3 = "</span>";
        var htmlString =
          "<img class='expandRetract' src='\\assets\\images\\minus.png'><img src='\\assets\\images\\server.png'>";
        for (let i = 0; i < sqlResults.length; i++) {
          let sqlResp = sqlResults[i];
          var serverInfo = sqlResp.serverInfo.replace("|", "\\");
          var toolTip = serverInfo;

          if (serverInfo.length > 45) {
            serverInfo = serverInfo.substring(0, 45) + "..";
          }

          htmlSpan2 = " title='" + toolTip + "'>";
          htmlString =
            htmlSpan1 + htmlSpan2 + htmlString + serverInfo + htmlSpan3;
        }
        htmlString += "</span>";
        divServerInfo.innerHTML = htmlString;
      }
      else
      {
        console.log('response not ok');
      }
    },
    function (error) {
      console.log("Get Server Info error");
      console.log(error);
      return;
    }
  );
}

async function getUserDb() {

  //check user db already exists
  //user Db name : app acroynym + githubId + login  // + serverid?

  //check if username ever changes
  //alphanumeric characters and dashes ( - )
  let appAcronym = "ag";
  let userDbName = appAcronym + user.id.trim() + user.login.trim();

  //console.log('check for db : ' + userDbName);

  return userDbName;
  
}

async function getDBList() {
  var database = "master";
  const dbListQuery = "SELECT name FROM sys.databases FOR JSON AUTO";
  const divObjects = document.getElementById("divObjects");

  getSQLResults(username, password, database, dbListQuery).then(
    function (data) {
      var sqlResults = data.SQLResponse;

      var htmlString = "<table>";
      //var htmlTableRow = "<tr style=\"background-color:#FFF29D\"><td><span>SQL Objects</span><td></tr>";
      //htmlString += htmlTableRow;
      var selectDatabase = document.getElementById("selectDatabase");
      var selectDatabasePopup = document.getElementById("selectDatabasePopup");
      var selectDatabasePopuDrop = document.getElementById(
        "selectDatabasePopupDrop"
      );
      var selectDatabasePopupDropDB = document.getElementById(
        "selectDatabasePopupDropDB"
      );

      var selectDefault = "";
      selectDatabase.add(new Option(selectDefault));
      selectDatabasePopup.add(new Option(selectDefault));
      selectDatabasePopupDrop.add(new Option(selectDefault));
      selectDatabasePopupDropDB.add(new Option(selectDefault));

      let userDbFound = false;

      for (let i = 0; i < sqlResults.length; i++) {
        let sqlDBs = sqlResults[i];
        var sqlDBNameHTML = "";
        sqlDBNameHTML = sqlDBs.name;

        if (!noDropDBList.includes(sqlDBs.name.toUpperCase() + ";")) {
          selectDatabasePopupDrop.add(new Option(sqlDBs.name));
          selectDatabasePopup.add(new Option(sqlDBs.name));
          selectDatabasePopupDropDB.add(new Option(sqlDBs.name));
        }

        //userDb
        if (!userDbList.includes(sqlDBs.name.toUpperCase() + ";")) {
          userDbFound = true;
          selectDatabasePopupDrop.add(new Option(sqlDBs.name));
          selectDatabasePopup.add(new Option(sqlDBs.name));
          selectDatabasePopupDropDB.add(new Option(sqlDBs.name));
          console.log("user db found in existing db list");
        }
        else
        {
          console.log("user db not found in existing db list");
        }

        if (!builtInDBList.includes(sqlDBs.name.toUpperCase() + ";")) {
          selectDatabase.add(new Option(sqlDBs.name));

          htmlString +=
            "<tr><td>&nbsp;&nbsp;<button class='btnViewTables' id='btnViewTables_" +
            sqlDBs.name +
            "' onclick=getTables('" +
            sqlDBs.name +
            "')>" +
            "<img class='expandRetract' class='expandRetract' src='\\assets\\images\\plus.png'/><img src='\\assets\\images\\db.png'/></button>" +
            sqlDBNameHTML +
            "<div id='divTables_" +
            sqlDBs.name +
            "'></div></td></tr>";
        }
      }
      htmlString += "</table>";
      divObjects.innerHTML = htmlString;

      if (!userDbFound) {
        //create user db
        console.log("user db not found - create");
        createDbNoUi(userDbList);
      }
      else
      {

      }
    },
    function (error) {}
  );
}
async function getTables(dbName) {
  setDatabase(dbName);
  var clickedButtonId = document.getElementById("btnViewTables_" + dbName);
  var clickedDivId = document.getElementById("divTables_" + dbName);
  if (clickedButtonId.innerHTML.toString().includes("plus.png")) {
    clickedButtonId.innerHTML =
      "<img class='expandRetract' src='\\assets\\images\\minus.png'/><img src='\\assets\\images\\db.png'/>";

    //get tables
    const tblQuery = "SELECT top 40 name FROM sys.tables FOR JSON AUTO";

    getSQLResults(username, password, dbName, tblQuery).then(
      function (data) {
        var sqlResults = data.SQLResponse;
        var htmlString = "<table>";
        for (let i = 0; i < sqlResults.length; i++) {
          let sqlTables = sqlResults[i];
          htmlString +=
            "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;<button class='btnViewColumns' id='btnViewColumns_" +
            sqlTables.name +
            "' onclick=viewColumns('" +
            dbName +
            "','" +
            sqlTables.name +
            "')><img class='expandRetract' src='\\assets\\images\\plus.png'/><img src='\\assets\\images\\table.png'/></button>" +
            sqlTables.name +
            "<div id='divColumns_" +
            sqlTables.name +
            "'></div></td></tr>";
        }
        htmlString += "</table>";
        clickedDivId.innerHTML = htmlString;
      },
      function (error) {}
    );
  } else if (clickedButtonId.innerHTML.toString().includes("minus.png")) {
    clickedButtonId.innerHTML =
      "<img class='expandRetract' src='\\assets\\images\\plus.png'/><img src='\\assets\\images\\db.png'/>";
    clickedDivId.innerHTML = "";
  }
}
function setDatabase(dbName) {
  var selectDatabase = document.getElementById("selectDatabase");
  selectDatabase.value = dbName;
  var selectDatabasePopup = document.getElementById("selectDatabasePopup");
  selectDatabasePopup.value = dbName;
}
async function viewColumns(dbName, tableName) {
  setDatabase(dbName);
  let pkeyString = "";
  var clickedButtonId = document.getElementById("btnViewColumns_" + tableName);
  var clickedDivId = document.getElementById("divColumns_" + tableName);
  if (clickedButtonId.innerHTML.toString().includes("plus.png")) {
    clickedButtonId.innerHTML =
      "<img class='expandRetract' src='\\assets\\images\\minus.png'/><img src='\\assets\\images\\table.png'/>";

    var pkQuery =
      "DECLARE @sp_pkeys as table (TABLE_QUALIFIER varchar(100),TABLE_OWNER varchar(100),TABLE_NAME varchar(100),COLUMN_NAME varchar(100),KEY_SEQ int,PK_NAME varchar(255)) INSERT into @sp_pkeys exec ('sp_pkeys ''" +
      tableName +
      "'' ') SELECT COLUMN_NAME FROM @sp_pkeys for json auto";

    await getSQLResults(username, password, dbName, pkQuery).then(
      function (data) {
        var sqlResults = data.SQLResponse;
        for (let i = 0; i < sqlResults.length; i++) {
          let sqlResp = sqlResults[i];
          pkeyString += sqlResp.COLUMN_NAME.toUpperCase() + ";";
        }
      },
      function (error) {}
    );

    //get columns
    var clmQuery =
      "SELECT rtrim(c.name) as 'ColumnName', t.Name as 'DataType' " +
      "FROM sys.columns c INNER JOIN sys.types t ON c.user_type_id = t.user_type_id " +
      "WHERE c.object_id = OBJECT_ID('" +
      tableName +
      "') FOR JSON AUTO";

    getSQLResults(username, password, dbName, clmQuery).then(
      function (data) {
        var sqlResults = data.SQLResponse;
        var htmlString = "<table>";
        for (let i = 0; i < sqlResults.length; i++) {
          let sqlResp = sqlResults[i];

          var clmImg = "<img src='\\assets\\images\\column.png'/>";

          if (pkeyString.includes(sqlResp.ColumnName.toUpperCase())) {
            clmImg = "<img src='\\assets\\images\\pk.png'/>";
          }

          htmlString +=
            "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='btnViewColumns' id='btnViewColumns_" +
            sqlResp.ColumnName +
            "' onclick=viewColumns('" +
            sqlResp.ColumnName +
            "')>" +
            clmImg +
            "</button>" +
            sqlResp.ColumnName +
            " (" +
            sqlResp.DataType +
            ")" +
            "</td></tr>";
        }
        htmlString += "</table>";

        clickedDivId.innerHTML = htmlString;
      },
      function (error) {
        console.log(error);
      }
    );
  } else if (clickedButtonId.innerHTML.toString().includes("minus.png")) {
    clickedButtonId.innerHTML =
      "<img src='\\assets\\images\\plus.png'/><img src='\\assets\\images\\table.png'/>";
    clickedDivId.innerHTML = "";
  }
}

const btnSQLAlertErrorOk = document.getElementById("btnSQLAlertErrorOk");
btnSQLAlertErrorOk.addEventListener("click", () => {
  selectDatabase.focus();
});

const selectDatabase = document.getElementById("selectDatabase");
const sqlButton = document.getElementById("sqlButton");
sqlButton.addEventListener("click", () => {
  
  if (selectDatabase.value == "") {
    console.log('no db selected');
    popupMessageError("Please select a database");
  
  }
  else {
    query();
  }

});

async function query() {
  tableDiv.innerHTML = "";
  var dbName = selectDatabase.value;

  if (dbName == "") {
    dbName = "master";
    setDatabase("master");
  }

  const divObjects = document.getElementById("divObjects");
  var sqlQuery = queryWindow.value;

  if (sqlQuery.toUpperCase().includes("SELECT *")) {
    //loop through all columns - remove any images
    var queryFromTextArray = sqlQuery.toUpperCase().split('FROM');
    if (queryFromTextArray.length > 0)
    {

    }
    var queryFragment = queryFromTextArray[1]; 
    var queryFragmentSpacesArray = queryFragment.split(' ');
    var fragmentPiece = null;
    var tableName = ""; //assumption
    for (var i = 0; i < queryFragmentSpacesArray.length; i++) {
      fragmentPiece = queryFragmentSpacesArray[i];
      if (fragmentPiece.length > 0)
      {
        tableName = fragmentPiece;
      }

    }

    var clmQuery =
    "SELECT rtrim(c.name) as 'ColumnName', t.Name as 'DataType' " +
    "FROM sys.columns c INNER JOIN sys.types t ON c.user_type_id = t.user_type_id " +
    "WHERE c.object_id = OBJECT_ID('" +
    tableName +
    "') FOR JSON AUTO";

    var invalidClmFound = false;
    var columnsString = "";
    getSQLResults(username, password, dbName, clmQuery).then(
    function (data) {
      var sqlResults = data.SQLResponse;
      for (let i = 0; i < sqlResults.length; i++) {
        let sqlResp = sqlResults[i];
        if (sqlResp.DataType.toUpperCase() == "IMAGE") {
          invalidClmFound = true;
        }
        else{
          columnsString += sqlResp.ColumnName + ",";
        }
      }
      var clmSelectString = "SELECT top 10 " + columnsString.slice(0, -1);
      if (invalidClmFound){
        sqlQuery = sqlQuery.toUpperCase().replace("SELECT *",clmSelectString);
      }
      else {
        sqlQuery = sqlQuery.toUpperCase().replace("SELECT *","SELECT TOP 25 *");
      }
      if (!sqlQuery.toUpperCase().includes("FOR JSON AUTO")) {
        sqlQuery += " FOR JSON AUTO";
      }
    
      getSQLResults(username, password, dbName, sqlQuery).then(
        function (data) {
          var sqlResults = data.SQLResponse;
          var jsonString = JSON.stringify(sqlResults);
          const tableDiv = document.getElementById("tableDiv");
          const jsonDiv = document.getElementById("jsonDiv");
          const bottomDiv = document.getElementById("bottomDiv");
    
          htmlString = convertJSONtoRows(sqlResults);
          tableDiv.innerHTML = htmlString;
          jsonDiv.innerHTML = jsonString;
        },
        function (error) {
          console.log(error);
        }
      );
    }),
    function (error) {
      console.log(error);
    }
  }
  else 
  {
    

    getSQLResults(username, password, dbName, sqlQuery).then(
      function (data) {
        var sqlResults = data.SQLResponse;
        var jsonString = JSON.stringify(sqlResults);
        const tableDiv = document.getElementById("tableDiv");
        const jsonDiv = document.getElementById("jsonDiv");
        const bottomDiv = document.getElementById("bottomDiv");
  
        htmlString = convertJSONtoRows(sqlResults);
        tableDiv.innerHTML = htmlString;
        jsonDiv.innerHTML = jsonString;
      },
      function (error) {
        console.log(error);
      }
    );

  }
}

function hideQueryWindow() {
  const topDiv = document.getElementById("topDiv");
  const bottomDiv = document.getElementById("bottomDiv");
  const containerV = document.getElementById("containerV");
  const divQuery1 = document.getElementById("divQuery1");
  const sqlButton = document.getElementById("sqlButton");

  topDiv.style.visibility = "hidden";
  bottomDiv.style.visibility = "hidden";
  containerV.style.visibility = "hidden";
  divQuery1.style.visibility = "hidden";
  sqlButton.disabled = true;
}
function convertJSONtoRows(json) {
  var thString = "<tr class=\"\gradient2\">";
  var list = json;
  var columns = [];
  var header = $("<tr/>");
  for (var i = 0; i < list.length; i++) {
    var row = list[i];
    for (var k in row) {
      if ($.inArray(k, columns) == -1) {
        columns.push(k);
        thString += "<td class='gridTableTd'>" + k + "</td>";
      }
    }
  }
  thString += "</tr>";

  var tbl = document.createElement("table");
  var cols = columns;
  var tableString = "";
  tableString = "<table class=\"gridTable\">";
  tableString += thString;
  var rows = "";
  var cell = "";
  var cells = "";
  for (var i = 0; i < list.length; i++) {
    var row = "";
    row = "";
    cell = "";
    cells = "";
    for (var colIndex = 0; colIndex < cols.length; colIndex++) {
      var val = list[i][cols[colIndex]];
      if (val == null) val = "";
      row += val;

      if (val.toString().trim().length > 50) {
        var valShort = val.slice(0, 10) + "...";
        cell = "<td class=\"gridTableTd\"><div class=\"tooltip2\">" + valShort + "<span class=\"tooltip2text\">"+val+"</span> </div>";
      }
      else
      {
        cell = "<td class=\"gridTableTd\">" + val + "</td>";
      }
      cells += cell;
    }

    row = "<tr>" + cells + "</tr>";
    rows += row;
  }

  tableString += rows;
  tableString += "</table>";
  //tableDiv.innerHTML = tableString;
  return tableString;
}
function showMenu() {
  if (btnMenu.innerHTML == "☰&nbsp;") {
    btnMenu.innerHTML = "☒&nbsp;";
    divMenu.style.visibility = "visible";
    divAddDB.style.visibility = "hidden";
    divAddTable.style.visibility = "hidden";
    divSubMenuItem.style.visibility = "hidden";
    divSubMenuItem2.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "hidden";
    divSubMenuItem4.style.visibility = "hidden";
  } else if (btnMenu.innerHTML == "☒&nbsp;") {
    btnMenu.innerHTML = "☰&nbsp;";
    divMenu.style.visibility = "hidden";
    divSubMenuItem.style.visibility = "hidden";
    divAddDB.style.visibility = "hidden";
    divAddTable.style.visibility = "hidden";
    divSubMenuItem.style.visibility = "hidden";
    divSubMenuItem2.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "hidden";
    divSubMenuItem4.style.visibility = "hidden";
  }
}
function newDatabasePopup() {
  if (divSubMenuItem.style.visibility == "visible") {
    closePopups();
  } else {
    divDropTable.style.visibility = "hidden";
    divAddDB.style.visibility = "hidden";
    divSubMenuItem.style.visibility = "visible";
    divAddTable.style.visibility = "hidden";
    divAddDB.style.visibility = "visible";
    divSubMenuItem2.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "hidden";
    divSubMenuItem4.style.visibility = "hidden";
  }
}
function closePopups() {
  divSubMenuItem.style.visibility = "hidden";
  divAddTable.style.visibility = "hidden";
  divDropDB.style.visibility = "hidden";
  divDropTable.style.visibility = "hidden";
  divAddDB.style.visibility = "hidden";
  divSubMenuItem2.style.visibility = "hidden";
  divSubMenuItem3.style.visibility = "hidden";
  divSubMenuItem4.style.visibility = "hidden";
}
function newTablePopup() {
  const divAddDB = document.getElementById("divAddDB");
  const divAddTable = document.getElementById("divAddTable");
  const divDropDB = document.getElementById("divDropDB");
  const divDropTable = document.getElementById("divDropTable");
  const divSubMenuItem = document.getElementById("divSubMenuItem");
  const divSubMenuItem2 = document.getElementById("divSubMenuItem2");
  const divSubMenuItem3 = document.getElementById("divSubMenuItem3");
  const divSubMenuItem4 = document.getElementById("divSubMenuItem4");
  const txtNewTable = document.getElementById("txtNewTable");

  if (divSubMenuItem2.style.visibility == "visible") {
    closePopups();
  } else {
    divSubMenuItem2.style.visibility = "visible";
    divSubMenuItem.style.visibility = "hidden";
    divAddDB.style.visibility = "hidden";
    divAddTable.style.visibility = "visible";
    divDropDB.style.visibility = "hidden";
    divDropTable.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "hidden";
    divSubMenuItem4.style.visibility = "hidden";
    txtNewTable.focus();
  }
}
function dropDBPopup() {
  const divAddDB = document.getElementById("divAddDB");
  const divAddTable = document.getElementById("divAddTable");
  const divDropDB = document.getElementById("divDropDB");
  const divDropTable = document.getElementById("divDropTable");
  const divSubMenuItem = document.getElementById("divSubMenuItem");
  const divSubMenuItem2 = document.getElementById("divSubMenuItem2");
  const divSubMenuItem3 = document.getElementById("divSubMenuItem3");
  const divSubMenuItem4 = document.getElementById("divSubMenuItem4");

  if (divSubMenuItem3.style.visibility == "visible") {
    divSubMenuItem.style.visibility = "hidden";
    divAddTable.style.visibility = "hidden";
    divDropDB.style.visibility = "hidden";
    divDropTable.style.visibility = "hidden";
    divAddDB.style.visibility = "hidden";
    divSubMenuItem2.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "hidden";
    divSubMenuItem4.style.visibility = "hidden";
  } else {
    divSubMenuItem.style.visibility = "hidden";
    divAddTable.style.visibility = "hidden";
    divDropDB.style.visibility = "visible";
    divDropTable.style.visibility = "hidden";
    divAddDB.style.visibility = "hidden";
    divSubMenuItem2.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "visible";
    divSubMenuItem4.style.visibility = "hidden";
  }
}
function dropTablePopup() {
  const divAddDB = document.getElementById("divAddDB");
  const divAddTable = document.getElementById("divAddTable");
  const divDropDB = document.getElementById("divDropDB");
  const divDropTable = document.getElementById("divDropTable");
  const divSubMenuItem = document.getElementById("divSubMenuItem");
  const divSubMenuItem2 = document.getElementById("divSubMenuItem2");
  const divSubMenuItem3 = document.getElementById("divSubMenuItem3");
  const divSubMenuItem4 = document.getElementById("divSubMenuItem4");

  if (divSubMenuItem4.style.visibility == "visible") {
    divSubMenuItem.style.visibility = "hidden";
    divAddTable.style.visibility = "hidden";
    divDropDB.style.visibility = "hidden";
    divDropTable.style.visibility = "hidden";
    divAddDB.style.visibility = "hidden";
    divSubMenuItem2.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "hidden";
    divSubMenuItem4.style.visibility = "hidden";
  } else {
    divSubMenuItem.style.visibility = "hidden";
    divAddTable.style.visibility = "hidden";
    divDropDB.style.visibility = "hidden";
    divDropTable.style.visibility = "visible";
    divAddDB.style.visibility = "hidden";
    divSubMenuItem2.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "hidden";
    divSubMenuItem4.style.visibility = "visible";
  }
}
function createDB(newDBName) {
  if (newDBName == "") {
    popupMessageError("Database name is blank");
    return;
  }

  dbName = "master";
  var sqlQuery = "CREATE DATABASE " + newDBName;

  getSQLResults(username, password, dbName, sqlQuery).then(
    function (data) {
      var sqlResults = data.SQLResponse;
      var jsonString = JSON.stringify(sqlResults);

      htmlString = sqlResults;
      lblMsg.innerText = "Database created successfully";
      popupMessage("Database created successfully");
      reload();
    },
    function (error) {}
  );
}

function createDbNoUi(newDBName) {
  if (newDBName == "") {
    popupMessageError("User database name is blank");
    return;
  }
  //const lblMsg = document.getElementById("lblMsg");
  //const txtNewDB = document.getElementById("txtNewDB");
  //dbName = "master";

  var sqlQuery = "CREATE DATABASE " + newDBName;

  getSQLResults(username, password, dbName, sqlQuery).then(
    function (data) {
      var sqlResults = data.SQLResponse;
      var jsonString = JSON.stringify(sqlResults);

      htmlString = sqlResults;
      lblMsg.innerText = "Database created successfully";
      reload();
    },
    function (error) {}
  );
}

function dropDB(dropDBName) {
  if (dropDBName == "") {
    popupMessageError("Database name is blank");
    return;
  }
  //const lblMsg = document.getElementById("lblMsg");
  var sqlQuery = "DROP DATABASE " + dropDBName;

  getSQLResults(username, password, dbName, sqlQuery).then(
    function (data) {
      popupMessage("Database dropped successfully");
      lblMsg.innerText = "Database dropped successfully";
      reload();
    },
    function (error) {}
  );
}
function dropTable(dbName, tableName) {
  if (dbName == "") {
    popupMessageError("Database name is blank");
    return;
  }
  if (tableName == "") {
    popupMessageError("Table name is blank");
    return;
  }
  //const lblMsg = document.getElementById("lblMsg");
  var sqlQuery = "DROP TABLE " + tableName;

  getSQLResults(username, password, dbName, sqlQuery).then(
    function (data) {
      lblMsg.innerText = "Table dropped successfully";
      popupMessage("Table dropped successfully");
      reload();
    },
    function (error) {}
  );
}
function addTable(dbName, scriptOnly) {
  if (dbName == "") {
    popupMessageError("Database name is blank");
    return;
  }

  var addTableScript = "";
  var table = document.getElementById("addClmTable");
  var spanTableName = document.getElementById("spanTableName");
  var sqlType = "";
  const sqlpk = "PRIMARY KEY";
  const sqlnn = "NOT NULL";
  const sqli = "IDENTITY(1,1)";
  const sqluik = "DEFAULT NEWID()";

  var tableName = spanTableName.innerText.trim();
  if (tableName == "" || tableName == "<Table_Name>") {
    popupMessageError("Table name is blank");
    return;
  }

  if (table.rows.length == 1) {
    popupMessageError("No columns entered");
    return;
  }
  var sqlBegin = "CREATE TABLE dbo." + tableName + " (";
  var sqlBeginScript = "CREATE TABLE dbo." + tableName + " (\n";

  var sqlClm = "";
  var sqlClmName = "";
  var sqlClmType = "";
  var sqlClmUINewId = "";
  var sqlClmLength = "";
  var sqlClmNull = "";
  var sqlClmPrimaryKey = "";
  var sqlRow = "";
  var sqlRows = "";
  var sqlRowsScript = "";

  for (var i = 0, row; (row = table.rows[i]); i++) {
    if (row.className != "columnDefs") {
      sqlClmName = "";
      sqlClmType = "";
      sqlClmUINewId = "";
      sqlClmIdentity = "";
      sqlClmNull = "";
      sqlClmPrimaryKey = "";

      for (var j = 0, col; (col = row.cells[j]); j++) {
        switch (col.className) {
          case "columnKeyTd":
            if (col.innerHTML.includes("key.png")) {
              sqlClmPrimaryKey = "PRIMARY KEY";
            }
            break;
          case "columnNameTd":
            sqlClmName = col.innerText.trim();
            break;
          case "columnTypeTd":
            sqlClmType = col.innerText.trim();
            if (sqlClmType.toUpperCase() == "UNIQUEIDENTIFIER") {
              sqlClmUINewId = "DEFAULT NEWID()";
            }
            break;
          case "columnIdentityTd":
            if (!col.innerHTML.includes("unchecked.png")) {
              sqlClmIdentity = "IDENTITY(1,1)";
            }
            break;
          case "columnNullTd":
            if (!col.innerHTML.includes("unchecked.png")) {
              sqlClmNull = "NULL";
            } else {
              sqlClmNull = "NOT NULL";
            }
            break;
          default:
            break;
        }
      }
      sqlRow =
        sqlClmName +
        " " +
        sqlClmType +
        " " +
        sqlClmIdentity +
        " " +
        sqlClmNull +
        " " +
        sqlClmPrimaryKey +
        " " +
        sqlClmUINewId;
      sqlRows += sqlRow + ",";
      sqlRowsScript += sqlRow + ",\n";
    }
  }

  sqlRows = sqlRows.slice(0, -1);

  var sqlEnd = ")";
  var sqlEndScript = "\n);";
  var sqlCommand = sqlBegin + sqlRows + sqlEnd;
  var sqlCommandScript = sqlBeginScript + sqlRowsScript + sqlEndScript;

  if (scriptOnly) {
    return addTableScript;
  } else {
    getSQLResults(username, password, dbName, sqlCommand).then(
      function (data) {
        lblMsg.innerText = "Table created successfully";
        popupMessage(
          "Table " + spanTableName.innerText.trim() + " created successfully."
        );
        reload();
      },
      function (error) {
        console.log(error);
      }
    );
  }
}
function close() {
  divMenu.style.visibility = "hidden";
  btnMenu.innerHTML = "☰&nbsp;";
  divSubMenuItem.style.visibility = "hidden";
  divSubMenuItem2.style.visibility = "hidden";
  divSubMenuItem3.style.visibility = "hidden";
  divSubMenuItem4.style.visibility = "hidden";
  divAddDB.style.visibility = "hidden";
  divAddTable.style.visibility = "hidden";
  divDropDB.style.visibility = "hidden";
  divDropTable.style.visibility = "hidden";
}
function reload() {
  clearTable();
  close();
  initSql();
}
function addColumn() {
  var table = document.getElementById("addClmTable");
  var txtClmName = document.getElementById("txtClmName");
  var sqlType = document.getElementById("sqlType");
  var txtClmLength = document.getElementById("txtClmLength");
  txtClmLength.disabled = false;
  var cbPrimaryKey = document.getElementById("cbPrimaryKey");
  var cbIdentity = document.getElementById("cbIdentity");
  var cbNullable = document.getElementById("cbNullable");

  var error = false;
  var msg = "";
  if (txtClmName.value == "") {
    error = true;
    msg += "Column Name is empty" + "\n";
  }
  if (sqlType.value == "") {
    error = true;
    msg += "DataType is empty" + "\n";
  }
  if (txtClmLength.value == "") {
    error = true;
    msg += "Length is empty" + "\n";
  }
  if (error) {
    popupMessageError(msg);
    return;
  }
  var row = table.insertRow();
  row.className = "dataRow";
  var cell = row.insertCell();
  cell.className = "columnKeyTd";
  if (cbPrimaryKey.checked) {
    cell.innerHTML = "<img src='\\assets\\images\\key.png'/>";
  }

  cell = row.insertCell();
  cell.className = "columnNameTd";
  cell.innerHTML = txtClmName.value;
  cell = row.insertCell();
  cell.className = "columnTypeTd";

  var typeDisplay = "";
  if (sqlType.value == "varchar") {
    typeDisplay = sqlType.value + " (" + txtClmLength.value + ")";
  } else if (sqlType.value == "decimal") {
    typeDisplay = sqlType.value + " (10,4) ";
  } else {
    typeDisplay = sqlType.value;
  }

  cell.innerHTML = typeDisplay;
  cell = row.insertCell();

  cell.className = "columnNullTd";
  if (cbNullable.checked) {
    cell.innerHTML = "<img src='\\assets\\images\\checked.png' />";
  } else {
    cell.innerHTML = "<img src='\\assets\\images\\unchecked.png' />";
  }
  cell = row.insertCell();

  cell.className = "columnIdentityTd";
  if (cbIdentity.checked) {
    cell.innerHTML = "<img src='\\assets\\images\\checked.png' />";
  } else {
    cell.innerHTML = "<img src='\\assets\\images\\unchecked.png' />";
  }
  cell = row.insertCell();

  txtClmName.value = "";
  txtClmLength.value = "";
  sqlType.value = "";
  cbPrimaryKey.checked = false;
  cbNullable.checked = false;
  cbIdentity.checked = false;
}
function clearTable() {
  var table = document.getElementById("addClmTable");
  var txtClmName = document.getElementById("txtClmName");
  var sqlType = document.getElementById("sqlType");
  var txtClmLength = document.getElementById("txtClmLength");
  var cbPrimaryKey = document.getElementById("cbPrimaryKey");
  var cbIdentity = document.getElementById("cbIdentity");
  var cbNullable = document.getElementById("cbNullable");

  txtClmName.value = "";
  txtClmLength.value = "";
  sqlType.value = "";
  cbPrimaryKey.checked = false;
  cbNullable.checked = false;
  cbIdentity.checked = false;

  var rowCount = table.rows.length;
  for (let i = 0; i < rowCount; i++) {
    if (table.rows.length > 1) {
      table.deleteRow(table.rows.length - 1);
    }
  }
}
function onTableNameInput(e) {
  var spanTableName = document.getElementById("spanTableName");
  spanTableName.innerHTML = e.value;
  spanTableName.style.color = "#000000";
}
function onTxtClmLengthInput(e) {
  var txtClmLength = document.getElementById("txtClmLength");
  if (Number(txtClmLength.value) > 8000) {
    txtClmLength.value = 8000;
  }
}
function clmDefaults() {
  var sqlType = document.getElementById("sqlType");
  var txtClmLength = document.getElementById("txtClmLength");
  var cbPrimaryKey = document.getElementById("cbPrimaryKey");
  var cbIdentity = document.getElementById("cbIdentity");
  var cbNullable = document.getElementById("cbNullable");

  txtClmLength.disabled = false;
  cbNullable.disabled = false;
  txtClmLength.value = "";

  switch (sqlType.value) {
    case "uniqueidentifier":
      txtClmLength.value = "16";
      txtClmLength.disabled = true;
      cbNullable.disabled = true;
      cbPrimaryKey.checked = true;
      break;
    case "int":
      txtClmLength.value = "4";
      txtClmLength.disabled = true;
      break;
    case "varchar":
      txtClmLength.max = "8000";
      txtClmLength.value = "50";
      break;
    case "datetime":
      txtClmLength.value = "16";
      txtClmLength.disabled = true;
      break;
    case "decimal":
      txtClmLength.value = "16";
      txtClmLength.disabled = true;
      break;
    case "bit":
      txtClmLength.value = "1";
      txtClmLength.disabled = true;
      break;
    default:
      break;
  }
}
addEventListener("mousedown", (event) => {});
onmousedown = (event) => {
  var x = event.clientX;
  var y = event.clientY;
  elements = document.elementsFromPoint(x, y);
  const divMenu = document.getElementById("divMenu");
  var divMenuVisibility = divMenu.style.visibility;
  const divSubMenuItem = document.getElementById("divSubMenuItem");
  const divSubMenuItem2 = document.getElementById("divSubMenuItem2");
  const divSubMenuItem3 = document.getElementById("divSubMenuItem3");
  const divSubMenuItem4 = document.getElementById("divSubMenuItem4");

  var hoveringOverDivMenu = false;
  var hoveringOverBtnMenu = false;
  var hoveringOverSubMenuItem = false;
  var hoveringOverSubMenuItem2 = false;
  var hoveringOverSubMenuItem3 = false;
  var hoveringOverSubMenuItem4 = false;

  var elementId = "";
  for (let i = 0; i < elements.length; i++) {
    elementId = elements[i].id.toString();
    if (elementId == "divMenu") {
      hoveringOverDivMenu = true;
    }
    if (elementId == "btnMenu") {
      hoveringOverBtnMenu = true;
    }
    if (elementId == "divSubMenuItem") {
      hoveringOverSubMenuItem = true;
    }
    if (elementId == "divSubMenuItem2") {
      hoveringOverSubMenuItem2 = true;
    }
    if (elementId == "divSubMenuItem3") {
      hoveringOverSubMenuItem3 = true;
    }
    if (elementId == "divSubMenuItem4") {
      hoveringOverSubMenuItem4 = true;
    }
  }

  const divAddDB = document.getElementById("divAddDB");
  const divAddTable = document.getElementById("divAddTable");
  const divDropDB = document.getElementById("divDropDB");
  const divDropTable = document.getElementById("divDropTable");

  if (
    divMenuVisibility == "visible" &&
    hoveringOverDivMenu == false &&
    hoveringOverSubMenuItem == false &&
    hoveringOverSubMenuItem2 == false &&
    hoveringOverSubMenuItem3 == false &&
    hoveringOverSubMenuItem4 == false &&
    hoveringOverBtnMenu == false
  ) {
    divMenu.style.visibility = "hidden";
    btnMenu.innerHTML = "☰&nbsp;";
    divSubMenuItem.style.visibility = "hidden";
    divSubMenuItem2.style.visibility = "hidden";
    divSubMenuItem3.style.visibility = "hidden";
    divSubMenuItem4.style.visibility = "hidden";
    divAddDB.style.visibility = "hidden";
    divAddTable.style.visibility = "hidden";
    divDropDB.style.visibility = "hidden";
    divDropTable.style.visibility = "hidden";
  }

  if (hoveringOverBtnMenu == true) {
  }
};
let verticalDividerY;
function getElementPosition(element) {
  return element.getBoundingClientRect();
}
function getAdjustedYCoordinate(el) {
  var bodyRect = document.body.getBoundingClientRect();
  var elemRect = el.getBoundingClientRect();
  offset = elemRect.top - bodyRect.top;
  return offset;
}
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
function removeControlChars(rawString) {
  if (debug) {
  }
  var trimmedString = rawString.toString().trim();
  var sqlResultsLength = trimmedString.length;
  let firstChar = trimmedString.slice(0, 1);
  var strRemoveFirst = trimmedString;
  if (firstChar == '"') {
    strRemoveFirst = trimmedString(1, trimmedString.length);
  }
  let lastChar = strRemoveFirst.substr(trimmedString.length - 1);
  var strRemoveLast = strRemoveFirst;
  if (lastChar == '"') {
    strRemoveLast = strRemoveFirst(0, trimmedString.length - 1);
  }
  var cleanedString1 = strRemoveLast.replaceAll("\\\\\"","");
  var cleanedString2 = cleanedString1.replaceAll(/\\n/g, "");
  var cleanedString3 = cleanedString2.replace(/\\/g, "");
  //var cleanedString3 = cleanedString2;
  var cleanedString4 = cleanedString3
    .replaceAll('"[', "[")
    .replaceAll('"]', "]");
  //var cleanedString5 = cleanedString4.replaceAll(/"/g, '\\"');
  var cleanedString5 = cleanedString4;
  var lastArrayBracket = cleanedString5.lastIndexOf("]");
  var closingBrackerChar = "}";
  var lastClosingBracket = cleanedString5.lastIndexOf(closingBrackerChar);

  var firstPart = "";
  var secondPart = "";
  var finalString = "";

  var hasArray = false;
  if (cleanedString4.includes("[")) {
    hasArray = true;
  }

  if (hasArray) {
    if (lastArrayBracket == -1) {
      firstPart = cleanedString4.substring(0, lastClosingBracket + 1);
      finalString = firstPart + "]}";
    } else {
      firstPart = cleanedString4.substring(0, lastArrayBracket + 1);
      secondPart = cleanedString4.substring(
        lastClosingBracket - 1,
        cleanedString4.length
      );
      var finalString = firstPart + "}";
    }
  } else {
    finalString = cleanedString4;
  }

  try {
    if (debug) {
      console.log(finalString);
    }
    return JSON.parse(finalString);
  } catch (error) {
    console.error(error);
    console.log("---------------------------");
    console.log("rawString:                 " + rawString);
    //console.log("rawString json stringified " + JSON.stringify(rawString));
    //console.log("finalString:               " + finalString);
  }
}
document.getElementById("tabs").onclick = function (event) {
  var target = event.target;
  if (target.className == "tab") {
    for (var i = 0; i < tab.length; i++) {
      if (target == tab[i]) {
        showTabsContent(i);
        break;
      }
    }
  }
};
var tabContent;
var tab;
function hideTabsContent(a) {
  for (var i = a; i < tabContent.length; i++) {
    tabContent[i].classList.remove("show");
    tabContent[i].classList.add("hide");
    tab[i].classList.remove("whiteborder");
  }
}
function showTabsContent(b) {
  if (tabContent[b].classList.contains("hide")) {
    hideTabsContent(0);
    tab[b].classList.add("whiteborder");
    tabContent[b].classList.remove("hide");
    tabContent[b].classList.add("show");
  }
}
function popupMessage(msg, myYes) {
  var alertBox = $("#alert");
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
function popupMessageError(msg, myYes) {
  var alertBox = $("#alertError");
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
window.addEventListener("DOMContentLoaded", initSql);

//#region JQuery
$(function () {
  $("#sqlDiv").draggable({
    handle: "#divHeader",
  });
});

$("#btnConnString").on("click", function () {
  setTimeout(() => {
    $("#alert").fadeOut(1500, "linear");
  }, 3000);
});
//#endregion


