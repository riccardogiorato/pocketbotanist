<template>
    <div class="splashscreen">
        <img src="../../../design/logo.jpg" class="centeredImage"/>
        <h1 class="md-display-2 greenB center">Your pocket botanist</h1>
        <p class="md-subheading greenB">
            "Botany is the science in which plants are known by their aliases."
        </p>
    </div>
</template>
<script>
export default {
  data: function() {
    return {
      progress: 0
    };
  },
  methods: {
    firstBootDone() {
      console.log('first try of the app');
      this.progress = 1;
      setTimeout(() => {
        this.$router.push('/guide');
      }, 2000);
    }
  },
  mounted() {
    console.log('App mounted!');
    if (localStorage.getItem('progress'))
      this.progress = JSON.parse(localStorage.getItem('progress'));

    if (this.progress === 0) {
      this.firstBootDone();
    }
    if (this.progress === 5) {
      setTimeout(() => {
        this.$router.push('/app');
      }, 2000);
    }
    if (this.progress !== 5) {
      this.$router.push('/guide');
    }
  },
  watch: {
    progress: {
      handler() {
        localStorage.setItem('progress', JSON.stringify(this.progress));
      },
      deep: true
    }
  }
};
</script>


<style scoped>
.splashscreen {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
