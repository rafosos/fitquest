import axios from "axios";

const API_URL = 'http://192.168.0.50:8000';

const get = (endpoint: string, params: any = {}) => 
    axios.get(API_URL + endpoint)

const post = (endpoint: string, params: any = {}) => 
    axios.post(API_URL + endpoint, params)

export {get, post}