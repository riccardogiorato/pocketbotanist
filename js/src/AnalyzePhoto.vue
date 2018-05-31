<template>
    <div>
        <img id="flower" class="takenImage" v-bind:src="imgSrc" />
        <div id="results">
        </div>
        <div v-if="loading" id="resultsSpinn" class="loader"></div>
        <div v-else >
          <p v-html="flowerClass"></p>
          <p v-html="flowerFoundClarifai"></p>
          <p v-html="flowerFoundAlgo"></p>
        </div>
    </div>
</template>
<script>
import * as tfc from "@tensorflow/tfjs-core";
import { ModelLoader } from "./ModelLoader";
import { PredictClarifai } from "./PredictClarifai";
import { PredictAlgorithmia } from "./PredictAlgorithmia";

export default {
  name: "AnalyzePhoto",
  data() {
    return {
      network_width: 227,
      loading: false,
      imgSrc: null,
      flowerFoundClarifai: "",
      flowerFound: false,
      flowerClass: "",
      flowerFoundAlgo: "",
      tensorflowLocal: new ModelLoader()
    };
  },
  methods: {
    tookPhoto: async function(valueImg) {
      this.loading = true;
      if (await this.predictClarifai(valueImg)) {
        //create temp image
        var img = new Image();
        img.src = valueImg;

        img.onload = async () => {
          let ResizedImage = this.resizeImg256(img);
          ResizedImage = this.cropcenter(ResizedImage, this.network_width);

          const BGRImage = this.tensorflowLocal.RGBtoBGR(
            ResizedImage,
            this.network_width
          );

          this.flowerFoundAlgo = await this.predictAlgorithmiaTensorflow(
            BGRImage.toDataURL()
          );
          //this.flowerClass = await this.predictLocalTensorflow(BGRImage);
        };
        await img;
      }
      this.loading = false;
    },
    /**
     * predict the class with local tensorflow
     * @param {*} img image to predict on
     */
    predictLocalTensorflow: async function(img) {
      await this.tensorflowLocal.load();
      const pixels = tfc.fromPixels(img);

      let result = this.tensorflowLocal.predict(pixels);
      const topK = this.tensorflowLocal.getFoundClasse(result);
      this.tensorflowLocal.dispose();
      return "<h2>It's a " + topK[0].label + "</h2><br>";
    },
    /**
     * predict the class with remote tensorflow on Algorithmia
     * @param {*} img image to predict on
     */
    predictAlgorithmiaTensorflow: async function(img) {
      const algorithmia = new PredictAlgorithmia();
      return algorithmia.predict(img);
    },

    /**
     * predict the class with remote clarifia model
     * @param {*} img image to predict on
     */
    predictClarifai: async function(img) {
      // call clarifai general model
      const clarifai = new PredictClarifai();
      // get only base64 without prefix
      const base64img = img.substring(23);
      // predict with clarifai API
      const found = await clarifai.isThereAFlower(base64img);
      if (found) this.flowerFoundClarifai = "There's a flower here 🌺";
      else
        this.flowerFoundClarifai =
          "<h3>There isn't a flower in the photo sorry...😢 </h3>";

      console.log(found, this.flowerFoundClarifai);

      this.flowerFound = found;

      return found;
    },
    /**
     * transform the image from current dimension to 256
     * @param {*} img image to transform
     */
    resizeImg256: function(img) {
      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      c.width = 256;
      c.height = 256;
      this.disableSmoothCanvas(ctx);
      ctx.drawImage(img, 0, 0, 256, 256);
      return c;
    },
    /**
     * transform the image from current dimension to dimension cropping to center
     * @param {*} img image to transform
     * @param {*} dimension max dimension of the image === cnn size
     */
    cropcenter: function(img, dimension) {
      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      c.width = dimension;
      c.height = dimension;
      this.disableSmoothCanvas(ctx);
      ctx.drawImage(img, 14.5, 14.5, 227, 227, 0, 0, 227, 227);
      return c;
    },
    disableSmoothCanvas: function(ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.oImageSmoothingEnabled = false;
    }
  }
};
</script>