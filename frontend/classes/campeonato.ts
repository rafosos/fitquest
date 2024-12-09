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
    id_criador: number | undefined;
    username_criador: string | undefined;
    data_criacao: Date | undefined;
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
    criadorId: number | undefined;
    ultimo_treino: Date | undefined;
    participantes: Array<User> | undefined;
    exercicios: Array<Exercicio> | undefined;
    joined: boolean = false;
    userId: number | undefined;
}

export class UserProgresso{
    user_id: number | undefined;
    username: string | undefined;
    fullname: string | undefined;
    dias: number | undefined;
}