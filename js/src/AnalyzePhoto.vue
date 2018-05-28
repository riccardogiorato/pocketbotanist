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

export default {
  name: "AnalyzePhoto",
  data() {
    return {
      network_width: 277,
      loading: false,
      imgSrc: null,
      flowerFoundClarifai: "",
      flowerFound: false,
      flowerClass: "",
      tensorflowLocal: new ModelLoader()
    };
  },
  methods: {
    tookPhoto: async function(valueImg) {
      this.imgSrc = valueImg;
      var img = new Image();
      img.src = this.imgSrc;

      this.loading = true;
      if (true || await this.predictClarifai(valueImg)) {
        const ResizedImage = this.resizeImg(img, this.network_width);
        const BGRImage = this.tensorflowLocal.RGBtoBGR(img, this.network_width);
        console.log(BGRImage.toDataURL());

        this.flowerClass = await this.predictLocalTensorflow(BGRImage);
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

      let result = await this.tensorflowLocal.predict(pixels);
      await tfc.nextFrame();
      const topK = this.tensorflowLocal.getFoundClasse(result);

      this.tensorflowLocal.dispose();
      console.dir(topK);
      return "<h2>It's a " + topK[0].label + "</h2><br>";
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
     * transform the image from current dimension to dimension
     * @param {*} img image to transform
     * @param {*} dimension max dimension of the image === cnn size
     */
    resizeImg: function(img, dimension) {
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
  }
};
</script>