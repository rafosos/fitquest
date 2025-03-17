import axios, { AxiosRequestConfig } from "axios";
import { Platform } from "react-native";

const API_URL = Platform.OS == "web" ? 'http://localhost:8000' : 
'http://192.168.0.14:8000'; //casa
// 'http://192.168.236.82:8000'; //cel
// 'http://172.17.99.32:8000'; //facul
// 'http://192.168.162.156:8000'; //facul L
// 'http://172.17.106.70:8000'; //facul biblio
// "https://fitquest-8s1c.onrender.com" //prod

axios.defaults.baseURL = API_URL
axios.defaults.paramsSerializer = { indexes:null }

const get = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.get<T>(endpoint, {params})

const post = <T extends unknown>(endpoint: string, params: any = {}, config :AxiosRequestConfig<any> = {}) => 
    axios.post<T>(API_URL + endpoint, params, config)

const put = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.put<T>(API_URL + endpoint, params)

const deletar = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.delete<T>(API_URL + endpoint, {params})

const patch = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.patch<T>(API_URL + endpoint, params)


const errorHandlerDebug = (error: any) => {
    console.log("\n\nerror.toJson:  ################################################################################")
    console.log(error.toJSON())
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("error.response:  #############################################################################")
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } 
    if (error.request) {
        console.log("error.request:   #########################################################################")
        console.log(error.request);
    }
    console.log('Error.message: ', error.message);
    console.log("error.config: ", error.config);
}


export {get, post, put, deletar, errorHandlerDebug, patch}