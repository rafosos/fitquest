export default class User{
    constructor(id: number, nome: string) {
        this.id = id;
        this.fullname = nome;
    }

    id: number;
    fullname: string;
}