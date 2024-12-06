import { Streak } from "./streaks";

export default class User{
    constructor(id: number, nome: string, username: string) {
        this.id = id;
        this.fullname = nome;
        this.username = username;
    }

    id: number;
    fullname: string;
    username: string;
    email: string = "";
    level: number = 0;
    status: string = "";
    nascimento: Date = new Date();
    peso: number | undefined;
    altura: number | undefined;
}

export enum StatusAmizade{
    Ativa=1, Pendente, Bloqueado
}

export class UserPerfil{
    constructor(id: number, nome: string, username: string) {
        this.id = id;
        this.fullname = nome;
        this.username = username;
    }
    
    id: number;
    fullname: string;
    username: string;
    peso: number | undefined;
    altura: number | undefined;
    status: string = "";
    status_amizade: StatusAmizade | undefined;
    streak_semanal: Streak | undefined;
    streak_diario: Streak | undefined;
    autor_pedido: boolean | undefined;
}

export class PedidoAmizade{
    constructor(id: number, nome: string, username: string, status: StatusAmizade) {
        this.id = id;
        this.fullname = nome;
        this.username = username;
        this.status = status;
    }

    id: number;
    username: string;
    fullname: string;
    status: StatusAmizade
}