import axios from "axios";

const API_URL = 'http://192.168.0.17:8000';

const get = <T extends unknown>(endpoint: string) => 
    axios.get<T>(API_URL + endpoint)

const post = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.post<T>(API_URL + endpoint, params)

const put = <T extends unknown>(endpoint: string, params: any = {}) => 
    axios.put<T>(API_URL + endpoint, params)

export {get, post, put}