<template>
<!-- App.vue -->
  <v-app>
    <!-- Sizes your content based upon application components -->
    <component :is='layout'>
        <router-view />
    </component>
  </v-app>
</template>

<script>
import DefaultLayout from './components/Layouts/DefaultLayout.vue';

export default {
  name: 'App',
  mounted() {
    console.log(this.$route.meta.layout)
    console.log(this.$route.meta.title)
  },
  computed: {

    layout () {
      return (this.$route.meta.layout || DefaultLayout)
    }
  }
};
</script>
