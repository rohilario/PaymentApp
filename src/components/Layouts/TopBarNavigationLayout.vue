<template>
    <v-app-bar app dense>

            <v-app-bar-nav-icon @click="draw"></v-app-bar-nav-icon>

            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-toolbar-title><v-img src="../../assets/favicon-16x16.png" height="35" width="35"></v-img></v-toolbar-title>


    </v-app-bar>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false,
        activeBtn: 1,
        codrca:localStorage.getItem('codrca'),
        nomerca:localStorage.getItem('nome').replace('"',''),
        title:null,
        document:{title:null}

      }
    },

    methods: {
        titlePage(){
            return this.title=this.$route.meta.title;
        },

        draw(){
          this.drawer=!this.drawer
          console.log(this.drawer)
          //this.$emit('submit')
          this.$emit('drawer:update', this.drawer)
        },
    },
    watch: {
        $route: {
            immediate: true,
            // eslint-disable-next-line no-unused-vars
            handler(to, from) {
                 this.title = document.title || 'Some Default Title';
                  console.log(document.title)
            }
        }
    }
  }
</script>