import User from "@/classes/user";
import { deletar, get, post, put } from "./service_config";

export default function UserService(){

    const cadastrar = (params: {
        nickname: string,
        fullname: string,
        email: string,
        nascimento: Date,
        // classe: number,
        senha: string
    }) => 
        post("/cadastro", params);

    const login = (login: string, senha: string) => {
        const promise = post<User>("/login", {login, senha});
        return promise.then(res => res.data);
    }

    const addAmigo = (user_id: string, amigoId: number) =>{
        const promise = post<string>(`/add-amigo/${user_id}`, {amigoId});
        return promise.then(res => res.data);
    }

    const getAmigos = (user_id: string) =>{
        const promise = get<User[]>(`/get-amigos/${user_id}`);
        return promise.then(res => res.data);
    }

    const getNaoAmigos = (user_id: string, filtro: string) => {
        const promise = get<User[]>(`/get-nao-amigos/${user_id}/${filtro}`);
        return promise.then(res => res.data);
    }

    const getAmigosFilter = (user_id: string, filter: string) =>{
        const promise = get<User[]>(`/get-amigos/${user_id}/${filter}`);
        return promise.then(res => res.data);
    }

    const getPedidosAmizade = (user_id: string) =>{
        const promise = get<User[]>(`/get-pedidos-amizade/${user_id}`);
        return promise.then(res => res.data);
    }

    const aceitarAmizade = (user_id: string, id: number) =>{
        const promise = put<boolean>(`/status-pedido-amizade/${user_id}`, {id, status: 1});
        return promise.then(res => res.data);
    }

    const recusarAmizade = (user_id: string, id: number) =>{
        const promise = deletar<boolean>(`/delete-pedido-amizade/${user_id}/${id}`);
        return promise.then(res => res.data);
    }

    const deletarAmizade = (user_id: string, id: number) =>{
        const promise = deletar<boolean>(`/delete-amizade/${user_id}/${id}`);
        return promise.then(res => res.data);
    }

    return {cadastrar, login, addAmigo, getAmigos, getAmigosFilter, getPedidosAmizade, aceitarAmizade, getNaoAmigos, deletarAmizade, recusarAmizade}
}