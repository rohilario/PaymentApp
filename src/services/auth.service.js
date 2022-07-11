//AUTH SERVICE
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import router from '../router'

const API_URL = 'http://192.168.1.34:7000/users/';
const BASE_URL = 'http://192.168.1.34:9000/auth/rca/token/create';

class AuthService {
    async login(params) {
        return axios.post(BASE_URL, {
            headers: {},
            data: { usr: params.usr, pass: params.pass },
        }).then(response => {
            if (response.data.auth == true) {
                //console.log(true)
                localStorage.setItem('nome', JSON.stringify(response.data.nome))
                localStorage.setItem('codrca', JSON.stringify(response.data.codrca))
                localStorage.setItem('token', JSON.stringify(response.data.token))
            }
            //console.log(response.data);
            return response.data;
        }).catch(error => {
            console.log(error);
        });
    }

    logout() {
        localStorage.removeItem('token');
    }

    register(user) {
        return axios.post(API_URL + "signup", {
            nome: user.nome,
            mail: user.mail,
            cpfcnpj: user.cpfcnpj,
            passwd: user.passwd,
        });
    }
}

export default new AuthService();