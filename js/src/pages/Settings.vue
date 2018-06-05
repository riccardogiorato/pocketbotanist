<template>
     <div>
      <md-toolbar :md-elevation="1" >
        
      <go-back></go-back>
        
        <span class="md-title">Settings</span>
      </md-toolbar>

      <md-list class="md-double-line">
        <md-subheader>Machine Learning</md-subheader>

        <md-list-item>
          <md-icon class="md-primary">computer</md-icon>

          <div class="md-list-item-text">
            <span>Local broswer</span>
            <span>Safest, but slow - 5/10 seconds</span>
          </div>

           <md-switch v-model="provider" value="0" class="md-primary"></md-switch>
        </md-list-item>


        <md-list-item>
          <md-icon class="md-primary">cloud_upload</md-icon>

          <div class="md-list-item-text">
            <span>Remote server</span>
            <span>Really fast but less "privacy"</span>
          </div>

           <md-switch class="md-primary" v-model="provider" value="1"></md-switch>
        </md-list-item>

        <md-list-item>
          <md-icon class="md-primary">done_all</md-icon>

          <div class="md-list-item-text">
            <span>Both</span>
            <span> Best compromise to get the fastest results always</span>
          </div>

           <md-switch class="md-primary" v-model="provider" value="2"></md-switch>
        </md-list-item>

        <md-divider></md-divider>
        <md-subheader>Telemetry</md-subheader>

        <md-list-item>
          <md-icon class="md-primary">supervised_user_circle</md-icon>

          <div class="md-list-item-text">
            <span>Usage report</span>
            <span>Report usage and images taken to help us </span>
          </div>

           <md-switch class="md-primary" v-model="usePhotoToImprove"></md-switch>
        </md-list-item>
        </md-list>

    </div>
</template>

<script>
import GoBack from '../components/GoBack';

export default {
  data: () => ({
    boolean: false,
    provider: 0,
    usePhotoToImprove: false
  }),
  mounted() {
    if (localStorage.getItem('provider'))
      this.provider = JSON.parse(localStorage.getItem('provider'));

    if (localStorage.getItem('usePhotoToImprove'))
      this.usePhotoToImprove = JSON.parse(
        localStorage.getItem('usePhotoToImprove')
      );
  },
  watch: {
    provider: {
      handler() {
        localStorage.setItem('provider', JSON.stringify(this.provider));
      },
      deep: true
    },
    usePhotoToImprove: {
      handler() {
        let boolToSave = false;
        if (this.usePhotoToImprove === true) boolToSave = true;
        localStorage.setItem('usePhotoToImprove', JSON.stringify(boolToSave));
      },
      deep: true
    }
  },
  components: {
    GoBack
  }
};
</script>

