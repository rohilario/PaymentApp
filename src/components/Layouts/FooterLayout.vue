//eslint-disable
<template>
  <v-bottom-navigation
    app
    :value="activeBtn"
    shift
    dark
  >
    <v-btn to="/teste">
      <span>RECENTES</span>
      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn to="/home">
      <span>HOME</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn @click="logout">
      <span>SAIR</span>
      <v-icon>mdi-exit-to-app</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import auth from '../../services/auth.service'

  export default {
    data () {
      return {
        activeBtn: 1,
      }
    },

  methods:{
        logout(){
          console.log('Saindo..');
          auth.logout();
          setTimeout(this.$router.push({name: "login"}), 10000);
        }
      }

}
</script>