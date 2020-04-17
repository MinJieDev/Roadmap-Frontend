<template>
  <div id="app">
    <RoadmapLayout>
    <router-view/>
    </RoadmapLayout>
  </div>
</template>

<script>
import RoadmapLayout from './views/RoadmapLayout';

export default {
  name: 'App',
  components: { RoadmapLayout },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
