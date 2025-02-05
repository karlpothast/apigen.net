var testAPIBaseURL = "https://testgen.net";
const apiGenBaseURL = apiBaseURL;


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

