//mouse click any element to get position info
const divStatus = document.createElement('div');
const title = document.createElement("div");
const controlBar = document.createElement("div");
const mouse = document.createElement("span"); 
const mouseHTML = document.createElement('span'); 
const zoomHTML = document.createElement("span"); 
const xyInfo = document.createElement('span'); 
const displayInfo = document.createElement('span'); 
const divLog = document.createElement("div");
const divider = document.createElement("span");
const logItem = document.createElement("span");
const btnClear = document.createElement("button");
const imgShortcut = document.createElement("img");
const btnMinimize = document.getElementById("minimize");
var style = document.createElement("style");

const boxShadow1 = "-1px -2px 5px 0 #5b5b5b";
const boxShadow2 = "0px 2px 5px 0 #999999";

const initDiagnostics = async () => {
  controlBar.style.position = "absolute";
  controlBar.style.right = "10px";
  controlBar.style.bottom = "410px";
  controlBar.style.zIndex = "1001";
  controlBar.style.width = "350px";
  controlBar.style["boxShadow"] = boxShadow1;
  controlBar.innerHTML = `
    <table>
      <tr>
        <td>&nbsp;Diagnostics</td>
        <td width="25%">&nbsp;</td>
        <td align="right" width="20%">
          <span id="minimize">🗕</span>
        </td>
        <td align="right">
          <span id="maximize">🗗</span>
        </td>
        <td align="right">
          <span id="exit">🗙</span>
        </td>
      </tr>
    </table>`;
  controlBar.style.backgroundColor = "#202020";
  controlBar.style.opacity = "1.0";
  controlBar.style.fontSize = "9pt";
  controlBar.style.fontFamily = "Monospace";
  controlBar.style.color = "#FFFFFF";
  controlBar.style.padding = 0;
  controlBar.style.padding = "2px";
  controlBar.style.verticalAlign = "top";
  controlBar.style.zIndex = "1001";
  controlBar.style.borderTop = "solid 1px #C0C0C0";
  controlBar.style.borderLeft = "solid 1px #C0C0C0";
  controlBar.style.borderRight = "solid 1px #C0C0C0";
  document.body.appendChild(controlBar); 

  divStatus.id = "divStatus";
  divStatus.style.position = "absolute";
  divStatus.style.right = "10px";
  divStatus.style.bottom = "10px";
  //divStatus.style.border = "solid 1px #202020";
  divStatus.style.borderTop = "none"; 
  divStatus.style.height = "400px";
  divStatus.style.width = "350px";
  divStatus.style.backgroundColor = "#F5F5F5";
  divStatus.style.zIndex = "1000";
  divStatus.style["boxShadow"] = boxShadow2;
  divStatus.style.paddingTop = "10px";
  divStatus.style.opacity = "0.9";
  divStatus.style.lineHeight = "1";
  divStatus.style.overflow = "auto";  
  divStatus.style.borderLeft = "solid 1px #C0C0C0";
  divStatus.style.borderRight = "solid 1px #C0C0C0";
  divStatus.style.borderBottom = "solid 1px #C0C0C0";
  document.body.appendChild(divStatus); 
  
  mouseHTML.style.fontFamily = "Monospace";
  mouseHTML.style.fontSize = "12pt";
  mouseHTML.innerHTML = "&nbsp;🖰&nbsp;";
  mouseHTML.style.color = "#202020";
  mouseHTML.style.lineHeight = "1.5";
  mouseHTML.style.margin = "3px";

  let zoom = (((window.outerWidth - 10) / window.innerWidth) * 100).toFixed(1);
  zoomHTML.style.fontFamily = "Monospace";
  zoomHTML.style.fontSize = "9pt";
  zoomHTML.innerHTML = "&nbsp;&nbsp;🔍+/-&nbsp;" + zoom + "%&nbsp;";
  zoomHTML.style.color = "#202020";
  zoomHTML.style.lineHeight = "1.5";
  zoomHTML.style.float = "right";
  
  xyInfo.style.fontFamily = "Monospace";
  xyInfo.style.fontSize = "8pt";
  xyInfo.style.lineHeight = "0.5";

  divider.innerHTML = "<hr>";
  divider.style.margin = "3px";

  divLog.style.fontFamily = "Monospace";
  divLog.style.fontSize = "8pt";
  divLog.style.lineHeight = "1.2";

  logItem.style.fontFamily = "Monospace";
  logItem.style.fontSize = "8pt";
  logItem.style.lineHeight = "0.5";

  displayInfo.style = "Monospace";
  displayInfo.style.fontSize = "8pt";
  displayInfo.style.lineHeight = "0.5";
  displayInfo.innerHTML = "🖵"; 

  btnClear.style.fontFamily = "Monospace";
  btnClear.style.fontSize = "9pt";
  btnClear.innerHTML = "Clear"
  btnClear.style.width="3vw";
  btnClear.style.height="2.5vh";

  imgShortcut.style.position = "absolute";
  imgShortcut.style.right = "40px";
  imgShortcut.style.bottom = "2px";
  imgShortcut.style.zIndex = "1002";
  imgShortcut.id = "imgShortcut";
  imgShortcut.src = "assets/images/shortcutDiagnosticsIcon.png";
  imgShortcut.style.width = "60px";
  imgShortcut.style.visibility = "hidden";
  document.body.appendChild(imgShortcut); 

  divStatus.appendChild(mouseHTML); 
  divStatus.appendChild(xyInfo);
  divStatus.appendChild(zoomHTML); 
  divStatus.appendChild(divider);
  divStatus.appendChild(btnClear); 
  divStatus.appendChild(divLog); 

  $('#divStatus').animate({ opacity: 1.0 },{ duration:3000});

  document.head.appendChild(style);
  document.head.innerHTML += 
`
<style>
  .diagnosticsTable {
    width: 100%;
  }
  .diagnosticsControl {
    position:absolute;
    right: 2vw;
    top: 80vh;
    width:100px;
    z-index:1001;
  }
  #minimize {
    font-size:1rem;
    margin-bottom:2vh;
    border: solid 1px transparent;
  }
  #minimize:hover {
    border: solid 1px gainsboro;
  }
  #maximize {
    font-size:0.8rem;
    border: solid 1px transparent;
  }
  #maximize:hover {
    border: solid 1px gainsboro;
  }
  #exit {
    margin-right:0.3vw;
    border: solid 1px transparent;
  }
  #exit:hover {
    border: fixed solid 5px red;
    background: rgba(255, 0, 0, .9);
    border-right-width: fixed 10px;
  }
</style>
`;
}

btnClear.addEventListener("click", () => {
  clear();
});

$(document).ready(function () {
  setTimeout(() => {
    $("#minimize").click(function(){
      divStatus.style.visibility = "hidden";
      controlBar.style.bottom = "1.284vh";
    });
  }, 1000);
});

$(document).ready(function () {
  setTimeout(() => {
    $("#maximize").click(function(){
      divStatus.style.visibility = "visible";
      controlBar.style.bottom = "52.632vh";
    });
  }, 1000);
});

$(document).ready(function () {
  setTimeout(() => {
    $("#exit").click(function(){
      divStatus.style.visibility = "hidden";
      controlBar.style.visibility = "hidden";
      imgShortcut.style.visibility = "visible";
    });
  }, 1000);
});

$(document).ready(function(){
  setTimeout(() => {
    $("#imgShortcut").dblclick(function(){
      divStatus.style.visibility = "visible";
      controlBar.style.visibility = "visible";
      imgShortcut.style.visibility = "hidden";
      controlBar.style.bottom = "52.632vh";
    });
  }, 1000);
});

function log(text) {
  //if diagnostics on
  divLog.appendChild(logItem); 
  logItem.innerHTML += "&nbsp;🢝 " + text + "<br/>";
}

function logline()
{
  divStatus.appendChild(logItem); 
  logItem.innerHTML += "<br/>";
}

function getDeviceInfo() {
  updatePixelRatio();
  getScreenWidthHeight();
}

function clear()
{
  //clear log
  divLog.innerHTML = "";
}

window.addEventListener("load", (event) => {
  initDiagnostics();
  getDiagnosticData();
});

window.addEventListener('mousemove', (e) => {
  var vw = (e.clientX  / window.innerWidth).toFixed(3); 
  var vy = (e.clientY  / window.innerHeight).toFixed(3);
  vw = (100*vw).toFixed(1);
  vy = (100*vy).toFixed(1);
  xyInfo.innerHTML= e.clientX + ", " + e.clientY + "&nbsp;&nbsp;|&nbsp;&nbsp;" + vw + ", " + vy;
});

window.addEventListener("resize", windowResized);
function windowResized() {
  refreshData();
}

function refreshData() {
  //getDiagnosticData();
}

function getDiagnosticData() {
  getDeviceInfo();
}

function getWindowZoomPct() {
  let zoom = ((window.outerWidth - 10) / window.innerWidth) * 100;
  return zoom;
}

function isMobile() {
  var check = false;
  (function(a){
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
      check = true;
  })(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function isMobileTablet(){
  var check = false;
  (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
          check = true;
  })(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function getUserAgent(){
  let userAgent = navigator.userAgent; 
}

let remove = null;
const updatePixelRatio = () => {
  if (remove != null) {
    remove();
  }
  const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
  const media = matchMedia(mqString);
  media.addEventListener("change", updatePixelRatio);
  remove = () => {
    media.removeEventListener("change", updatePixelRatio);
  };

  log(`devicePixelRatio: ${window.devicePixelRatio}`);
};

function getScreenWidthHeight()
{
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
  var xyinfo = "";
  log("screen width/height :" + screenWidth + " "  +  screenHeight);

  var w = window.innerWidth;
  var h = window.innerHeight;
  log("viewport width/height :" + w + " "  +  h);
}

navigator.userAgentData.getHighEntropyValues(["platformVersion"])
 .then(ua => {
   if (navigator.userAgentData.platform === "Windows") {
     const majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0]);
     if (majorPlatformVersion >= 13) {
       log("Windows 11 or later");
      }
      else if (majorPlatformVersion > 0) {
        log("Windows 10");
      }
      else {
        log("Before Windows 10");
      }
   }
   else {
     //log("Not running on Windows");
   }
 });

const userAgent = window.navigator.userAgent;
const platform = window.navigator.platform;
// const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);

// const deviceID = `${userAgent}-${platform}-${randomString}`;
// log("device id :" + JSON.stringify(deviceID));

$.getJSON("https://api.ipify.org?format=json",
function (data) {

    // Setting text of element P with id gfg
    log("IP Address : " +data.ip);
})

function json(url) {
  return fetch(url).then(res => res.json());
}

let apiKey = '918e831809f638f0ba752aea32d3ebb1060710e9664b2db8742a702b';
json(`https://api.ipdata.co?api-key=${apiKey}`).then(data => {
  log(data.ip);
  log(data.city);
  log(data.country_code);
  // so many more properties
});
// Media Queries for laptops are a bit of a juggernaut. Instead of targeting specific devices, try specifying a general screen size range, then distinguishing between retina and non-retina screens.

let platform1 = navigator.platform;
log('Platform: ' +  platform1);

var OSName="unknown";
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

log('Operating System: ' + OSName);
//log('navigator.appVersion'); log(navigator.appVersion);


if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  //log("enumerateDevices() not supported.");
} else {
  // List cameras and microphones.
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        //log("enumerated device : " + device.toJSON());
        //console.log("enumerated device ↓ :");
        //console.log(device.toJSON());
      });
    })
    .catch((err) => {
      log(`${err.name}: ${err.message}`);
    });
}

// Simple arrows
// 2190	 ← 	LEFTWARDS ARROW
//  	 	→	20EA ◌⃪ combining leftwards arrow overlay
// 2191	 ↑ 	UPWARDS ARROW
//  	 	•	IPA: egressive airflow
// 2192	 → 	RIGHTWARDS ARROW
//  	 	=	z notation total function
// 2193	 ↓ 	DOWNWARDS ARROW
//  	 	•	IPA: ingressive airflow
// 2194	 ↔ 	LEFT RIGHT ARROW
//  	 	=	z notation relation
// 2195	 ↕ 	UP DOWN ARROW
// 2196	 ↖ 	NORTH WEST ARROW
// 2197	 ↗ 	NORTH EAST ARROW
// 2198	 ↘ 	SOUTH EAST ARROW
// 2199	 ↙ 	SOUTH WEST ARROW

//}

// (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
//   key: "AIzaSyCE6liNyf8ASt6VNC-W21nJDOppw8mZLY0",
//   v: "weekly",
//   // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
//   // Add other bootstrap parameters as needed, using camel case.
// });

// let map;

// async function initMap() {
//   const { Map } = await google.maps.importLibrary("maps");

//   map = new Map(document.getElementById("mapDiv"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// }

// initMap();



// /* ----------- Non-Retina Screens ----------- */
// @media screen 
//   and (min-device-width: 1200px) 
//   and (max-device-width: 1600px) 
//   and (-webkit-min-device-pixel-ratio: 1) { 
// }

// /* ----------- Retina Screens ----------- */
// @media screen 
//   and (min-device-width: 1200px) 
//   and (max-device-width: 1600px) 
//   and (-webkit-min-device-pixel-ratio: 2)
//   and (min-resolution: 192dpi) { 
// }


// For Mobile devices: 320px-480px
// For Tablets or iPad: 480px - 768px
// For Laptop or small-size screen: 768px -1024px
// For Desktop or large-size screen: 1024px -1200px
// For Extra-large size device: 1200px and more

// https://www.geeksforgeeks.org/css3-media-query-for-all-devices/



// //#region diagnostics
// function checkPosition(element){
//   var rect = element.getBoundingClientRect();
//   var pos = element.style.position;
//   var regLeft = element.style.left;
//   var regTop = element.style.top;
//   var leftjq = $("#" + element.id).offset().left - $(document).scrollTop();
//   var topjq = $("#" + element.id).offset().top - $(document).scrollTop();
//   var computedStyle = window.getComputedStyle(element); //.getPropertyValue('font-size');
//   var computeLeft = computedStyle.left.toString().replace("px","");
//   var computeTop = computedStyle.top.toString().replace("px","");
// }
// function getComputedCSS(element) {
//   return window.getComputedStyle(element); 
// }
// function getElementPositionJS(element) {
//   var rect = element.getBoundingClientRect();
//   //log("regular js/css left/x: " + rect.left);
//   return rect;
// }
// function getOneCharWidth(fontDef){
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
//   var fontIsMonospaced = false;

//   //ctx.font = '0 Monospace';
//   ctx.font = fontDef;
//   const charWidthX = ctx.measureText('X').width;
//   const charWidthi = ctx.measureText('i').width;
//   if (charWidthX == charWidthi) {
//     fontIsMonospaced = true;
//   }
//   return charWidthX
// }
// //#endregion
