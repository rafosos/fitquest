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