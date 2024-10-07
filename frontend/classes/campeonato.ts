export default class Campeonato{
    constructor(nome: string, duracao: Date, participantes: Array<number>, id: number = 0) {
        this.id = id;
        this.nome = nome;
        this.duracao = duracao;
        this.participantes_ids = participantes;
    }

    id: number;
    nome: string;
    duracao: Date;
    participantes_ids: Array<number>;
}