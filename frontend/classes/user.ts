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
    admin = false;
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
    status_amizade: StatusAmizade | undefined;
    streak_semanal: Streak | undefined;
    streak_diario: Streak | undefined;
} 