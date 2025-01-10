const downloadZipImg = document.getElementById("downloadZipImg");
const aDownloadZip = document.getElementById("aDownloadZip");
const lblAPIName = document.getElementById("lblAPIName");
const scaledIFrame = document.getElementById("scaledIFrame");
const previewDiv = document.getElementById("previewDiv");
const btnClearAPI = document.getElementById("btnClearAPI");
const divDownloadZip = document.getElementById("divDownloadZip");
const btnCreateNewAPI = document.getElementById("btnCreateNewAPI");

window.addEventListener("load", (event) => {
  let apiRunning;
  let apiRunning2;

  setTimeout(() => {
    checkAPIRunning();
  }, 3000);
})

function checkAPIRunning() {
  let apiRunningResp = "";
  let isApiRunning = null;

  testAPI("6").then(
    function(value)
    {
      apiRunningResp = JSON.parse(value);
      isApiRunning = apiRunningResp.CmdResponse;
      if (isApiRunning == "1")
      {
        previewDiv.style.visibility = "visible";
        divDownloadZip.style.visibility = "visible";

        let apiNameResp = "";
        let apiName = null;
        testAPI("8").then(
          function(value)
          {
            apiNameResp = JSON.parse(value);
            apiName = apiNameResp.CmdResponse;
            setZip(apiName);
            setIFrame();
            returnval = true;
          },
          function(error) {
            console.log('Get API Name Error');
            console.log(error);
          });
      }
      else
      {
        previewDiv.style.visibility = "hidden";
        divDownloadZip.style.visibility = "hidden";
        btnCreateNewAPI.style.visibility = "hidden";

        //setNotReady();

        setTimeout(() => {
          //console.log("2nd run");

          testAPI("6").then(
            function(value)
            {
              apiRunningResp = JSON.parse(value);
              isApiRunning = apiRunningResp.CmdResponse;
              if (isApiRunning == "1")
              {
                previewDiv.style.visibility = "visible";
                divDownloadZip.style.visibility = "visible";

                let apiNameResp = "";
                let apiName = null;
                testAPI("8").then(
                  function(value)
                  {
                    apiNameResp = JSON.parse(value);
                    apiName = apiNameResp.CmdResponse;
                    setZip(apiName);
                    setIFrame();
                    returnval = true;
                  },
                  function(error) {
                    console.log('Get API Name Error');
                    console.log(error);
                  });
              }
              else
              {
                previewDiv.style.visibility = "hidden";
                divDownloadZip.style.visibility = "hidden";
                setNotReady();
              }
          },
          function(error) {
            console.log(error);
            previewDiv.style.visibility = "hidden";
          });

       }, 3000);
      }
    },
    function(error) {
      console.log(error);
      previewDiv.style.visibility = "hidden";
    });
}

function setZip(testAPIName) {
    testAPIBaseURL = "https://testgen.net";
    lblAPIName.innerText = testAPIName;

    let apiResp = null;
    testAPI("11").then(
    function(value)
    {
      apiResp = JSON.parse(value);
      //  console.log(apiResp);

//  var downloadZipLink = testAPIBaseURL + "/" + testAPIName + ".zip";
  var downloadZipLink = apiResp.CmdResponse;
    downloadZipImg.href = downloadZipLink;
    downloadZipImg.target = "_blank";
    aDownloadZip.href = downloadZipLink;
    aDownloadZip.innerText = testAPIName + ".zip";
    aDownloadZip.target = "_blank";

     // setTimeout(() => {
//      lblAPICleared.style.visibility = "visible";
  //    lblAPICleared.innerText = "API archived.";
    //  removeCookie("tab");
  //     fadeToBlack();
 //      }, 1500);
      },
      function(error) {
        console.log(error);
      })
}

function setNotReady() {
  divViewAPIHeader.style.height = "10vh";
  divViewAPIHeader.style.width = "60vw";
  divViewAPIHeader.style.top = "20vh";
  btnInfoCircle.disabled = true;
  lblAPIName.innerHTML = "No API currently running.<br/> &nbsp;Please see <a target=\"_blank\" href=\"https://apigen.net/docs/instructions.html\"> documentation </a> to generate a new API.";
  btnCreateNewAPI.style.visibility = "hidden";
}

function setIFrame() {
  scaledIFrame.src = "https://testgen.net/index.html";
}

btnClearAPI.addEventListener("click", () => {

  let apiResp = null;
      testAPI("10").then(
      function(value)
      {
        apiResp = JSON.parse(value);
        console.log('archive api resp');
        console.log(apiResp);

            setTimeout(() => {
              lblAPICleared.style.visibility = "visible";
              lblAPICleared.innerText = "API archived.";
              removeCookie("tab");
              fadeToBlack();
            }, 1500);
      },
      function(error) {
        console.log(error);
      })
});

function archiveAPI() {
  testAPI("10").then(
    function(value)
    {
      apiResp = JSON.parse(value);
      console.log('archive api resp');
      console.log(apiResp);
      //deleteAPI();
    },
    function(error) {
      console.log(error);
    })
}

function stopTestApi() {
  testAPI("10").then(
    function(value)
    {
      apiResp = JSON.parse(value);
      console.log('archive api resp');
      console.log(apiResp);
      //deleteAPI();
    },
    function(error) {
      console.log(error);
    })
}

function deleteAPI() {
  testAPI("7").then(
    function(value)
    {
      console.log('delete resp');
      apiResp = JSON.parse(value);
      console.log(apiResp);

    },
    function(error) {
      console.log(error);
    })
}

btnCreateNewAPI.addEventListener("click", () => {
  document.getElementById("btnInfoCircle").click();
});
