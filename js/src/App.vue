<template>
  <div id="app">
    <h1>Your Pocket Botanist</h1>
    <div id="webcam">
      <webcam ref="webcam" v-bind:height="windowHeight" v-bind:width="windowWidth"></webcam>
      <button type="button" @click="photo">Capture Photo</button>
    </div>
    <analyze-photo ref="photoToAnalyze"></analyze-photo>
  </div>
</template>
<script>
import Webcam from './Webcam';
import AnalyzePhoto from './AnalyzePhoto';

export default {
  data: function() {
    return {
      windowHeight: window.innerHeight,
      windowWidth:  window.innerWidth
    }
  },
  methods: {
    photo() {
     this.$refs.photoToAnalyze.tookPhoto(this.$refs.webcam.capture());
    }
  },
  components: {
    Webcam,
    AnalyzePhoto,
  }
};
</script>
