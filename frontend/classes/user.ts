export default class User{
    constructor(id: number, nome: string, nickname: string) {
        this.id = id;
        this.fullname = nome;
        this.nickname = nickname;
    }

    id: number;
    fullname: string;
    nickname: string;
    email: string = "";
    level: number = 0;
    admin = false;
    nascimento: Date = new Date();
}