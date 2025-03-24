import User, { PedidoAmizade, UserPerfil } from "@/classes/user";
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

    const addAmigo = (amigoId: number) =>{
        const promise = post<string>(`${prefix}/add-amigo/${amigoId}`);
        return promise.then(res => res.data);
    }

    const getAmigos = () =>{
        const promise = get<User[]>(`${prefix}/get-amigos/`);
        return promise.then(res => res.data);
    }

    const getNaoAmigos = (filtro: string) => {
        const promise = get<User[]>(`${prefix}/get-nao-amigos/${filtro}`);
        return promise.then(res => res.data);
    }

    const getAmigosFilter = (filter: string) =>{
        const promise = get<User[]>(`${prefix}/get-amigos/${filter}`);
        return promise.then(res => res.data);
    }

    const getPedidosAmizade = () =>{
        const promise = get<PedidoAmizade[]>(`${prefix}/get-pedidos-amizade/`);
        return promise.then(res => res.data);
    }
    
    const getInformacoesUsuario = () => {
        const promise = get<InformacoesUsuario>(`${prefix}/informacoes/`);
        return promise.then(res => res.data);
    }

    const aceitarAmizade = (id: number) =>{
        const promise = put<boolean>(`${prefix}/status-pedido-amizade/`, {id, status: 1});
        return promise.then(res => res.data);
    }

    const recusarAmizade = (id: number) =>{
        const promise = deletar<boolean>(`${prefix}/delete-pedido-amizade/${id}`);
        return promise.then(res => res.data);
    }

    const deletarAmizade = (id: number) =>{
        const promise = deletar<boolean>(`${prefix}/delete-amizade/${id}`);
        return promise.then(res => res.data);
    }

    const editarPeso = (valor: number) => {
        const promise = patch<boolean>(`${prefix}/peso`, {valor});
        return promise.then(res => res.data);
    }

    const editarAltura = (valor: number) => {
        const promise = patch<boolean>(`${prefix}/altura`, {valor});
        return promise.then(res => res.data);
    }

    const editarDado = (campo:string, valor: string) => {
        const promise = patch<User>(`${prefix}/${campo}`, {valor});
        return promise.then(res => res.data);
    }
        
    const getPerfilUsuario = (amigo_id: number) => {
        const promise = get<UserPerfil>(`${prefix}/perfil/${amigo_id}`);
        return promise.then(res => res.data);
    }

    return {cadastrar, editarDado, login, addAmigo, getAmigos, getPerfilUsuario, getAmigosFilter, getPedidosAmizade, getInformacoesUsuario, aceitarAmizade, getNaoAmigos, deletarAmizade, recusarAmizade, editarAltura, editarPeso}
}