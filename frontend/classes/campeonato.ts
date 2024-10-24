import Exercicio from "./exercicio";
import User from "./user";

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
    participantes: string | undefined;
}

export class ExercicioCampeonato{
    constructor(exercicio_id: number, qtd_series: number, qtd_repeticoes: number) {
        this.exercicio_id = exercicio_id;
        this.qtd_serie = qtd_series;
        this.qtd_repeticoes = qtd_repeticoes;
    }
    id: number | undefined;
    exercicio_id: number;
    qtd_serie: number = 0;
    qtd_repeticoes: number = 0;
    exercicio_nome: string | undefined;
}

export class CampeonatoDetalhes{
    constructor(nome: string, duracao: Date, id: number = 0) {
        this.id = id;
        this.nome = nome;
        this.duracao = duracao;
    }
    
    id: number;
    nome: string;
    duracao: Date;
    participantes: Array<User> | undefined;
    exercicios: Array<Exercicio> | undefined;
    userId: number | undefined;
}