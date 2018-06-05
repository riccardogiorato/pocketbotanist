<template>
  <div>
    <analyze-photo ref="photoToAnalyze"></analyze-photo>
  </div>
</template>
<script>
import AnalyzePhoto from '../components/AnalyzePhoto';

export default {
  mounted() {
    if (localStorage.getItem('photo')) {
      this.photo = JSON.parse(localStorage.getItem('photo'));
      this.$refs.photoToAnalyze.tookPhoto(this.photo);
    } else {
      this.$router.go('/app');
    }
  },
  components: {
    AnalyzePhoto
  }
};
</script>
