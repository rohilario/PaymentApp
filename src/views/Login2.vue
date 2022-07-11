<template>
  <v-row class="vh-100 vw-100 row-login">
    <v-col sm="5" class="d-flex justify-content-center align-items-center left-login">
        <h2 class="text-center mb-5 title-login">FACA O LOGIN</h2>
        <v-form>
            <v-text-field
                id="email"
                type="email"
                placeholder="joaosilva@email.com"
                autocomplete="off"
                v-model="username"
            ></v-text-field>
            <v-text-field
                id="password"
                type="password"
                placeholder="Digite sua senha"
                v-model="password"
            ></v-text-field>
            <v-button
              type="button"
              variant="primary"
              block
              @click="getAuth">
              <i class="fas fa-sign-in-alt"></i> Entrar
            </v-button>
        </v-form>
            <hr>
    </v-col>
    <v-col>
        <v-col>
            <img src="../assets/background.jpg" class="img-login" />
        </v-col>
    </v-col>
  </v-row>
</template>

<style>
*, /*resetar o estilo da página*/
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}
 
.row-login {
  margin-left: 0;
}
 
.left-login {
  background-color: #F2F2F2;
}
 
.title-login {
  font-weight: bold;
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
     goToRegister(){
      this.$router.push({ name: "home" });
      console.log(localStorage.getItem('token'))
     },

 async getAuth(){
   let credential={usr:this.username,pass:this.password}
   let isAutenticated= await auth.login(credential);
   if(isAutenticated.auth===true){
      this.login='USUARIO AUTENTICADO COM SUCESSO'
      console.log('TOKEN OK')
      setTimeout(this.$router.push({name: "home"}), 10000);

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
    //Hours part from the timestamp
    //var hours = date.getHours();
    // Minutes part from the timestamp
    //var minutes = "0" + date.getMinutes();
    //Seconds part from the timestamp
    //var seconds = "0" + date.getSeconds();
    //Will display time in 10:30:23 format
    //var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    //let dthrtoken={dthrexpiration:formattedTime}
    //console.log(dthrtoken)

    //let today = new Date();
    //let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

}
  },

}
</script>