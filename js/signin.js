const imgLogoMenu = document.getElementById("imgLogoMenu");
const divGlow = document.getElementById("divGlow");
const divHome = document.getElementById("divHome");

const lightning1 = document.getElementById("lightning1");

function initIndex() {

  var step1 = 1500;
  var step2 = Number(step1 + 1000);
  var step3 = Number(step2 + 500);
  var step4 = Number(step3 + 500);
  var step5 = Number(step4 + 200);
  var step6 = Number(step5 + 200);
  var step7 = Number(step6 + 1000);

  setTimeout(() => {
    $("#divDim")
      .css({ visibility: "visible" })
      .animate({ opacity: 0.0 }, { duration: 1500 });
  }, 1);

  setTimeout(() => {
    $("#divDim")
      .css({ visibility: "hidden" })
  }, 1500);



  setTimeout(() => {
    $("#lightning0")
      .css({ visibility: "visible" })
      .animate({ opacity: 1.0 }, { duration: 100 })
      .animate({ opacity: 0.0 }, { duration: 1400 });
  }, step1);

  // setTimeout(() => {
  //   $("#lightning1")
  //     .css({ visibility: "visible" })
  //     .css({ opacity: 1.0 })
  //     animate({ opacity: 0.0 }, { duration: 800 });
  // }, step2);

  // return;
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


}


//const signInLogo = document.getElementById("divHome"); 
divHome.addEventListener("mouseenter",function(){
  console.log('mouse enter');
  $("#divGlow").animate({ opacity: 0.6 });
});
divHome.addEventListener("mouseenter", logoFadeIn);
divHome.addEventListener("mouseleave", logoFadeOut);


function logoFadeIn() {
  $("#divGlow").animate({ opacity: 0.6 });
}
function logoFadeOut() {
  $("#divGlow").animate({ opacity: 0.0 });
}

window.onload = (event) => {
  //log("index.js load event")
  init();

  initIndex();
};


function init(){

  var styles = ["animate4", "animate1", "animate2", "animate3"];
  var scales = ["scale1", "scale2", "scale3"];
  var opacities = ["opacity1", "opacity1", "opacity1", "opacity2", "opacity2", "opacity3"];

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var stars = "";
  var count = 300;
  var widthWindow = window.innerWidth;
  var heightWindow = window.innerHeight;

  for (var i = 0; i < count; i++) {
    stars += "<span class='star " + styles[rand(0, 4)] + " " + opacities[rand(0, 6)] + " "
    + scales[rand(0, 3)] + "' style='animation-delay: ." + rand(0, 9)+ "s; left: "
    + rand(0, widthWindow) + "px; top: " + rand(0, heightWindow) + "px;'></span>";
  }

  document.querySelector(".sky").innerHTML = stars;

  }


window.onresize = init;




divHome.addEventListener("click", (e) => {
  
  window.location.assign("/");
});


