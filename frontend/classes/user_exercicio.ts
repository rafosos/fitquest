export class UserExercicio{
    constructor(id: number, exercicio_id: number, exercicio_nome:string, grupo_muscular_nome: string, qtd_serie: number, qtd_repeticoes: number) {
        this.id = id;
        this.exercicio_id = exercicio_id;
        this.exercicio_nome = exercicio_nome;
        this.grupo_muscular_nome = grupo_muscular_nome;
        this.qtd_serie = qtd_serie;
        this.qtd_repeticoes = qtd_repeticoes;
    }
    
    id: number;
    exercicio_id: number;
    exercicio_nome: string;
    grupo_muscular_nome: string;
    qtd_serie: number;
    qtd_repeticoes: number;
}

export class Treino{
    constructor(data: Date) {
        this.data = data;
        this.exercicios = [];
    }
    
    data: Date;    
    exec_rotina_id: number | undefined;
    exec_rotina_nome: string | undefined;
    exec_campeonato_id: number | undefined;
    exec_campeonato_nome: string | undefined;
    exercicios: UserExercicio[];
}

export enum TipoTreino{
    Rotina = 1,
    Campeonato = 2
}

export enum StatusTreino{
    ativo = 1,
    deletado
}

export class TreinoResumo{
    constructor(id:number, data: Date, exercicios: string) {
        this.id = id;
        this.data = data;
        this.exercicios = exercicios;
    }
    
    id: number;
    data: Date;
    rotina_id: number | undefined;
    tipo: TipoTreino | undefined;
    campeonato_id: number | undefined;
    nome: string | undefined;
    exercicios: string;
}