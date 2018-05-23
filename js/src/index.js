import * as tfc from "@tensorflow/tfjs-core";
import { ModelLoader } from "./ModelLoader";
import { PredictClarifai } from "./PredictClarifai";

/**
 * transform the image from current dimension to dimension
 * @param {*} img image to transform
 * @param {*} dimension max dimension of the image === cnn size
 */
function resizeImg(img, dimension) {
  let c = document.createElement("canvas");
  let ctx = c.getContext("2d");
  let iw = img.width;
  let ih = img.height;
  c.width = dimension;
  c.height = dimension;
  let scaleFactor = dimension / iw;
  ctx.drawImage(img, 0, 0, iw * scaleFactor, ih * scaleFactor);
  return c;
}

/**
 * transform the image from RGB to BGR color dimension
 * @param {*} img image to transform
 * @param {*} dimension max dimension of the image === cnn size
 */
function RGBtoBGR(img, dimension) {
  let c = document.createElement("canvas");
  c.width = dimension;
  c.height = dimension;
  let ctx = c.getContext("2d");

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, c.width, c.height);

  let canv2 = document.createElement("canvas");
  canv2.width = dimension;
  canv2.height = dimension;
  let ctx2 = canv2.getContext("2d");
  let imgBGR = ctx2.createImageData(dimension, dimension);

  // convert RGB to BGR colors
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgBGR.data[i] = imgData.data[i + 2];
    imgBGR.data[i + 1] = imgData.data[i + 1];
    imgBGR.data[i + 2] = imgData.data[i];
    imgBGR.data[i + 3] = 255;
  }
  ctx2.putImageData(imgBGR, 0, 0);
  blurCanvas(canv2, ctx2);

  return canv2;
}

/**
 * blurs the selected canvas
 * @param {*} c canvas on which is displayed the image
 * @param {*} ctx context to the specific canvas
 */
function blurCanvas(c, ctx) {
  ctx.globalAlpha = 0.2;
  var offset = 2;
  for (var i = 1; i <= 8; i += 1) {
    ctx.drawImage(
      c,
      offset,
      0,
      c.width - offset,
      c.height,
      0,
      0,
      c.width - offset,
      c.height
    );
    ctx.drawImage(
      c,
      0,
      offset,
      c.width,
      c.height - offset,
      0,
      0,
      c.width,
      c.height - offset
    );
  }
}

/* const objects */
const modelTf = new ModelLoader();
const resultC = document.getElementById("resultC");
const resultT = document.getElementById("resultT");
const resultsSpinn = document.getElementById("resultsSpinn");
const flower = document.getElementById("flower");

window.onload = async () => {
  const network_width = 227;

  // reduce the image to 227 w-h
  const ResizedImage = resizeImg(flower, network_width);

  // ask clarifai if can see a flower
  const flowerFoundClarifai = predictClarifai(ResizedImage, resultC);

  // turn the image to BGR
  const BGRImage = RGBtoBGR(ResizedImage, network_width);

  await predictTensorflow(BGRImage, resultT);
};

/**
 * predict the class with remote clarifia model
 * @param {*} img image to predict on
 * @param {*} resultsE html element where to put the result
 */
async function predictClarifai(img, resultsE) {
  console.time("Clarifai");
  // call clarifai general model
  const clarifai = new PredictClarifai();
  // get only base64 without prefix
  const base64img = img.toDataURL().substring(22);
  // predict with clarifai API
  const found = await clarifai.isThereAFlower(base64img);
  if (found)
    resultsE.innerHTML += "There's a flower!";
  else 
    resultsE.innerHTML += "<h3>There'snt a flower!</h3>";
    
    stopLoading();

  console.log("ended waiting!");

  console.timeEnd("Clarifai");
}

function stopLoading(){
    resultsSpinn.style.display = 'none';
}

/**
 * predict the class with local tensorflow
 * @param {*} img image to predict on
 * @param {*} resultsE html element where to put the result
 */
async function predictTensorflow(img, resultsE) {
  console.time("Loading of model");
  await modelTf.load();
  console.timeEnd("Loading of model");

  const pixels = tfc.fromPixels(img);

  console.time("First prediction");
  let result = await modelTf.predict(pixels);
  const topK = modelTf.getFoundClasse(result);
  console.timeEnd("First prediction");

  stopLoading();
  
  topK.forEach(x => {
    resultsE.innerHTML += `<h2>It's a ${x.label}</h2><br>`;
  });

  modelTf.dispose();
}
