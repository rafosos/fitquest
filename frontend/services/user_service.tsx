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

    const login = (login: string, senha: string) =>
        post("/login", {login, senha});

    return {cadastrar, login}
}