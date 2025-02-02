var testAPIBaseURL = "https://testgen.net";
const apiGenBaseURL = apiBaseURL;

// Legend
// ------------------
// 1 - Check API Created
// 2 - Check API Built
// 3 - Build TestAPI
// 4 - Start TestAPI
// 5 - Stop TestAPI
// 6 - Check API Running
// 7 - Delete Test API
// 8 - Get TestAPI Name
// 9 - Check Zip File Exists
// 10 - Archive Zip File
// h - help menu

function checkAPICreated(){
  testAPI("1").then(
    function(value) 
    { 
      resp = value;
      console.log(resp);
    },
    function(error) { 
      console.log('Build API Error');
      console.log(error);
    });
}

function checkAPIBuilt(){
  testAPI("2").then(
    function(value) 
    { 
      resp = value;
      console.log(resp);
    },
    function(error) { 
      console.log('Build API Error');
      console.log(error);
    });
}

async function buildAPI(){

  testAPI("3").then(
    function(value) 
    { 
      resp = value;

      if (resp)
      {
        return resp;
      }
    },
    function(error) { 
      console.log('Build API Error');
      console.log(error);
      return null;
    });
}

function stopAPI(){

  testAPI("3").then(
    function(value) 
    { 
      resp = value;
    },
    function(error) { 
      console.log('Stop API Error');
      console.log(error);
    });
}

function archiveAPI(){

  testAPI("9").then(
    function(value) 
    { 
      resp = value;
    },
    function(error) { 
      console.log('Archive API Error');
      console.log(error);
    });
}

function deleteAPI(){

  testAPI("5").then(
    function(value) 
    { 
      resp = value;
    },
    function(error) { 
      console.log('Delete API Error');
      console.log(error);
    });
}

function startAPI(){

  testAPI("2").then(
    function(value) 
    { 
      resp = value;
    },
    function(error) { 
      console.log('Stop API Error');
      console.log(error);
    });
}

async function testAPI(cmd) {
  var jsonString;
  jsonString = "{\"commandText\":" + "\"" + cmd + "\"}"; 
  
  var JSONStringifiedText = JSON.stringify(jsonString);
  var JSONParsedJSONStringifiedText = JSON.parse(JSONStringifiedText);
  var bodyPostJSON = JSONParsedJSONStringifiedText;

  return await fetch(apiBaseURL + "/APIGen/TestAPICommand", {
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

