
const flipInner2 = document.getElementById("flipInner2");
const flipInner2API = document.getElementById("flipInner2API");
const btnCloseInfoWindow = document.getElementById("btnCloseInfoWindow");
const btnCloseCreateAPIWindow = document.getElementById("btnCloseCreateAPIWindow");
const textWrapper = document.getElementById("textWrapper");
const textWrapperAPI = document.getElementById("textWrapperAPI");
const flipCard = document.getElementById("flipCard");
const divInfo = document.getElementById("divInfo");
const tableNewApiInfo = document.getElementById("tableNewApiInfo");
const tdInfo1 = document.getElementById("tdInfo1");
const modalImg = document.getElementById("modalImg");
const divNewApiInfo = document.getElementById("divNewApiInfo");

btnCloseInfoWindow.addEventListener("click", function(){
  closeSqlInfoWindow();
});

btnCloseCreateAPIWindow.addEventListener("click", function(){
  closeApiInfoWindow();
});

const btnInfoCircle = document.getElementById("btnInfoCircle");
btnInfoCircle.addEventListener("click", easeIn);
btnInfoCircle.addEventListener("mouseenter", btnInfoCircleHighlight);
btnInfoCircle.addEventListener("mouseleave", btnInfoCircleNormal);

function btnInfoCircleHighlight() {
  btnInfoCircle.style.transform="translateY(-0.14vw)";
  btnInfoCircle.style.transition = ".3s";
  btnInfoCircle.style.boxShadow = "0 0.5vh 0.4vw 0.2vh #e5ff60";
}
function btnInfoCircleNormal() {
  btnInfoCircle.style.transform="translateY(0.06vw)";
  btnInfoCircle.style.transition = ".3s";
  btnInfoCircle.style.boxShadow = "none";
}

function easeIn() {
    switch (currentTab) {
      case "sql":
        var element = divInfo;
        var elementCss = window.getComputedStyle(element, null);

        if (elementCss.display.toString().trim() == "none") 
        { openSqlInfoWindow();} 
        else 
        { closeSqlInfoWindow();}

        break;
      case "apigen":
        break;
      case "viewapi":
        var element = divNewApiInfo;
        var elementCss = window.getComputedStyle(element, null);

        if (elementCss.display.toString().trim()  == "none") 
        { openApiInfoWindow();}
         else
        { closeApiInfoWindow();}

        break;  
      default:
        break;
    }
}

function openApiInfoWindow() {


  // setTimeout(() => {$('#flipCard').css({visibility: "visible"})}, 0);
  // setTimeout(() => {$('#flipCard').animate({opacity: 1.0},{duration:500})}, 0);
  // $("#flipInner2").addClass("flip-card-hover");
  textWrapperAPI.style.display = "block";
  apiInfoText.style.display = "block";
  apiInfoText.style.visibility = "visible";
  btnInfoCircle.style.opacity = "0.5";
  setTimeout(() => {$('#divInfo').css({display: "none"})}, 0);
  setTimeout(() => {$('#divNewApiInfo').css({display: "block"})}, 0);
  setTimeout(() => {$('#divNewApiInfo').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#divDim').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#divDim').css({opacity: 0.7})}, 0);
  setTimeout(() => {$('#app').addClass("blurred"); }, 0);
  setTimeout(() => {$('#flipCardAPI').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#flipCardAPI').animate({opacity: 1.0},{duration:500})}, 0);
  setTimeout(() => {$('#flipInner2API').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#flipInner2API').animate({opacity: 1.0},{duration:500})}, 0);
  $("#flipInner2API").addClass("flip-card-api-hover");
}

function openSqlInfoWindow() {

    // setTimeout(() => {$('#flipCard').css({visibility: "visible"})}, 0);
  // setTimeout(() => {$('#flipCard').animate({opacity: 1.0},{duration:500})}, 0);
  // $("#flipInner2").addClass("flip-card-hover");

 flipCard.style.display = "block";
  // flipCard.style.visibility = "visible";
 
  // flipInner2.style.display = "block";
  // flipInner2.style.visibility = "visible";

  tableNewApiInfo.style.display = "block";
  tableNewApiInfo.style.visibility = "visible";

  tdInfo1.style.display = "block";
  tdInfo1.style.visibility = "visible";

  modalImg.style.display = "block";
  modalImg.style.visibility = "visible";
  
  textWrapper.style.display = "block";
  sqlText.style.display = "block";
  sqlText.style.visibility = "visible";
  btnInfoCircle.style.opacity = "0.5";

  $("#flipInner2").addClass("flip-card-hover");
 
  setTimeout(() => {$('#divInfo').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#divInfo').css({display: "block"})}, 0);
  setTimeout(() => {$('#divDim').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#divDim').css({opacity: 0.7})}, 0);
  setTimeout(() => {$('#app').addClass("blurred"); }, 0);
  setTimeout(() => {$('#flipCard').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#flipCard').animate({opacity: 1.0},{duration:500})}, 0);
  setTimeout(() => {$('#flipInner2').css({visibility: "visible"})}, 0);
  setTimeout(() => {$('#flipInner2').animate({opacity: 1.0},{duration:500})}, 0);
  


}

function closeSqlInfoWindow() {
  console.log('close');
  btnInfoCircle.style.opacity = "1";
  setTimeout(() => {$('#divDim').animate({opacity: 0},{duration:700})}, 1);
  setTimeout(() => {$('#divDim').css({visibility: "hidden"})}, 700);
  $("#flipInner2").removeClass("flip-card-hover");
  setTimeout(() => {$('#flipCard').animate({opacity: 0},{duration:700})}, 1);
  setTimeout(() => {$('#flipCard').css({visibility: "hidden"})}, 700);
  setTimeout(() => {$('#app').removeClass("blurred"); }, 0);
  setTimeout(() => {$('#divInfo').css({visibility: "hidden"})}, 700);
  setTimeout(() => {$('#divInfo').css({display: "none"})}, 0);
}



function closeApiInfoWindow() {
  btnInfoCircle.style.opacity = "1";
  setTimeout(() => {$('#divDim').animate({opacity: 0},{duration:700})}, 1);
  setTimeout(() => {$('#divDim').css({visibility: "hidden"})}, 700);
  $("#flipInner2API").removeClass("flip-card-api-hover");
  setTimeout(() => {$('#flipCardAPI').animate({opacity: 0},{duration:700})}, 1);
  setTimeout(() => {$('#flipCardAPI').css({visibility: "hidden"})}, 700);
  setTimeout(() => {$('#app').removeClass("blurred"); }, 0);
  setTimeout(() => {$('#divNewApiInfo').css({visibility: "hidden"})}, 700);
  setTimeout(() => {$('#divNewApiInfo').css({display: "none"})}, 0);
  
}
