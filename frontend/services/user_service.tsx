import User, { UserPerfil } from "@/classes/user";
import { deletar, get, patch, post, put } from "./service_config";
import { InformacoesUsuario } from "@/classes/streaks";
import { LoginResponse } from "@/classes/loginResponse";
import { useSession } from "@/app/ctx";

export default function UserService(){
    const prefix = "/user";
    const {id} = useSession();

    const cadastrar = (params: {
        username: string,
        fullname: string,
        email: string,
        nascimento: Date,
        senha: string
    }) => 
        post("/cadastro", params);

    const login = (login: string, senha: string) => {
        const formData = new FormData();
        formData.append("username", login.trim());
        formData.append("password", senha.trim());
        const promise = post<LoginResponse>("/login", formData, {headers: {'Content-Type': 'multipart/form-data'}});
        return promise.then(res => res.data);
    }

    const addAmigo = (user_id: string, amigoId: number) =>{
        const promise = post<string>(`${prefix}/add-amigo/${user_id}`, {amigoId});
        return promise.then(res => res.data);
    }

    const getAmigos = (user_id: string) =>{
        const promise = get<User[]>(`${prefix}/get-amigos/${user_id}`);
        return promise.then(res => res.data);
    }

    const getNaoAmigos = (user_id: string, filtro: string) => {
        const promise = get<User[]>(`${prefix}/get-nao-amigos/${user_id}/${filtro}`);
        return promise.then(res => res.data);
    }

    const getAmigosFilter = (user_id: string, filter: string) =>{
        const promise = get<User[]>(`${prefix}/get-amigos/${user_id}/${filter}`);
        return promise.then(res => res.data);
    }

    const getPedidosAmizade = (user_id: string) =>{
        const promise = get<User[]>(`${prefix}/get-pedidos-amizade/${user_id}`);
        return promise.then(res => res.data);
    }
    
    const getInformacoesUsuario = () => {
        const promise = get<InformacoesUsuario>(`${prefix}/informacoes/`);
        return promise.then(res => res.data);
    }

    const aceitarAmizade = (user_id: string, id: number) =>{
        const promise = put<boolean>(`${prefix}/status-pedido-amizade/${user_id}`, {id, status: 1});
        return promise.then(res => res.data);
    }

    const recusarAmizade = (user_id: string, id: number) =>{
        const promise = deletar<boolean>(`${prefix}/delete-pedido-amizade/${user_id}/${id}`);
        return promise.then(res => res.data);
    }

    const deletarAmizade = (user_id: string, id: number) =>{
        const promise = deletar<boolean>(`${prefix}/delete-amizade/${user_id}/${id}`);
        return promise.then(res => res.data);
    }

    const editarPeso = (user_id: string, valor: number) => {
        const promise = patch<boolean>(`${prefix}/${user_id}/peso`, {valor});
        return promise.then(res => res.data);
    }

    const editarAltura = (user_id: string, valor: number) => {
        const promise = patch<boolean>(`${prefix}/${user_id}/altura`, {valor});
        return promise.then(res => res.data);
    }

    const editarDado = (user_id: string, campo:string, valor: string) => {
        const promise = patch<User>(`${prefix}/${user_id}/${campo}`, {valor});
        return promise.then(res => res.data);
    }
        
    const getPerfilUsuario = (user_id:number, amigo_id: number) => {
        const promise = get<UserPerfil>(`${prefix}/perfil/${user_id}/${amigo_id}`);
        return promise.then(res => res.data);
    }

    return {cadastrar, editarDado, login, addAmigo, getAmigos, getPerfilUsuario, getAmigosFilter, getPedidosAmizade, getInformacoesUsuario, aceitarAmizade, getNaoAmigos, deletarAmizade, recusarAmizade, editarAltura, editarPeso}
}