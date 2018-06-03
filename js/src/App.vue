<template>
  <div id="app">
    <h1>Your Pocket Botanist</h1>

    <md-card>
      <md-card-media>
        <webcam ref="webcam" v-bind:height="windowHeight" v-bind:width="windowWidth"></webcam>
      </md-card-media>

      <md-card-header>
        <div class="md-title">Your camera feed</div>
      </md-card-header>

      <md-card-expand>
        <md-card-actions md-alignment="space-between">
          <div>
            <md-button class="md-raised md-primary" @click="photo()">What flower is it?</md-button>
          </div>

          <div>
            <md-button @click="changeCamera()">Change camera</md-button>
          </div>
        </md-card-actions>
      </md-card-expand>

    </md-card>

          <p>Or if you want upload an image</p>
      <vue-base64-file-upload 
        class="takenimage"
        accept="image/jpg,image/png,image/jpeg"
        image-class="takenImage"
        input-class="v1-image"
        :max-size="customImageMaxSize"
        @load="onFileUploaded"
        />

    <analyze-photo ref="photoToAnalyze"></analyze-photo>
  </div>
</template>
<script>
import VueBase64FileUpload from 'vue-base64-file-upload';
import Webcam from './components/Webcam';
import AnalyzePhoto from './components/AnalyzePhoto';

export default {
  data: function() {
    return {
      customImageMaxSize: 3,
      windowHeight: window.innerHeight / 2,
      windowWidth: window.innerWidth
    };
  },
  methods: {
    photo() {
      this.$refs.photoToAnalyze.tookPhoto(this.$refs.webcam.capture());
    },
    changeCamera() {
      this.$refs.webcam.changeCamera();
    },
    onFileUploaded(file) {
      this.$refs.photoToAnalyze.tookPhoto(file);
    }
  },
  components: {
    Webcam,
    AnalyzePhoto,
    VueBase64FileUpload
  }
};
</script>
