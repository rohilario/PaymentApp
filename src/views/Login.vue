<template>
         <v-container fluid id="background">
            <v-layout align-center justify-center>
               <v-row align="center" justify="center" style="height: 800px">
                  <v-col align="center">
                     <v-card class="mx-auto elevation-20" max-width="500" >
                        <v-toolbar align-center justify-center dark color="primary">
                           <v-toolbar-title>LOGIN - ROFE DISTRIBUIDORA</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text align-center justify-center>
                                 <v-col cols="12">
                                    <v-img src="../assets/logo_rofe.webp" height="auto" width="auto"></v-img>
                                 </v-col>
                           <v-alert v-if="login!=null" border="top" color="red lighten-2" dark>
                              {{login}}
                           </v-alert>
                        <form ref="form" @submit.prevent="login">
                              <v-text-field
                                 v-model="username"
                                 name="username"
                                 label="EMAIL"
                                 type="text"
                                 placeholder="EMAIL"
                                 required
                              ></v-text-field>
                              <v-text-field
                                 v-model="password"
                                 name="password"
                                 label="SENHA"
                                 type="password"
                                 placeholder="SENHA"
                                 required
                              ></v-text-field>
                              <v-btn type="submit" color="primary" value="log in" @click="getAuth">ENTRAR</v-btn>
                        </form>
                        </v-card-text>
                     </v-card>
                  </v-col>
               </v-row>
            </v-layout>
         </v-container>
</template>

<style scoped>
#background {
  background-image: url('../assets/background.jpg');
  background-size: cover;

}
</style>

<script>

import auth from '../services/auth.service'
import jwt_decode from 'jwt-decode'

export default {

  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  props: {
      source: String,
   },
  components: {
    },

  data() {
    return {
      dialog: false,
      loading: false,
      message: '',
      password:null,
      username:null,
      login:null
    };
  },
  computed: {

  },
  created() {
		window.localStorage.clear();

  },
  methods: {

 async getAuth(){
   let credential={usr:this.username,pass:this.password}
   let isAutenticated= await auth.login(credential);
   if(isAutenticated.auth===true){
      this.login='USUARIO AUTENTICADO COM SUCESSO'
      console.log('TOKEN OK')
      setTimeout(this.$router.push({name: "HOME"}), 10000);

   }else{
      this.login='USUARIO OU SENHAS INVALIDAS'
      console.log('TOKEN NAO OK')
      localStorage.removeItem('token');
   }
   //this.$router.push({ name: "home" });
   //console.log(isAutenticated)
   //console.log(localStorage.getItem('token'))
   let decoded = jwt_decode(localStorage.getItem('token'));
   //console.log(decoded)

    var date = new Date(decoded.exp * 1000);
    let text = date.toLocaleString('PT-Br');
    console.log('DECODED ' + text)
    // Hours part from the timestamp
    //var hours = date.getHours();
    // Minutes part from the timestamp
    //var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    //var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    //var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    //let dthrtoken={dthrexpiration:formattedTime}
    //console.log(dthrtoken)

    //let today = new Date();
    //let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

}
  },

}
</script>