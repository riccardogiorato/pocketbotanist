<template>
  <div id="app">

      <webcam ref="webcam" v-bind:height="windowHeight" v-bind:width="windowWidth"></webcam>

      <vue-base64-file-upload ref="uploadFile"
        class="takenimage"
        accept="image/jpg,image/png,image/jpeg"
        image-class="takenImage"
        input-class="v1-image"
        :max-size="customImageMaxSize"
        @load="onFileUploaded"
        hidden
        disablePreview>
        <vue-base64-file-upload/>

    <analyze-photo ref="photoToAnalyze"></analyze-photo>

      <md-bottom-bar class="menuMobile" md-sync-route md-active-item=cameraApp>
        <md-bottom-bar-item @click="uploadFile()" md-label="Load Image" md-icon="add"></md-bottom-bar-item>
        <md-bottom-bar-item id="cameraApp" @click="photo()" md-label="Take Photo" md-icon="camera"></md-bottom-bar-item>
        <md-bottom-bar-item to="/settings" md-label="Settings" md-icon="settings"></md-bottom-bar-item>
      </md-bottom-bar>

  </div>
</template>
<script>
import VueBase64FileUpload from './components/Vue-base64-file-upload';
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
    uploadFile() {
      this.$refs.uploadFile.inputFile();
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

<style>
#menuMobile {
  position: fixed;
  bottom: 0px;
}
</style>
