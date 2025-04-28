import axios, { AxiosRequestConfig } from "axios";

const API_URL = "https://fitquest-production.up.railway.app";
// const API_URL = "http://192.168.210.82:8000";


axios.defaults.baseURL = API_URL
axios.defaults.paramsSerializer = { indexes:null }

// axios.interceptors.response.use(async (res) => {
//     const csrf_token = res.data.csrf_token;
//         if (csrf_token) {
//             axios.interceptors.request.use(config => {
//                 config.headers["X-CSRF-Token"] = csrf_token
//                 return config
//             });
//         }
//         return res;
//     },
//     error => Promise.reject(error)
// )

const get = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.get<T>(endpoint, {params});

const post = <T extends unknown>(endpoint: string, params: any = {}, config :AxiosRequestConfig<any> = {}) => 
    axios.post<T>(API_URL + endpoint, params, config);

const put = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.put<T>(API_URL + endpoint, params);

const deletar = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.delete<T>(API_URL + endpoint, {params});

const patch = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.patch<T>(API_URL + endpoint, params);


const errorHandlerDebug = (error: any) => {
    console.log("\n\nerror.toJson:  ################################################################################")
    if(error.toJSON){
        console.log(error.toJSON())
    }
    if (error.response) {
        if (error.response.status == 401){
            return 
        }
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
    return error.message;
}


export {get, post, put, deletar, errorHandlerDebug, patch}