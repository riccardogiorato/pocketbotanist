<template>
    <div>
        <img id="flower" class="takenImage" v-bind:src="imgSrc" />
        <div id="results">
        </div>
        <div v-if="loading" id="resultsSpinn" class="loader"></div>
        <div v-else >
          <p v-html="flowerClass"></p>
          <p v-html="flowerFoundClarifai"></p>
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
      loading: false,
      imgSrc: null,
      flowerFoundClarifai: "",
      flowerClass: "",
      tensorflowLocal: new ModelLoader()
    };
  },
  methods: {
    tookPhoto: async function(valueImg) {
      this.imgSrc = valueImg;
      var img = new Image();
      img.src = this.imgSrc;
      const ResizedImage = resizeImg(img, network_width);

      this.loading = true;
      this.flowerFoundClarifai = await predictClarifai(ResizedImage);
      this.flowerClass = await this.predictLocalTensorflow(ResizedImage);
      this.loading = false;
    },
    /**
     * predict the class with local tensorflow
     * @param {*} img image to predict on
     */
    predictLocalTensorflow: async function(img) {
      const BGRImage = this.tensorflowLocal.RGBtoBGR(img, network_width);

      await this.tensorflowLocal.load();

      const pixels = tfc.fromPixels(BGRImage);

      let result = await this.tensorflowLocal.predict(pixels);
      await tfc.nextFrame();
      const topK = this.tensorflowLocal.getFoundClasse(result);

      this.tensorflowLocal.dispose();
      return "<h2>It's a " + topK[0].label + "</h2><br>";
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
  if (found) return "There's a flower here 🌺";
  else return "<h3>There isn't a flower in the photo sorry...😢 </h3>";
}
</script>