<template>
  <div>micro vue home</div>
  <router-link name="first" to="/first">first</router-link> | 
  <router-link name="second" to="/second">second</router-link>
</template>
<script>
export default {
  mounted() {
    console.log(123);
  },
};
</script>

<style scoped></style>
