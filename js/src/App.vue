<template>
  <div id="app">
    <h1>Your Pocket Botanist</h1>
    <div id="webcam">
      <webcam ref="webcam" v-bind:height="windowHeight" v-bind:width="windowWidth"></webcam>
      <button type="button" @click="photo">Capture Photo</button>
    </div>
    <div>
      <p>Or if you want upload an image</p>
      <vue-base64-file-upload 
        class="takenimage"
        accept="image/png,image/jpeg"
        image-class="takenImage"
        input-class="v1-image"
        :max-size="customImageMaxSize"
        @load="onFileUploaded"
        />
    </div>

    <analyze-photo ref="photoToAnalyze"></analyze-photo>
  </div>
</template>
<script>
import VueBase64FileUpload from 'vue-base64-file-upload';
import Webcam from "./Webcam";
import AnalyzePhoto from "./AnalyzePhoto";

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
    onFileUploaded(file) {
      this.$refs.photoToAnalyze.tookPhoto(file);
    },
  },
  components: {
    Webcam,
    AnalyzePhoto,
    VueBase64FileUpload,
  }
};
</script>
