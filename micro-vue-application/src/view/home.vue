<template>
  <div>micro vue app home</div>
  <router-link name="first" to="/first">first</router-link> | 
  <router-link name="second" to="/second">second</router-link>
</template>
<script>
export default {
  mounted() {
    console.log('micro vue app home');
  },
};
</script>

<style scoped></style>
