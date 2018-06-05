<template>
<div>
      <md-toolbar :md-elevation="1" >
        <go-back></go-back>
        <span class="md-title">Results</span>
      </md-toolbar>

      <md-card md-with-hover class="results">
      <md-card-media>
        <img v-bind:src="photo" alt="flower">
      </md-card-media>

      <md-card-header>
        <div class="md-title">{{whatFound}}</div>
        <div v-if="precision > 0" class="md-subhead">We are 78% sure about this prediction</div>
      </md-card-header>

      <md-card-expand v-if="precision > 0">
        <md-card-actions md-alignment="space-between">
          <md-card-expand-trigger>
            <md-button>Learn more</md-button>
          </md-card-expand-trigger>
        </md-card-actions>

        <md-card-expand-content>
          <md-card-content>
            
          </md-card-content>
        </md-card-expand-content>
      </md-card-expand>
    </md-card>
</div>
</template>
<script>
import GoBack from '../components/GoBack';

export default {
  data() {
    return {
      photo: null,
      whatFound: '',
      precision: 0
    };
  },
  mounted() {
    if (localStorage.getItem('photo'))
      this.photo = JSON.parse(localStorage.getItem('photo'));

    if (localStorage.getItem('whatFound'))
      this.whatFound = JSON.parse(localStorage.getItem('whatFound'));

    if (localStorage.getItem('precision'))
      this.precision = JSON.parse(localStorage.getItem('precision'));
  },
  components: {
    GoBack
  }
};
</script>
