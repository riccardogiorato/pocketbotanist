<template>
    <div>
        <img id="flower" v-bind:src="imgSrc" />
        <div id="results">
            <div id="resultsSpinn" class="loader"></div>
            <div id="resultC"></div>
            <div id="resultT"></div>
        </div>
    </div>
</template>
<script>
import * as tfc from "@tensorflow/tfjs-core";
import { ModelLoader } from "./ModelLoader";
import { PredictClarifai } from "./PredictClarifai";

const network_width = 227;

export default {
  name: "AnalyzePhoto",
  data() {
    return {
      imgSrc: null
    };
  },
  methods: {
    tookPhoto: function(valueImg) {
      this.imgSrc = valueImg;
      var img = new Image();
      img.src= this.imgSrc;
      const ResizedImage = resizeImg(img, network_width);
      (async () => { console.log(await predictClarifai(ResizedImage)) });
      //const flowerFoundClarifai = predictClarifai(ResizedImage);
      //console.log("CLARIFAI:",flowerFoundClarifai);
    }
  }
};

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
 * predict the class with remote clarifia model
 * @param {*} img image to predict on
 */
async function predictClarifai(img) {
  // call clarifai general model
  const clarifai = new PredictClarifai();
  // get only base64 without prefix
  const base64img = img.toDataURL().substring(22);
  // predict with clarifai API
  const found = await clarifai.isThereAFlower(base64img);
  if (found)
    return "There's a flower!";
  else 
    return "<h3>There'snt a flower!</h3>";
    
    //stopLoading();
}

</script>