<template>
  <v-navigation-drawer v-model="drawer" app dense mini>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
                <v-img src="../../assets/RODOLFE128.jpg"></v-img>
            </v-list-item-avatar>
            <v-list-item-title>ROFE DISTRIBUIDORA</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="title">{{nomerca}}</v-list-item-title>
                <v-list-item-subtitle>COD RCA:{{codrca}}</v-list-item-subtitle>
                </v-list-item-content>
          </v-list-item>
        </v-list>
      <v-divider></v-divider>
      <v-list>
          <v-list-item-group v-model="item">
            <v-list-item
              v-for="item in items"
              :key="item.id"
              link
              :to="item.link"
              >
                <v-list-item-icon>
                  <v-icon>      {{item.icon}}      </v-icon>
                </v-list-item-icon>
                <v-list-item-content color="white">
                  <v-list-item-title >{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-list-item-group>
        </v-list>
  </v-navigation-drawer>
</template>
<script>
  export default {
    props: ['value'],
    data: () => ({
        codrca:localStorage.getItem('codrca'),
        nomerca:localStorage.getItem('nome').replace('"',''),
        item:"",
            items: [
            { title: 'Perfil', icon: 'mdi-account-box',link:'/profile' },
            { title: 'Gerar Pix - Pedidos', icon: 'mdi-home-modern',link:'/pagamentopixpedido' },
            { title: 'Gerar Pix - Duplicatas', icon: 'mdi-file-document' ,link:'/pagamentopixduplic'},
            ],
    }),
    computed: {
      drawer: {
        // getter
        get() {
          return this.value
        },
        // setter
        set(newValue) {
          // Note: we are using destructuring assignment syntax here.
          this.$emit('input', newValue)
        }
      }
    },

  methods: {
    emitUpdate () {

    }
  }
}
</script>