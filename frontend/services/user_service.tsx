import User from "@/classes/user";
import { get, post } from "./service_config";

export default function UserService(){

    const cadastrar = (params: {
        nickname: string,
        fullname: string,
        email: string,
        nascimento: Date,
        classe: number,
        senha: string
    }) => 
        post("/cadastro", params);

    const login = (login: string, senha: string) => {
        const promise = post<string>("/login", {login, senha});
        return promise.then(res => res.data);
    }

    const addAmigo = (nickname: string) =>{
        const promise = post<boolean>("/add-amigo", {nickname});
        return promise.then(res => res.data);
    } 

    const getAmigos = (user_id: string) =>{
        const promise = get<User[]>(`/get-amigos/${user_id}`);
        return promise.then(res => res.data);
    } 


    return {cadastrar, login, addAmigo, getAmigos}
}