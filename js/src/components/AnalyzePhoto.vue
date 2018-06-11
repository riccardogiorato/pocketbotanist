<template>
    <div>
        
        <md-progress-spinner :md-diameter="150" :md-stroke="10" :md-value="progress" class="spinner"></md-progress-spinner>

    </div>
</template>
<script>
import { fromPixels } from '@tensorflow/tfjs-core';
import { ModelLoader } from '../machine_learning/ModelLoader';
import { PredictClarifai } from '../machine_learning/PredictClarifai';
import { PredictAlgorithmia } from '../machine_learning/PredictAlgorithmia';

export default {
  name: 'AnalyzePhoto',
  data() {
    return {
      network_width: 227,
      flowerFoundClarifai: '',
      flowerFound: false,
      flowerClass: '',
      flowerFoundAlgo: '',
      tensorflowLocal: new ModelLoader(),
      progress: 20
    };
  },
  methods: {
    /** analyse and image base64 with Clarifai API and
     *  Tensorflow remote or local execution
     * @param {*} valueImg nase64 image to check if present flowers
     */
    tookPhoto: async function(valueImg) {
      this.flowerFoundClarifai = '';
      this.flowerFound = false;
      this.flowerClass = '';
      this.flowerFoundAlgo = '';

      if (await this.predictClarifai(valueImg)) {
        this.progress = 40;
        //create temp image
        var img = new Image();
        img.src = valueImg;

        img.onload = async () => {
          localStorage.setItem('height', JSON.stringify(img.height));

          let ResizedImage = this.resizeImg256(img);
          ResizedImage = this.cropcenter(ResizedImage, this.network_width);

          const BGRImage = this.RGBtoBGR(ResizedImage, this.network_width);
          this.progress = 60;
          this.flowerFoundAlgo = await this.predictAlgorithmiaTensorflow(
            BGRImage.toDataURL()
          );

          this.progress = 80;

          //this.flowerClass = await this.predictLocalTensorflow(BGRImage);
          //alert(this.flowerClass.label + ' ' + this.flowerClass.value);

          this.progress = 100;

          if (true) {
            localStorage.setItem(
              'whatFound',
              JSON.stringify('We found a ' + this.flowerFoundAlgo.label)
            );

            localStorage.setItem(
              'precision',
              JSON.stringify(this.flowerFoundAlgo.value)
            );
          } else {
            // local tensorflow is bugged
          }

          this.$router.push('/result');
        };
        await img;
      } else {
        // no flower in the image
        var img = new Image();

        img.onload = function() {
          localStorage.setItem('height', JSON.stringify(img.height));
        };

        img.src = valueImg;

        localStorage.setItem(
          'whatFound',
          JSON.stringify("There isn't a flower in the photo sorry...😢")
        );

        localStorage.setItem('precision', JSON.stringify(0));

        this.$router.push('/result');
      }
    },

    /**
     * predict the class with local tensorflow
     * @param {*} img image to predict on
     */
    predictLocalTensorflow: async function(img) {
      await this.tensorflowLocal.load();
      const pixels = fromPixels(img);

      let result = this.tensorflowLocal.predict(pixels);

      const topK = this.tensorflowLocal.getTopKClasses(result, 5);

      this.tensorflowLocal.dispose();
      return topK[0];
    },

    /**
     * predict the class with remote tensorflow on Algorithmia
     * @param {*} img image to predict on
     */
    predictAlgorithmiaTensorflow: async function(img) {
      const algorithmia = new PredictAlgorithmia();
      return JSON.parse(await algorithmia.predict(img));
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
      return found;
    },
    /**
     * transform the image from current dimension to 256
     * @param {*} img image to transform
     */
    resizeImg256: function(img) {
      let c = document.createElement('canvas');
      let ctx = c.getContext('2d');
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
      let c = document.createElement('canvas');
      let ctx = c.getContext('2d');
      c.width = dimension;
      c.height = dimension;
      this.disableSmoothCanvas(ctx);
      ctx.drawImage(img, 14.5, 14.5, 227, 227, 0, 0, 227, 227);
      return c;
    },
    /**
     * disable smoothing from canvas to prevent blurred downsampling
     * @param {*} ctx which needs image smoothing disabled
     */
    disableSmoothCanvas: function(ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.oImageSmoothingEnabled = false;
    },
    /**
     * transform the image from RGB to BGR color dimension
     * @param {*} img image to transform
     * @param {*} dimension max dimension of the image === cnn size
     */
    RGBtoBGR: function(img, dimension) {
      let c = document.createElement('canvas');
      c.width = dimension;
      c.height = dimension;
      let ctx = c.getContext('2d');
      this.disableSmoothCanvas(ctx);

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, c.width, c.height);

      let canv2 = document.createElement('canvas');
      canv2.width = dimension;
      canv2.height = dimension;
      let ctx2 = canv2.getContext('2d');
      this.disableSmoothCanvas(ctx2);
      let imgBGR = ctx2.createImageData(dimension, dimension);

      // convert RGB to BGR colors
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgBGR.data[i] = imgData.data[i + 2];
        imgBGR.data[i + 1] = imgData.data[i + 1];
        imgBGR.data[i + 2] = imgData.data[i];
        imgBGR.data[i + 3] = 255;
      }
      ctx2.putImageData(imgBGR, 0, 0);
      //this.blurCanvas(canv2, ctx2);

      return canv2;
    },
    /**
     * blurs the selected canvas
     * @param {*} c canvas on which is displayed the image
     * @param {*} ctx context to the specific canvas
     */
    blurCanvas: function(c, ctx) {
      ctx.globalAlpha = 0.2;
      const offset = 2;
      for (let i = 1; i <= 8; i += 1) {
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
      } //for
      this.disableSmoothCanvas(ctx);
    }
  }
};
</script>
