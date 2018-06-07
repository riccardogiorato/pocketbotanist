<template>
  <div>
    <md-steppers :md-active-step.sync="active" md-vertical md-dynamic-height>
      <md-step id="first" md-label="How to use the app" :md-done.sync="first">
        <div class="md-alignment-center-center">
            <img class="centeredImage" src="../../../design/takephoto.png" />
            <h2 class="md-display-2 greenB center">Take a photo</h2>
            <h3 class="md-display-1 greyT center">or upload an image</h3>
            <md-button class="md-raised md-primary" @click="setDone('first', 'second')">Continue</md-button>
        </div>
      </md-step>

      <md-step id="second" md-label="Which ML provider?" :md-done.sync="second">
        <p class="md-title greenB center">
          We are going to try tell you which plant is there.
        </p>
        <p class="md-subheading greyT center">
          But we need to work on it.
          <br/>
          What do you prefer?
        </p>
        <div class="center">
          <md-button class="md-raised md-primary" @click="machineLearningProviderRemote('0')">Local broswer</md-button>
          <md-button class="md-raised md-primary" @click="machineLearningProviderRemote('1')">Remote server</md-button>
          <md-button class="md-raised md-primary" @click="machineLearningProviderRemote('2')">Both</md-button>
        </div>
      </md-step>

      <md-step id="third" md-label="Telemetry" :md-done.sync="third">
        <p class="md-title greenB center">
        Do you want to help us? </p>
        <p class="md-subheading greyT center">
        Can we use your photos to improve our visual model?
        </p>
        <div class="center">        
          <md-button class="md-raised md-primary" @click="canUsePhotos(true)">Sure</md-button>
          <md-button class="md-raised" @click="canUsePhotos(false)">No</md-button>
        </div>
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
export default {
  data: () => ({
    active: 'first',
    first: false,
    second: false,
    third: false
  }),
  methods: {
    setDone(id, index) {
      this[id] = true;

      if (index) {
        this.active = index;
      }

      if (this.first && this.second && this.third) {
        localStorage.setItem('progress', JSON.stringify(5));
        this.$router.push('/app');
      }
    },
    machineLearningProviderRemote(which) {
      if (which === 0) console.log('local');
      if (which === 1) console.log('remote');
      if (which === 2) console.log('both');
      localStorage.setItem('provider', JSON.stringify(which));
      this.setDone('second', 'third');
    },
    canUsePhotos(canUse) {
      localStorage.setItem('usePhotoToImprove', JSON.stringify(canUse));
      this.setDone('third');
    }
  }
};
</script>