const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: [
        'vuetify'
    ],

    publicPath: '',

    pluginOptions: {
        cordovaPath: 'src-cordova'
    },
    devServer: {
        host: '0.0.0.0',
        port: 8081, // CHANGE YOUR PORT HERE!
        https: false,

    },
})