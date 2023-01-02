/*
 * ======================================================================================
 * Imagine: Colors
 * Copyright © Steven M. Lyles
 * https://github.com/steven-lyles/imagine-colors
 * https://www.stevenlyles.net
 * =====================================================================================
 */
const DISPLAY_WINDOW_WIDTH = 725;
const DISPLAY_WINDOW_HEIGHT = 725;

let dropZone = document.getElementById("dropzone"); // where files are dropped
let canvasMain = document.getElementById("canvas-main"); // where image is drawn
let URL = window.webkitURL || window.URL;
const colorThief = new ColorThief();
let img = new Image();
let ctx = document.getElementById('canvas-main').getContext('2d');

// open file selector when the drop zone region is clicked
let hiddenInput = document.createElement("input");
hiddenInput.type = "file";
hiddenInput.accept = "image/*";
hiddenInput.addEventListener("change", handleFileOpen, false);

dropZone.addEventListener('click', function() { hiddenInput.click(); });
dropZone.addEventListener('dragenter', preventDefault, false);
dropZone.addEventListener('dragleave', preventDefault, false);
dropZone.addEventListener('dragover', preventDefault, false);
dropZone.addEventListener('drop', preventDefault, false);
dropZone.addEventListener('drop', handleFileDrop, false);
dropZone.addEventListener('dragenter', glowOn, false);
dropZone.addEventListener('dragleave', glowOff, false);

//=======================================================================================
function preventDefault(e) {
  e.preventDefault();
  e.stopPropagation();
}

//=======================================================================================
function glowOn() {
//  $("#dropzone").css("box-shadow", 
//                     "0 20px 60px 0 rgba(255, 165, 0, 0.5), \n\
//                      0 0px   0px 0 rgba(255, 165, 0, 0.19)");
  $( "#message" ).css("color", "orange");
}

//=======================================================================================
function glowOff() {
//  $("#dropzone").css("box-shadow", 
//                     "0 4px  8px 0 rgba(0, 0, 0, 0.0), \n\
//                      0 6px 20px 0 rgba(0, 0, 0, 0.19)");
  $( "#message" ).css("color", "white");
}

//========================================================================================
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

//========================================================================================
function process_image(image) { 
  d_color = colorThief.getColor(image);
  palette = colorThief.getPalette(image, 20);
  
  dominant_color_hex = rgbToHex(d_color[0], d_color[1], d_color[2]);
  
  $("#control-banner").css("background-color", dominant_color_hex);
  $("#d_color_swatch").css("background-color", dominant_color_hex);
  $("#d_color_hex").html(dominant_color_hex);
  $("#d_color_rgb").html("rgb(" + d_color[0] + ", " + d_color[1] + ", " + d_color[2] + ")");
  $("#width").html(image.width + "px");
  $("#height").html(image.height + "px");
  
  let i;
  let color;
  for (i=0; i<20; i++) {
    color = rgbToHex(palette[i][0], palette[i][1], palette[i][2]);
    $("#swatch_" + i).css("background-color", color);
    $("#hValue_" + i).html(color + " : " + "rgb(" + palette[i][0] + ", " + palette[i][1] + ", " + palette[i][2] + ")");
  }
}

//=======================================================================================
function draw_image_in_canvas(image, canvasId) {
  let imageRatio = 1;
  let left = 0;
  let top = 0;
  let canvasWidth = DISPLAY_WINDOW_WIDTH;
  let canvasHeight = DISPLAY_WINDOW_HEIGHT;
  let targetCanvas = document.getElementById(canvasId);
  let targetContext = document.getElementById(canvasId).getContext('2d');

  //------------------------------------------------------------
  // Determine the right width/height to fit in the display area

  // Images is smaller that display area in both dimensions
  if ((image.height < DISPLAY_WINDOW_HEIGHT) && (image.width < DISPLAY_WINDOW_WIDTH)) { 
    canvasHeight = image.height;
    canvasWidth = image.width;
    $("#" + canvasId).css("margin-top", (DISPLAY_WINDOW_HEIGHT-canvasHeight)/2+"px");
    $("#" + canvasId).css("margin-left", (DISPLAY_WINDOW_WIDTH-canvasWidth)/2 + "px");
  } else { // At least one dimension is >= diplay dimensions
    imageRatio = (image.width/image.height);
    if (image.width > image.height) { // landscape
      canvasHeight = canvasWidth/imageRatio;
      $("#" + canvasId).css("margin-top", (DISPLAY_WINDOW_HEIGHT-canvasHeight)/2+"px");
    } else if (image.width === image.height) { // image is square
      // do nothing for now
    } else { // portrait
      canvasWidth = canvasHeight*imageRatio;
      $("#" + canvasId).css("margin-left", (DISPLAY_WINDOW_WIDTH-canvasWidth)/2 + "px");
    }
  }
  //------------------------------------------------------
  // Set the canvas' height in the style tag to be correct
  set_canvas_dimensions_to(targetCanvas, canvasWidth, canvasHeight);
  targetContext.drawImage(image, left, top, canvasWidth, canvasHeight);

  process_image(image);
}

//=======================================================================================
function set_canvas_dimensions_to(targetCanvas, w, h) {
  targetCanvas.style.height = h+"px";     
  targetCanvas.style.width = w+"px";
  targetCanvas.width = w;
  targetCanvas.height = h;
}

//=======================================================================================
// Given a url to the target image this function handles drawing it in the canvas;
// It resets the canvas and calls draw_image_in_canvas which handles sizing the
// canvas to fit the image aspect ratio and drawing image on canvas in dropzone
function handleFile(url) {
  img.src = url;

  $("#message").remove(); // remove the drop zone instruction text

  // Reset the canvas
  ctx.clearRect(0, 0, canvasMain.width, canvasMain.height);
  set_canvas_dimensions_to(canvasMain, DISPLAY_WINDOW_WIDTH, DISPLAY_WINDOW_HEIGHT);
  $("#canvas-main").css("margin-top", "0px");
  $("#canvas-main").css("margin-left", "0px");

  img.onload = function() { draw_image_in_canvas(img, "canvas-main"); };
  
}

//=======================================================================================
// This is called when the user selects a file from a file open dialog
function handleFileOpen(e) {
  let url = URL.createObjectURL(e.target.files[0]);
  handleFile(url);
}

//=======================================================================================
// This is called when the user drops a file on the drop zone
function handleFileDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  let url = URL.createObjectURL(files[0]);
  handleFile(url);
}

//=======================================================================================
$( "#dropzone" ).hover( function() { glowOn(); }, function() { glowOff();} );


