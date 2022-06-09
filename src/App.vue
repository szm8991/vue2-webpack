<template>
  <!-- 这是一段注释 -->
  <h1>{{count+1}}</h1>
  <h1>{{count+2}}</h1>
  <button @click="plus(1)">+</button>
  <button @click="minus(2)">-</button>
  <!-- <button @click="add100">ADD 100</button> -->
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    plus(num) {
      console.log("plus");
      this.$data.count += num;
    },
    minus(num) {
      console.log("minus");
      this.$data.count -= num;
    },
    add100() {
      this.count += 100;
    },
  },
};
</script>