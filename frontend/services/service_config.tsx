import axios from "axios";

const API_URL = 'http://192.168.0.21:8000'; //casa
// const API_URL = 'http://192.168.154.156:8000'; //cel
// const API_URL = 'http://172.17.110.49:8000'; //facul
// const API_URL = 'http://192.168.162.156:8000'; //facul L
// const API_URL = 'http://172.17.96.130:8000'; //facul biblio
// const API_URL = "https://fitquest-8s1c.onrender.com" //prod

const axiosInstance = axios.create({
    baseURL: API_URL,
    paramsSerializer: {
        indexes: null
    }
})

const get = <T extends unknown>(endpoint: string, params: any = {}) => 
    axiosInstance.get<T>(endpoint, {params})

const post = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.post<T>(API_URL + endpoint, params)

const put = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.put<T>(API_URL + endpoint, params)

const deletar = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.delete<T>(API_URL + endpoint, {params})


const errorHandlerDebug = (error: any) => {
    console.log(error.toJSON())
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } 
    if (error.request) {
        console.log(error.request);
    }
    console.log('Error', error.message);
    console.log(error.config);
}


export {get, post, put, deletar, errorHandlerDebug}