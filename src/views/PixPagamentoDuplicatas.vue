/* eslint-disable vue/no-side-effects-in-computed-properties */
// eslint-disable-next-line vue/multi-word-component-names
<template>
  <v-container>
    <v-row>
        <v-col cols="12">
            <b><h1 style="text-align:center" class="font-weight-light mb-2 center">GERAR FATURAMENTO POR DUPLICATAS</h1></b>
            <v-col cols="12" align="center" justify="space-around">
                <v-btn text block color="green" v-if="registerTokenOk" class="ma-2">{{msgRegisterToken}}<v-icon right>mdi-checkbox-marked-circle</v-icon></v-btn>
                <v-btn text block color="red" v-else class="ma-2">SEM TOKEN, GERE OU RENOVE NO BOTAO ABAIXO!<v-icon right>mdi-cancel</v-icon></v-btn>
                <VueCountdown :time="10 * 60 * 1000" v-slot="{ minutes, seconds }">
                <span v-if="expirein" style="text-align:center" class="font-weight-light mb-2 center">Tempo para o Token Expirar {{ minutes }} minutos, {{ seconds }} segundos.</span></VueCountdown>
                <span v-if="expirein">{{expirein}}</span>
            </v-col>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12">
            <v-form ref="form" lazy-validation>
                <hr>
                <v-col cols="12" sm="6">
                    <v-container fluid>
                        <span>STEP 1 - SELECIONE O CLIENTE PARA COMERCA <v-icon v-if="modelCodCli">mdi-check</v-icon> </span>
                    </v-container>
                                </v-col>
                    <v-col cols="12" sm="2">
                        <v-container fluid>
                            <v-text-field required dense outlined 
                                v-model='modelCodCli' label="PESQ. POR COD CLIENTE" @change="getDuplicatas()" 
                                hint="DIGITE O CODIGO DE UM CLIENTE PARA VERIFICAR AS DUPLICATAS EM ABERTO E APERTE ENTER PARA CARREGAR"
                            ></v-text-field>
                        </v-container>
                    </v-col>
                <v-col sm="4">
                    <v-container fluid>
                        <v-autocomplete v-model="modelCliente" :items="items_clientes" :loading="isLoading" :search-input.sync="search" color="white" outlined dense hide-no-data hide-selected item-text="text"
                            item-value="codcli" label="PESQUISAR CLIENTE POR NOME" placeholder="INSIRA O NOME DE UM CLIENTE PARA COMECAR A PESQUISAR" hint="SELECIONE UM CLIENTE PARA VERIFICAR AS DUPLICATAS EM ABERTO E APERTE ENTER PARA CARREGAR"
                            prepend-icon="mdi-database-search" @change="getDuplicatas()" return-object>
                        </v-autocomplete>
                        <!-- <v-text-field readonly required label="NOME/RAZAO SOCIAL" v-model="modelCliente" outlined dense required></v-text-field> -->
                    </v-container>
                </v-col>

                <v-col>
                    <v-container fluid>
                        <v-text-field readonly required label="FUNCIONARIO DE REGISTRO - PIX" v-model="modelNomeCodFuncRegistra" outlined dense></v-text-field>
                    </v-container>
                </v-col>
                <v-col>
                    <v-container fluid>
                        <v-text-field readonly required label="COD FUNCIONARIO DE REGISTRO - PIX" v-model="modelNomeFuncRegistra" outlined dense></v-text-field>
                    </v-container>
                </v-col>
                <v-col>
                    <v-container fluid>
                        <v-text-field readonly required label="POSICAO DAS OS DE SEPARACAO" v-model="modelPosicaoOs" outlined dense></v-text-field>
                    </v-container>
                </v-col>
                    <span v-if="modelCodFilial">STEP 2 - AGORA SELECIONE UM PEDIDO <v-icon v-if="modelCombobox">mdi-check</v-icon></span>
                <v-col>
                    <v-container fluid>
                        <v-combobox required v-model="modelCombobox" :items="items" label="PEDIDOS - SELECIONE APENAS 1" item-value="numped" item-text='pedido' multiple outlined dense return-object :rules="[v => !!v || 'SELECIONE AO MENOS 1 PEDIDO!']"></v-combobox>
                    </v-container>
                </v-col>
            </v-form>
        </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters>
        <v-col v-if="modelCombobox" cols="12" sm="12">
            <span v-if="modelCodFilial">STEP 3 - VERIFIQUE OS DADOS DO PEDIDO E CONFIRME-O MARCANDO O CHECKBOX DE CONFIRMACAO<v-icon v-if="modelPedidoConfirmado===true">mdi-check</v-icon></span>
            <v-col class="d-flex" cols="12" sm="12">
                <v-container fluid>
                    <template>
                        <H1 style="text-align:center" class="font-weight-light mb-2 center"><B>CONFIRMACAO DE DADOS PARA GERACAO DE PIX</B></H1>
                        <v-divider></v-divider>
                    </template>
                    <v-col cols="12">
                        <v-row v-for="(item, index) in getmodelCombobox" :key="index">
                            <v-col>
                                <span><b>PEDIDO:</b> {{ item.numped }} - <b>CLIENTE:</b> {{ item.cliente }} - <b>VALOR:</b> {{ item.valor }}</span> 
                            </v-col>
                            <v-col>
                                <v-checkbox @change="check($event)" required :label="`CONFIRMO PIX ESTE PEDIDO: ${modelPedidoConfirmado.toString()}`" color="success" v-model="modelPedidoConfirmado">
                                </v-checkbox>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-container>
			</v-col>
		</v-col>
    </v-row>
    <v-row v-if="modelCombobox">
        <span>STEP 4 - VERIFIQUE SE O TOKEN ESTÁ VALIDO, SE NAO ESTIVER, RENOVEO PARA HABILITAR O BOTAO DE GERAR PIX E SIGA AS PROXIMAS ETAPAS!<v-icon v-if="registerTokenOk">mdi-check</v-icon></span>
		<hr>
    </v-row>
    <v-row>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="getOauthToken">RECARREGAR TOKEN
            </v-btn>
            <v-btn @click="reloadPage">CANCELAR</v-btn>
            <v-btn :disabled="modelPedidoConfirmado===false" @click="DialogConfirmacaoPix=true;">GERAR PIX/QRCODE</v-btn>
            </v-card-actions>
    </v-row>

<v-dialog v-model="DialogConfirmacaoPix" width="500">
    <v-card>
        <v-card-title class="text-h5 grey lighten-2">CONFIRMACAO DE GERACAO DE PIX</v-card-title>
            <v-card-text>AO GERAR UM PIX, A CHAVE TEM VALIDADE DE 1 HORA. QUANDO CLICAR EM CONFIRMAR, ESSA JANELA SERA FECHADA, E SERA ABERTA UMA NOVA COM O QRCODE PARA PAGAMENTO.</v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="RegistraPix()" target="_blank">SIM, CONFIRMO GERACAO DO PIX
                    </v-btn>
                </v-card-actions>
    </v-card>
</v-dialog>

<v-dialog v-model="dialog" hide-overlay persistent width="400">
    <v-card>
        <v-card-title class="text-h5 grey lighten-2">{{msgloadfunction}}</v-card-title>
            <v-card-text>
                <v-col>
                    <span v-if="registerPixOk">{{errorDataPix}}</span><v-icon v-if="registerPixOk" right>mdi-cancel</v-icon>
                    <span v-if="registerTokenOk">{{errorDataToken}}</span><span v-else>{{errorDataToken}}</span><v-icon v-if="errorDataToken" right>mdi-check</v-icon>
                </v-col>
                <v-col>
                    <span v-if=loadDataPix>Carregando...</span>
                    <v-progress-circular :value="value" v-if=loadDataPix color="primary">{{value}}</v-progress-circular>
                    {{msgok}}
                </v-col>
            </v-card-text>
    </v-card>
</v-dialog>

<v-dialog v-model="dialogqrcode" hide-overlay persistent width="400" height="500">
    <v-card>
        <v-card-title style="text-align:center" class="text-h5 grey lighten-2 center">{{msgloadfunction}}</v-card-title>
            <hr>
            <v-card-text>
                <v-col>
                    <br>
                    <B><span v-if="txid">NUMERO DA TRANSACAO PIX - TXID PIX: {{txid}}</span></B>
                    <br>
                    <br>
                    <br>
                    <v-text-field readonly v-model="copypasteqrcode" ref="textToCopy"></v-text-field>
                    <v-btn @click="copyText">COPIAR CODIGO COPIA E COLA PIX</v-btn>
                    <hr>
                    <VueCountdown v-if="txtimgqrcode" :time="60 * 60 * 1000" v-slot="{ minutes, seconds }">
                    <span style="text-align:center" class="font-weight-light mb-2 center">Tempo para o Token Expirar {{ minutes }} minutos, {{ seconds }} segundos.</span>
                    </VueCountdown>
                    <hr>
                    <span v-if="msg">{{msg}}</span>
                    <span v-if="msgcred">{{msgcred}}</span>
                    <span v-if="msgpixbaixa">{{msgpixbaixa}}</span>
                    <span v-if="msgpixbaixa">{{msglibped}}</span>
                    <VueQrcode v-if="txtimgqrcode" :value="txtimgqrcode" :options="{ width: 200 }">{{txtimgqrcode}}</VueQrcode>
                    <v-img v-else lazy-src="http://cdn.rofedistribuidora.com/images/PIX_PAYMENT_OK.jpg" max-height="300" max-width="300" src="	https://www.silbeck.com.br/wp-content/uploads/2021/06/Prancheta-2@300x-100-scaled.jpg"></v-img>
                    <v-spacer></v-spacer>
                    <v-progress-circular v-if="txtimgqrcode" indeterminate color="green"></v-progress-circular>
                    <span v-if="retornoPagamentoPix">{{retornoPagamentoPix}}</span>
                </v-col>
            </v-card-text>
    </v-card>
</v-dialog>

  </v-container>
</template>

<script>

import axios from 'axios';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import VueCountdown from '@chenfengyuan/vue-countdown';




  export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name:'PagamentoPixDuplicatas',
  components: {
    VueQrcode,
    VueCountdown
  },
data: () => ({items_parcelas:[{"descricao":"1x - 2% JUROS","valor":1,"juros":2},{"descricao":"2x - 2% JUROS","valor":2,"juros":2},{"descricao":"3x - 2% JUROS","valor":3,"juros":2},{"descricao":"4x - 3% JUROS","valor":4,"juros":3},{"descricao":"5x - 3% JUROS","valor":5,"juros":3},{"descricao":"6x - 3% JUROS","valor":6,"juros":3},{"descricao":"7x - 5% JUROS","valor":7,"juros":5},{"descricao":"8x - 5% JUROS","valor":8,"juros":5},{"descricao":"9x - 5% JUROS","valor":9,"juros":5},{"descricao":"10x - 5% JUROS","valor":10,"juros":5},{"descricao":"11x - 5% JUROS","valor":11,"juros":5},{"descricao":"12x - 5% JUROS","valor":12,"juros":5}],
        // eslint-disable-next-line no-unused-vars
        copypasteqrcode:null,rules: {percententrada: [val => val < 30 || 'VOCE TEM CERTEZA?'],vlparcela:[val => this.modelNumParcela.valor < 30 || 'VOCE TEM CERTEZA?']},
        msgok:null,msgRegisterToken:null,dialog:false,msgloadfunction:null,msg:null,loadData:false,counting:true,modelTotal:null,minValue:30,maxValue:100,
        errorData:null,errorDataToken:null,errorDataPix:null,oauthToken:null,expirein:null,modelNumParcela:null,modelVlParcela:null,modelEntrada:null,
        gwDevAppKey:'7091c08b0fffbe00136ce18130050a56b9f1a5b5',codfilial:null,items:[],modelPercentEntrada:{"descricao":"30%","valor":30},modelPercentEntrada2:0,
        items_duplicatas:[],items_clientes:[],entries: [],isLoading: false,search: null,items_entrada:[{"descricao":"30%","valor":30}],
        modelCombobox:"",modelPosicaoOs:"",modelNomeFuncRegistra:"",modelCliente:"",modelCodCli:null,msgLoadDuplic:null,modelFinanciamento:null,
        modelCodFilial:null,step1:null,modelPedidoConfirmado:false,txid:null,DialogConfirmacaoPix:false,modelcpfcnpj:null,
        value:0,loadDataPix:null,registerPixOk:false,registerTokenOk:false,dialogqrcode:null,e1: 1,modelvltotalFinanciado:null,modelvltotalFinanciadoentrada:null,
        responsepix:[],retornoPagamentoPix:null,loadRetornoPagamento:false,numped:null,codcli:null,vlatend:null,cpfcnpj:null,cliente:null,loadfunc:false,modelEmailCliente:null
  }),
	created: function(){
		this.modelNomeFuncRegistra='TI';
		this.modelNomeCodFuncRegistra='5555';
		this.loadfunc=false;
    },
    watch:{
        search (val){
            if(val!=null){
                axios({method: 'get',url:'http://192.168.1.34:9000/cadastro/cliente/nome/'+val,headers: {},data:{}
				}).then(response => {//this.modelCliente=response.data.cliente;
				this.items_clientes = response.data.map(item => {
                return {codcli:item.codcli,cliente:item.cliente,cpfcnpj:item.cpfcnpj,text:item.codcli + ' - ' + item.cliente};});
				console.log(this.items_clientes);val=null;this.modelCodCli=this.items_clientes[0].codcli;
				this.cliente=this.items_clientes[0].cliente;
				this.modelcpfcnpj=this.items_clientes[0].cpfcnpj;console.log('CPF/CNPJ: ' + this.modelcpfcnpj);
				//this.modelEmailCliente=this.items_clientes[0].cpfcnpj;
            }).catch(error => {console.log('ERROR: ' + error)})
            }else{
            console.log("VAZIO")
            }
        },
    },
	computed:{
		totalDuplicAberto(){let sum = 0;
		this.items_duplicatas.forEach(function(item) {
			sum += (parseFloat(item.valor));
			});
			return sum},
		total(){let sum = 0;
		this.modelCombobox.forEach(function(item) {
			sum += (parseFloat(item.vltotaljurosmora));
			});
			return sum},
		// eslint-disable-next-line vue/return-in-computed-property
		// eslint-disable-next-line no-unused-vars
            getmodelCombobox(){console.log(this.modelCombobox)
            if(this.modelCombobox==null){
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.modelPosicaoOs=null;
            }else{
            if(this.modelCombobox.length>0){
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.modelPosicaoOs=this.modelCombobox[0].posicaoos;
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.numped=this.modelCombobox[0].numped;
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.codcli=this.modelCombobox[0].codcli;
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.vlatend=this.modelCombobox[0].valor;
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.cpfcnpj=this.modelCombobox[0].cpfcnpj;
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.cliente=this.modelCombobox[0].cliente
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                }else{this.modelPosicaoOs=null;
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.numped=null;}}
            return this.modelCombobox
		},
		axiosParams() {const params = new URLSearchParams();params.append('grant_type', 'client_credentials');params.append('scope', 'cob.write cob.read pix.read pix.write');return params;},
	},
	async mounted() {
		this.getOauthToken();},
	methods: {
	reloadPage(){
        window.location.reload();},
	onCountdownEnd: function () {
      this.counting = false;},
		check($event){this.modelPedidoConfirmado = $event;},
		async getOauthToken(){
			this.counting=true;
			this.msgRegisterToken="GERANDO TOKEN...";
            this.errorDataPix=null;
            this.registerPixOk=null;
            this.dialog=true;
            this.registerTokenOk=false;
            let timetoexpire=null;
            let dthrtoken = new Date();
			return axios({method: 'post',url:'https://oauth.bb.com.br/oauth/token',params: this.axiosParams,
			headers: {
				"Content-Type":"application/x-www-form-urlencoded","Accept":"*/*","Authorization":'Basic ZXlKcFpDSTZJalk1WkRreE1qUXRNR0ZsWVMwME5TSXNJbU52WkdsbmIxQjFZbXhwWTJGa2IzSWlPakFzSW1OdlpHbG5iMU52Wm5SM1lYSmxJam95TWpjNU1Td2ljMlZ4ZFdWdVkybGhiRWx1YzNSaGJHRmpZVzhpT2pGOTpleUpwWkNJNklqYzFZemRsTWpJdE1EZGlOeTAwTldZNUxUazBNR1F0T0RNNVpqUmtORGxsTXpOaU5tVmlZall5TXpjdFlXTmhJaXdpWTI5a2FXZHZVSFZpYkdsallXUnZjaUk2TUN3aVkyOWthV2R2VTI5bWRIZGhjbVVpT2pJeU56a3hMQ0p6WlhGMVpXNWphV0ZzU1c1emRHRnNZV05oYnlJNk1Td2ljMlZ4ZFdWdVkybGhiRU55WldSbGJtTnBZV3dpT2pFc0ltRnRZbWxsYm5SbElqb2ljSEp2WkhWallXOGlMQ0pwWVhRaU9qRTJOREkyT1RNNE5qRTFNak45'}, data:URLSearchParams
			}).then(response => {
				this.oauthToken=response.data.token_type+' '+response.data.access_token;timetoexpire=response.data.expires_in;this.registerTokenOk=true;this.errorDataToken='TOKEN RENOVADO COM SUCESSO!';this.msgRegisterToken='TOKEN VALIDO';this.ValidaToken(dthrtoken,timetoexpire);
				setTimeout(() => {  this.dialog=false; }, 3000);
            }).catch(error => {
            this.errorDataToken=error;this.registerTokenOk=false;console.log(error);this.msgRegisterToken='TOKEN VALIDO';this.msgloadfunction=null;setTimeout(() => {  this.dialog=false; }, 3000);
            });
		},
		RegistraPix(){
			this.msgLoadDuplic=null;
			this.msgloadfunction=null;this.errorDataToken=null;this.loadDataPix=true
			this.value=0;this.txid=null;this.errorDataPix=null;this.registerPixOk=false;this.msgloadfunction='REGISTRANDO PIX...';this.dialog=true;
			let gwDevAppKey=this.gwDevAppKey;let token=this.oauthToken;let docdata=null;
			if(this.cpfcnpj.length==11){docdata={"calendario": {"expiracao": "3600"},"devedor": {"cpf": this.cpfcnpj,"nome": this.cliente},
            "valor": {"original": this.modelEntrada},"chave": "rofe@rofedistribuidora.com.br","solicitacaoPagador": 'COB. ROFE RENEGOCIACAO - ' + '0' + ' - FILIAL: ' + '99' + ' - ' + this.codcli}
			}else{docdata={"calendario": {"expiracao": "3600"},"devedor": {"cnpj": this.cpfcnpj,"nome": this.cliente},
            "valor": {"original": this.modelEntrada},"chave": "rofe@rofedistribuidora.com.br","solicitacaoPagador": 'COB. ROFE RENEGOCIACAO - ' + '0' + ' - FILIAL: ' + '99' + ' - ' + this.codcli}
			}
			axios({method: 'put',url:'https://api.bb.com.br/pix/v1/cobqrcode/?gw-dev-app-key='+gwDevAppKey,
			data: docdata,headers: {ContentType:"application/json","Authorization":token,"Accept":"*/*" }, 
			}).then(response => {
				this.msgloadfunction="PIX GERADO COM SUCESSO - QRCODE ";
				this.txid=response.data.txid;this.responsepix=response.data;
				this.errorDataPix=null;this.value=100;this.loadDataPix=null;
				this.msgok='PIX CRIADO COM SUCESSO! AGUARDE A GERACAO DO QRCODE..';console.log(this.msgok);console.log(response);
				this.copypasteqrcode=response.data.textoImagemQRcode;
				//console.log(response.data.textoImagemQRcode)
				this.InsertPixLog();this.registerPixOk=false;
				setTimeout(() => {  this.dialog=false; }, 3000);
				this.DialogConfirmacaoPix=false;this.dialogqrcode=true;this.getPixPagamento();
                }).catch(error => {
                setTimeout(() => {this.errorDataPix=error;console.log(error);this.value=100;
                this.loadDataPix=null;this.registerPixOk=true;
                this.dialog=false;console.log('TENTANDO REGISTRAR PIX NOVAMENTE..');this.RegistraPix(); }, 4000);
            });
	},
	getDuplicatas(){
		this.modelCombobox=null;
		this.dialog=true;this.msgRegisterToken=null;this.errorDataToken=null;let codcli=this.modelCodCli;this.msgLoadDuplic='CARREGANDO DUPLICATAS...';
      axios.get('http://192.168.1.34:9000/duplicatas/duplic/codcli/'+codcli
      ,{ headers:{}
      }).then(response =>{
			if(response.data=='NENHUM REGISTRO ENCONTRADO -- GET DUPLIC EM ABERTO'){this.modelCombobox=null;
				console.log(response.data);this.items=null;this.modelCombobox=null;this.modelPosicaoOs=null;this.numped=null;
				this.msgLoadDuplic='NENHUMA DUPLICATA EM ABERTO ENCONTRADA';this.modelCombobox=null;setTimeout(() => {  this.dialog=false; }, 3000);
			}else{
			this.msgLoadDuplic='DUPLICATAS ENCONTRADAS, MAPEANDO..';this.modelCombobox=null;
			console.log('DUPLICATAS ENCONTRADAS, MAPEANDO RESULTADO..');this.items_duplicatas = response.data.map(item => {
            return {
              pedido:'CLIENTE: ' + item.CODCLI + ' - ' + item.CLIENTE + ' DUPLIC: ' + item.DUPLIC  + ' -  PREST: ' + item.PREST + ' - VALOR: ' + item.VALOR + 'PEDIDO: ' + item.NUMPED + ' - FILIAL: ' + item.CODFILIAL + ' - DATA: ' + item.DTVENC + ' - DOCUMENTO: ' + item.CPFCNPJ,
              numped:item.NUMPED,cliente:item.CLIENTE,valor:item.VALOR,duplicata:item.DUPLIC,prest:item.PREST,cpfcnpj:item.CPFCNPJ,codcli:item.CODCLI,dtvenc:item.DTVENC,vlmulta:item.VALORMULTA,qtdias:item.QTDIAS,qtdiasuteis:item.QTDIASUTEIS,vlmora:item.VLMORA,vltotaljurosmora:item.VLTOTALJUROSMULTA,emailcliente:item.EMAIL
            };
          });console.log(this.items_duplicatas[0].cliente);this.modelCliente=this.items_duplicatas[0].cliente;this.modelcpfcnpj=this.items_duplicatas[0].cpfcnpj;this.modelEmailCliente=this.items_duplicatas[0].emailcliente;this.cliente=this.items_duplicatas[0].cliente;
			}setTimeout(() => {  this.dialog=false; }, 3000);
        }).catch(error => {this.msg='ERRO AO CARREGAR DUPLICATAS! -- GET DUPLICATAS';this.modelCombobox=null;console.log(error);this.dialog=false;});
    },
    InsertPixLog(){
        console.log('INSERINDO REGISTRO DE PIX...')
        let docdatapix=null;let codfilial=99;let numped=0 ;let txid=this.responsepix.txid;
        if(this.cpfcnpj.length==11){
				docdatapix={"txid": this.txid,"vlpix": this.responsepix.valor.original,"cpfcnpj": this.responsepix.devedor.cpf,
		"txtimgqrcode": this.responsepix.textoImagemQRcode,"numrevisao": this.responsepix.revisao,"status": this.responsepix.status,
		"dtexpiracao": "","obspix": this.responsepix.solicitacaoPagador,"dtcriacaopix": this.responsepix.calendario.criacao,
		"codfilial": this.modelCodFilial,"codfuncpix": this.modelNomeCodFuncRegistra,"expiration_time": this.responsepix.calendario.expiracao}
			}else{
				docdatapix={"txid": txid,"vlpix": this.responsepix.valor.original,"cpfcnpj": this.responsepix.devedor.cnpj,
		"txtimgqrcode": this.responsepix.textoImagemQRcode,"numrevisao": this.responsepix.revisao,"status": this.responsepix.status,
		"dtexpiracao": "","obspix": this.responsepix.solicitacaoPagador,"dtcriacaopix": this.responsepix.calendario.criacao,
		"codfilial": this.modelCodFilial,"codfuncpix": this.modelNomeCodFuncRegistra,"expiration_time": this.responsepix.calendario.expiracao}	
        }
      axios.post('http://192.168.1.34:9000/pix/numped/'+numped+'/codfilial/'+codfilial,{ 
        data:docdatapix,headers:{},
      }).then(response =>{
			console.log('REGISTRO DE PIX INSERIDO COM SUCESSO!');console.log(response);this.msg=null;
			//this.DisparaEmail();
        }).catch(error => {this.msg='ERRO AO INSERIR REGISTRO DE PIX';console.log(error);});
    },
		getPixPagamento(){
			this.loadRetornoPagamento=false;let token=this.oauthToken;
			let gwDevAppKey=this.gwDevAppKey;let txid=this.txid;
	axios({method: 'get',url:'https://api.bb.com.br/pix/v1/cob/'+txid+'?gw-dev-app-key='+gwDevAppKey,
			headers: {"Authorization":token,'Access-Control-Allow-Origin' : '*'}, 
			data:{}
			}).then(response => {
				if(response.data.status=='ATIVA'){
					console.log('PAGAMENTO NAO REALIZADO. BUSCANDO PAGAMENTO...')
					setTimeout(() => { this.getPixPagamento()  }, 5000);
					this.retornoPagamentoPix='Buscando Pagamento, Aguarde...';
				}else{
					if(response.data.status=='CONCLUIDA'){console.log('PIX PAGO COM SUCESSO!');
						this.retornoPagamentoPix=response.data;this.loadRetornoPagamento=true;
						console.log(this.retornoPagamentoPix);this.responsepix.textoImagemQRcode=null;
						this.insertCredito618();
					}
				}}).catch(error => {
            this.retornoPagamentoPix='ERRO AO REALIZAR REQUISICAO, REALIZANDO NOVA TENTATIVA..';
            setTimeout(() => { this.getPixPagamento()  }, 5000);console.log('ERROR: ' + error)
            });
		},
		insertCredito618(){
			console.log('GERANDO CREDITO PARA O PEDIDO NO WINTHOR..')
			this.responsepix.textoImagemQRcode=null;let numped=0;let codfilial=99;
		axios({method: 'post',url:'http://192.168.1.34:9000/pix/credito/numped/'+numped+'/'+'codfilial/'+codfilial
		,headers: {'Access-Control-Allow-Origin' : '*'},
			data:{"numped": 0,"codfilial": 99,"codcli": this.codcli,"codhistorico": "61",
				"valor": this.responsepix.valor.original,"codbanco":"1","matricula":this.modelNomeCodFuncRegistra,"situacao":"P"}
			}).then(response => {
				console.log('CREDITO PIX GERADO COM SUCESSO!');console.log(response);setTimeout(() => {  }, 5000);	
				this.BaixaPixWinthor();
            }).catch(error => {
                console.log(error)
            console.log('ERRO AO GERAR CREDITO PIX');
            });
		},
		BaixaPixWinthor(){let txid=this.txid;console.log('BAIXANDO PIX NO WINTHOR...');
		axios.post('http://192.168.1.34:9000/pix/baixa/txid/'+txid
      ,{ headers:{},data:{"valor": this.retornoPagamentoPix.pix[0].valor,"matricula":this.modelNomeCodFuncRegistra,"status":this.retornoPagamentoPix.status,
			"idpagpix":this.retornoPagamentoPix.pix[0].endToEndId,"dthrpagpix":this.retornoPagamentoPix.pix[0].horario
			}, 
      }).then(response =>{
			console.log('PIX BAIXADO COM SUCESSO NO WINTHOR');console.log(response);this.msg=null;
			this.DisparaEmail();
        }).catch(error => {this.msg='ERRO AO BAIXAR PIX';console.log(error);});
		},
		ValidaToken(dthrtoken,timetoexpire){
		let dthr = dthrtoken;let expiretoken=dthr.setSeconds(timetoexpire).toLocaleString('pt-BR');console.log(expiretoken);this.expirein=expiretoken;
		},
		getClientes(){
			this.loadRetornoPagamento=true;
            //let codcli=this.modelCodCli;
				axios({method: 'get',url:'http://192.168.1.34:9000/cadastro/clientes',headers: {},data:{}
				}).then(response => {this.modelCliente=response.data.cliente;
				this.items_clientes = response.data.map(item => {
                return {codcli:item.codcli,cliente:item.cliente,cpfcnpj:item.cgcent};});
				console.log(this.items_clientes)
                }).catch(error => {this.retornoPagamentoPix='ERRO AO CARREGAR CLIENTES';console.log('ERROR: ' + error)})
		},
	DisparaEmail(){
		let txid=this.txid;
		this.msg=null; let subject='RENEGOCIACAO ' + txid + ' REALIZADA COM SUCESSO - ROFE DISTRIBUIDORA';console.log('NOTIFICANDO POR EMAIL..');
		axios.post('http://192.168.1.34:9000/actions/email/rofedistribuidoracom/disparaemail'
      ,{ headers:{}
      ,data:{"host": "rofedistribuidora.com","secure":'TRUE',"port":465,
			"user": "cobranca@rofedistribuidora.com","pass": "cobranca@rofe123",
			"from": "cobranca@rofedistribuidora.com","to":this.modelEmailCliente,
			"cc1":"cobranca@rofedistribuidora.com.br","cc2":"rodrigo.hilario@rofedistribuidora.com.br","bco":"","replyto":"cobranca@rofedistribuidora.com.br","subject": subject,"text": subject,
			"codcli":this.codcli,"cliente":this.cliente,
			"numped":0,"vlpedido":this.modelEntrada,"vlpix":this.retornoPagamentoPix.pix[0].valor,
			"txid":txid,
			"endtoend":this.retornoPagamentoPix.pix[0].endToEndId,"codfilial":this.modelCodFilial,
			"duplicatas":this.modelCombobox,
			},
      }).then(response =>{
			console.log('EMAIL ENVIADO COM SUCESSO!');console.log(response);this.msg="E-MAIL ENVIADO COM SUCESSO - "
        }).catch(error => {this.msg='ERRO AO ENVIAR EMAIL - ';console.log(error);});
		},

        copyText () {
          let textToCopy = this.$refs.textToCopy.$el.querySelector('input')
          textToCopy.select()
          document.execCommand("copy");
        },
        LogsRenegociacao(){
        },
	},

  }
</script>