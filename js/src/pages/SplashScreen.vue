<template>
    <div class="splashscreen">
        <img src="../../../design/logo.jpg" class="centered splashlogo"/>
        <h1 class="md-display-2 greenB center">Your pocket botanist</h1>
        <p class="md-subheading greenB center">
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
      }, 3000);
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
      }, 3000);
    }
    if (this.progress !== 5) {
      setTimeout(() => {
        this.$router.push('/guide');
      }, 3000);
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