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
      </vue-base64-file-upload>

      <md-bottom-bar md-sync-route md-active-item=cameraApp id="menuMobile">
        <div id="menuItemsMobile" class="centered">
          <md-bottom-bar-item v-if="enableUpload" @click="uploadFile()" md-label="Load Image" md-icon="add"></md-bottom-bar-item>
          <md-bottom-bar-item id="cameraApp" @click="photo()" md-label="Take Photo" md-icon="camera"></md-bottom-bar-item>
          <md-bottom-bar-item to="/settings" md-label="Settings" md-icon="settings"></md-bottom-bar-item>
        </div>
      </md-bottom-bar>

  </div>
</template>
<script>
import VueBase64FileUpload from '../components/Vue-base64-file-upload';
import Webcam from '../components/Webcam';

export default {
  data: function() {
    return {
      enableUpload: true,
      customImageMaxSize: 3,
      windowHeight: window.innerHeight / 2,
      windowWidth: window.innerWidth
    };
  },
  mounted() {
    if (!window.FileReader) {
      this.enableUpload = false;
    }
  },
  methods: {
    photo() {
      //save and redirect
      localStorage.setItem(
        'photo',
        JSON.stringify(this.$refs.webcam.capture())
      );
      this.$router.push('/loading');
    },
    uploadFile() {
      this.$refs.uploadFile.inputFile();
    },
    changeCamera() {
      this.$refs.webcam.changeCamera();
    },
    onFileUploaded(file) {
      localStorage.setItem('photo', JSON.stringify(file));
      this.$router.push('/loading');
    }
  },
  components: {
    Webcam,
    VueBase64FileUpload
  }
};
</script>
<style>
#menuMobile {
  position: fixed;
  bottom: 0px;
  width: 100%;
}
</style>
