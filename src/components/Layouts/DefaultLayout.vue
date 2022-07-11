<template>
<!-- App.vue -->
    <v-app fill-height>
        <TopBar @drawer:update="updateDrawer"></TopBar>
                  <AsideMenu v-model="drawer"></AsideMenu>
        <v-layout id="center">
            <!-- Sizes your content based upon application components -->
            <v-content>
                <v-spacer></v-spacer>
                <!-- Provides the application the proper gutter -->
                <v-container>
                    <router-view />
                    <Footer></Footer>
                </v-container>
            </v-content>
        </v-layout>
    </v-app>
</template>

<style>
#id{
max-width: 1337px !important;
}

</style>

<script>

import Footer from './FooterLayout.vue';
import TopBar from './TopBarNavigationLayout.vue'
import AsideMenu from './AsideMenuLayout.vue'

export default {
  name: 'DefaultTemplate',
  components:{
    Footer,
    // eslint-disable-next-line vue/no-unused-components
    TopBar,
    AsideMenu
  },
  computed(){
    // eslint-disable-next-line no-unused-vars
    const titlebreadcrumbs=this.$route.meta.title
  },
  mounted() {
    console.log(this.$route.meta.layout)
    console.log(this.$route.meta.title)
  },
  methods: {
    updateDrawer (drawer) {
      this.drawer = drawer
    },
    callback () {
      console.log('callback')
    }
  },
  data: () => ({
    drawer:null
  }),
};
</script>
