// eslint-disable-next-line vue/multi-word-component-names
<template>
  <v-container>
          <v-row>
            <v-col cols="12">
							<b><h1 style="text-align:center" class="font-weight-light mb-2 center">GERAR FATURAMENTO POR PEDIDO</h1></b>
                <v-col cols="12" align="center" justify="space-around">
                  <v-btn text block color="green" v-if="registerTokenOk" class="ma-2">{{msgRegisterToken}}<v-icon right>mdi-checkbox-marked-circle</v-icon>
                  </v-btn>
                  <v-btn text block color="red" v-else class="ma-2">SEM TOKEN, GERE OU RENOVE NO BOTAO ABAIXO!<v-icon right>mdi-cancel</v-icon></v-btn>
                  <VueCountdown :time="10 * 60 * 1000" v-slot="{ minutes, seconds }">
                    <span v-if="expirein" style="text-align:center" class="font-weight-light mb-2 center">Tempo para o Token Expirar {{ minutes }} minutos, {{ seconds }} segundos.</span>
                  </VueCountdown>
                  <span v-if="expirein">{{expirein}}</span>
                </v-col>
              </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
            <v-form ref="form" lazy-validation>
							<hr>
							<v-col cols="12" sm="12">
                <v-container fluid>
                    <span>STEP 1 - PREENCHA A FILIAL PARA COMECAR <v-icon v-if="modelCodFilial">mdi-check</v-icon> </span>
                </v-container>
							</v-col>
							<v-col>
              <v-container fluid>
									<v-select required :items="items_filial" item-value="codfilial" item-text="filial" dense outlined
									v-model='modelCodFilial' label="Codigo Filial" @change="GetPedidos()"
									hint="SELECIONE A SUA FILIAL PARA VALIDAR OS DADOS NO WINTHOR"
									></v-select>
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
                    <v-card-text>AO GERAR UM PIX, A CHAVE TEM VALIDADE DE 1 HORA. QUANDO CLICAR EM CONFIRMAR, ESSA JANELA SERA FECHADA, E SERA ABERTA UMA NOVA COM O QRCODE PARA PAGAMENTO.
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="RegistraPix()"  target="_blank">SIM, CONFIRMO GERACAO DO PIX
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
                      <span v-if=loadDataPix>Carregando...</span>
                      <v-progress-circular :value="value" v-if=loadDataPix color="primary">{{value}}</v-progress-circular>
                      {{msgok}}
                    </v-card-text>
                  </v-card>
              </v-dialog>
              <v-dialog v-model="dialogqrcode" hide-overlay persistent width="400" height="500">
                <v-card>
                <v-card-title style="text-align:center" class="text-h5 grey lighten-2 center">{{msgloadfunction}}</v-card-title>
                <hr>
                  <v-card-text>
                    <col>
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
  name:'Payment',
  components: {
    VueQrcode,
    VueCountdown
  },
  data: () => ({copypasteqrcode:null,msglibped:null,
    emailcliente:null,msgcred:null,msgpixbaixa:null,txtimgqrcode:null,
    msgok:null,msgRegisterToken:null,dialog:false,msgloadfunction:null,msg:null,loadData:false,counting: true,
    errorData:null,errorDataToken:null,errorDataPix:null,oauthToken:null,expirein:null,
    gwDevAppKey:'7091c08b0fffbe00136ce18130050a56b9f1a5b5',codfilial:null,items:[],
    items_filial:[{codfilial: '1', filial: '1 - COMERCIAL ROFE [MA]'},{codfilial: '6', filial: '6 - COMERCIAL ROFE [PI]'},{codfilial: '8', filial: '8 - COMERCIAL ROFE [PA]'}],
    modelCombobox:"",modelPosicaoOs:"",modelNomeFuncRegistra:"",modelNomeCodFuncRegistra:"",
    modelCodFilial:null,step1:null,modelPedidoConfirmado:false,txid:null,DialogConfirmacaoPix:false,
    value:0,loadDataPix:null,registerPixOk:false,registerTokenOk:false,dialogqrcode:null,
    responsepix:[],retornoPagamentoPix:null,loadRetornoPagamento:false,numped:null,codcli:null,vlatend:null,cpfcnpj:null,cliente:null,loadfunc:false,
  }),
created: function(){
		this.modelNomeFuncRegistra='5555'
		this.modelNomeCodFuncRegistra=localStorage.getItem('nome')
		this.loadfunc=false
    },
	computed:{
      getmodelCombobox() {
        console.log(this.modelCombobox)
        if(this.modelCombobox==null){
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.modelPosicaoOs=null;
        }else{
        if(this.modelCombobox.length>0){
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.modelPosicaoOs=this.modelCombobox[0].posicaoos
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.numped=this.modelCombobox[0].numped
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.codcli=this.modelCombobox[0].codcli
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.vlatend=this.modelCombobox[0].valor
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.cpfcnpj=this.modelCombobox[0].cpfcnpj
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.cliente=this.modelCombobox[0].cliente
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.emailcliente=this.modelCombobox[0].emailnfe
            }else{
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.modelPosicaoOs=null;
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.numped=null;
              }
        }
			return this.modelCombobox
		},
	},

  async mounted() {
    this.getOauthToken();
  },
  methods:{
    async getOauthToken(){
			this.msgRegisterToken="Gerando Token...";this.errorDataPix=null;this.registerPixOk=null;
			this.msgloadfunction='Carregando Token...';this.dialog=true;
			this.registerTokenOk=false;

			return axios({method: 'get',url:'http://192.168.1.34:9000/pix/bradesco/token',
			headers: {}
			}).then(response => {
				console.log(response)
				this.oauthToken=response.data.token_type+' '+ response.data.access_token;
				this.registerTokenOk=true;
				this.errorDataToken='TOKEN RENOVADO COM SUCESSO!'
				this.msgRegisterToken='TOKEN VALIDO'
				console.log(this.oauthToken)
				setTimeout(() => {  this.dialog=false; }, 2000);
        }).catch(error => {
        this.errorDataToken=error;
        this.registerTokenOk=false;
        console.log(error);
        this.msgRegisterToken='TOKEN VALIDO';
        setTimeout(() => {  this.dialog=false; }, 3000);
        });
		},

  RegistraPix(){
			console.log(this.vlatend.toLocaleString(undefined,{ minimumFractionDigits: 2 }))
			console.log(this.oauthToken);
			this.msgloadfunction=null;
			this.errorDataToken=null;
			this.loadDataPix=true
			this.value=0;
			this.txid=null;
			this.errorDataPix=null;
			this.registerPixOk=false;
			this.msgloadfunction='REGISTRANDO PIX...'
			this.dialog=true;
			let docdata=null;
			if(this.cpfcnpj.length==11){
			docdata={"nomePersonalizacaoQr":"ROFE","calendario": {"expiracao": "86400"},
				"devedor": {"cpf": this.cpfcnpj,"nome": this.cliente},
				"valor": {"original": 0.01,"modalidadeAlteracao": 0},
				"chave": "05300197000106","solicitacaoPagador": 'PED. ROFE FRENTE DE LOJA - ' + this.numped + ' - FILIAL: ' + this.modelCodFilial + ' - ' + this.codcli}		
			}else{
				docdata={"nomePersonalizacaoQr":"ROFE","calendario": {"expiracao": "86400"},
				"devedor": {"cnpj": this.cpfcnpj,"nome": this.cliente},
				"valor": {"original": 0.01,"modalidadeAlteracao": 0},
				"chave": "05300197000106","solicitacaoPagador": 'PED. ROFE FRENTE DE LOJA - ' + this.numped + ' - FILIAL: ' + this.modelCodFilial + ' - ' + this.codcli}
			}
			axios({method: 'post',url:'http://192.168.1.34:9000/pix/Bradesco/RegistrarPix/estatico',
			data: docdata,
			headers: {ContentType:"application/json","Authorization":this.oauthToken,"Accept":"*/*",'Access-Control-Allow-Origin' : '*'}, 
			}).then(response => {
				this.msgloadfunction="PIX GERADO COM SUCESSO - QRCODE "
				this.txid=response.data.cob.txid;this.responsepix=response.data;
				this.txtimgqrcode=response.data.emv;
				this.errorDataPix=null;this.value=100;this.loadDataPix=null;
				this.msgok='PIX CRIADO COM SUCESSO! AGUARDE A GERACAO DO QRCODE..';
				console.log(this.msgok);
				console.log(response);
				console.log(this.txtimgqrcode)
        this.copypasteqrcode=response.data.emv;
				this.InsertPixLog();
				this.registerPixOk=false;
				setTimeout(() => {  this.dialog=false; }, 3000);
				this.DialogConfirmacaoPix=false
				this.dialogqrcode=true;
				this.getPixPagamento();
        }).catch(error => {
        this.errorDataPix=error;
        console.log(error);
        this.value=100;this.loadDataPix=null;
        this.registerPixOk=true;
        console.log('TENTANDO REGISTRAR PIX NOVAMENTE..')
        //this.RegistraPix();
        setTimeout(() => {  this.dialog=false; }, 3000);
        });
	},
  GetPedidos(){
    const codrca=localStorage.getItem('codrca')
		let codfilial=this.modelCodFilial
      axios.get('http://192.168.1.34:9000/pedidos/entrega/rca/codfilial/'+codfilial+'/codrca/'+codrca
      ,{ 
      headers: {  } 
      }).then(response =>{
			if(response.data=='NENHUM REGISTRO ENCONTRADO -- GET PEDIDO FRENTE DE LOJA'){
				console.log(response.data);
				this.items=null;this.modelCombobox=null;this.modelPosicaoOs=null;this.numped=null;
			}else{
			console.log('PEDIDOS ENCONTRADOS, MAPEANDO RESULTADO..');
			this.items = response.data.map(item => {
            return {pedido:'PEDIDO: ' + item.NUMPED + ' - CLIENTE: ' + item.CODCLI+' - '+item.CLIENTE + ' - VLPED: ' + item.VALORTOTAL + ' - FILIAL: ' + item.CODFILIAL + ' - DATA: ' + item.DATA + ' - POSICAO PED: ' + item.POSICAOPED,numped:item.NUMPED,cliente:item.CLIENTE,valor:item.VALORTOTAL,posicaoos:item.POSICAOOS,cpfcnpj:item.CPFCNPJ,codcli:item.CODCLI,emailnfe:item.EMAILNFE};
          });
			}
        this.msg=null;
        })
      .catch(error => {
          this.msg='ERRO AO CARREGAR PEDIDOS POR FILIAL!'
          console.log(error);
        });
    },
    InsertPixLog(){
    console.log('INSERINDO REGISTRO DE PIX...')
    let docdatapix=null;
    let codfilial=this.modelCodFilial;
    let numped=this.numped;
    if(this.cpfcnpj.length==11){
				docdatapix={"nomePersonalizacaoQr":"ROFE","txid": this.txid,"vlpix": this.responsepix.cob.valor.original,"cpfcnpj": this.responsepix.cob.devedor.cpf,
		"txtimgqrcode": this.responsepix.emv,"numrevisao": this.responsepix.cob.revisao,"status": this.responsepix.cob.status,
		"dtexpiracao": "","obspix": this.responsepix.cob.solicitacaoPagador,"dtcriacaopix": this.responsepix.cob.calendario.criacao,
		"codfilial": this.modelCodFilial,"codfuncpix": this.modelNomeCodFuncRegistra,"expiration_time": this.responsepix.cob.calendario.expiracao,"banco":"237","tipopix":'PIX'}	
			}else{
			docdatapix={"nomePersonalizacaoQr":"ROFE","txid": this.txid,"vlpix": this.responsepix.cob.valor.original,"cpfcnpj": this.responsepix.cob.devedor.cnpj,
		"txtimgqrcode": this.responsepix.emv,"numrevisao": this.responsepix.cob.revisao,"status": this.responsepix.cob.status,
		"dtexpiracao": "","obspix": this.responsepix.cob.solicitacaoPagador,"dtcriacaopix": this.responsepix.cob.calendario.criacao,
		"codfilial": this.modelCodFilial,"codfuncpix": this.modelNomeCodFuncRegistra,"expiration_time": this.responsepix.cob.calendario.expiracao,"banco":"237","tipopix":'PIX'}	
      }
      axios.post('http://192.168.1.34:9000/pix/numped/'+numped+'/codfilial/'+codfilial
      ,{data:docdatapix,
      headers:{},
      }).then(response =>{
			console.log('REGISTRO DE PIX INSERIDO COM SUCESSO!')
          console.log(response);
          this.msg=null;
        })
        .catch(error => {
          this.msg='ERRO AO INSERIR REGISTRO DE PIX';console.log(error);
        });
    },
    getPixPagamento(){
			this.loadRetornoPagamento=true;
      let token=this.oauthToken;
      let txid=this.txid;
	axios({method: 'get',url:'http://192.168.1.34:9000/pix/Bradesco/pagamentos/'+txid,
			headers: {"Authorization":token,'Access-Control-Allow-Origin' : '*'},
			data:{}
			}).then(response => {
				if(response.data.status=='ATIVA'){
					console.log('PAGAMENTO NAO REALIZADO. BUSCANDO PAGAMENTO...')
					setTimeout(() => { this.getPixPagamento()  }, 5000);
					this.retornoPagamentoPix='Buscando Pagamento, Aguarde...';
				}else{
					if(response.data.status=='CONCLUIDA'){
						console.log('PIX PAGO COM SUCESSO!');
						this.retornoPagamentoPix=response.data
						this.loadRetornoPagamento=false;
						console.log(this.retornoPagamentoPix)
						this.responsepix.textoImagemQRcode=null;
						this.txtimgqrcode=null;
						this.insertCredito618();
					}
				}
        }).catch(error => {
        this.retornoPagamentoPix='ERRO AO REALIZAR REQUISICAO, REALIZANDO NOVA TENTATIVA..';
        setTimeout(() => { this.getPixPagamento()  }, 5000);
        console.log('ERROR: ' + error)
        });
		},
insertCredito618(){
			console.log('GERANDO CREDITO PARA O PEDIDO NO WINTHOR..')
			this.responsepix.textoImagemQRcode=null;let numped=this.numped;let codfilial=this.modelCodFilial;
		axios({method: 'post',url:'http://192.168.1.34:9000/pix/credito/numped/'+numped+'/'+'codfilial/'+codfilial
		,headers: {'Access-Control-Allow-Origin' : '*',
			},
			data:{
				"numped": this.numped,"codfilial": this.modelCodFilial,"codcli": this.codcli,"codhistorico": "61",
				"valor": this.responsepix.cob.valor.original,"codbanco":"237","matricula":5555,"situacao":""
				}
			}).then(response => {		
				console.log('CREDITO PIX GERADO COM SUCESSO!');
				console.log(response);
				setTimeout(() => {  }, 5000);	
				this.BaixaPixWinthor();	
        this.msgcred='CREDITO PIX GERADO COM SUCESSO! ' + response + ' - ';
        }).catch(error => {
        this.msgcred='ERRO AO GERAR CREDITO PIX - ' + error + ' - ';
        console.log('ERRO AO GERAR CREDITO PIX');
        });
		},
    BaixaPixWinthor(){
		let txid=this.txid;console.log('BAIXANDO PIX NO WINTHOR...');
		axios.post('http://192.168.1.34:9000/pix/baixa/txid/'+txid
      ,{headers:{},data:{
			"valor": this.retornoPagamentoPix.pix[0].valor,
			"matricula":5555,
			"status":this.retornoPagamentoPix.status,
			"idpagpix":this.retornoPagamentoPix.pix[0].endToEndId,
			"dthrpagpix":this.retornoPagamentoPix.pix[0].horario,
			},
      }).then(response =>{
			console.log('PIX BAIXADO COM SUCESSO NO WINTHOR')
          console.log(response);
          this.DisparaEmail(txid)
          this.msgpixbaixa='PIX BAIXADO COM SUCESSO NO WINTHOR';
          this.LiberaPedido();
        })
        .catch(error => {
          this.msgpixbaixa='ERRO AO BAIXAR PIX NO WINTHOR'
          console.log(error);
        });
		},

    DisparaEmail(txid){
		this.msg=null;
		let subject='COMPRA ' + this.numped + ' REALIZADA COM SUCESSO - ROFE DISTRIBUIDORA'
		console.log('NOTIFICANDO POR EMAIL..');
		axios.post('http://192.168.1.34:9000/actions/email/rofedistribuidoracom/disparaemail'
      ,{
      headers:{},
      data:{
			"dthrpagpix":null,
			"host": "server05.mailgrid.com.br","secure":'TRUE',"port":465,
			"user": "noreply@rofedistribuidora.com.br","pass": "aj37dne34s7hz",
			"from": "noreply@rofedistribuidora.com.br","to":this.emailcliente,
			"cc1":"caixa@rofedistribuidora.com.br","cc2":"rodrigo.hilario@rofedistribuidora.com.br","bco":"","replyto":"caixa@rofedistribuidora.com.br","subject": subject,"text": subject,
			"codcli":this.codcli,"cliente":this.cliente,
			"numped":this.numped,"vlpedido":this.vlatend,"vlpix":this.retornoPagamentoPix.pix[0].valor,
			"txid":txid,
			"endtoend":this.retornoPagamentoPix.pix[0].endToEndId,"codfilial":this.modelCodFilial,
			},
      }).then(response =>{
			console.log('EMAIL ENVIADO COM SUCESSO!');console.log(response);
      this.msg="E-MAIL ENVIADO COM SUCESSO - ";
        })
        .catch(error => {
          this.msg='ERRO AO ENVIAR EMAIL - ';console.log(error);
        });
		},
    LiberaPedido(){
			console.log('LIBERANDO PEDIDO NO WINTHOR..')
			this.responsepix.textoImagemQRcode=null;let numped=this.numped;let codfilial=this.modelCodFilial;
		axios({method: 'post',url:'http://192.168.1.34:9000/pedidos/liberacao/codfilial/'+codfilial+'/'+numped
		,headers: {'Access-Control-Allow-Origin' : '*',
			},
			}).then(response => {		
				console.log('PEDIDO LIBERADO COM SUCESSO!');
				console.log(response);
				setTimeout(() => {  }, 5000);		
        this.msglibped='PEDIDO LIBERADO COM SUCESSO! ' + response + ' - ';
        }).catch(error => {
        this.msglibped='ERRO AO LIBERAR PEDIDO - ' + error + ' - ';
        console.log('ERRO AO LIBERAR PEDIDO');
        });
		},
      copyText () {
          let textToCopy = this.$refs.textToCopy.$el.querySelector('input')
          textToCopy.select()
          document.execCommand("copy");
        },

  }
  
  }
  
</script>