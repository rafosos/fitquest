import Exercicio from "./exercicio";

export default class Rotina{
    constructor(id: number, nome: string, dias: number) {
        this.id = id;
        this.nome = nome;
        this.dias = dias;
    }
    
    id: number;
    nome: string;
    dias: number;
    exercicios: Exercicio[] = [];
}

export class RotinaDetalhes extends Rotina{    
    streak = 0;
    ultimoTreino: Date | null = null;
}

export class RotinaResumida{    
    constructor(id: number, nome: string, dias: number, exercicios: string) {
        this.id = id;
        this.nome = nome;
        this.dias = dias;
        this.exercicios = exercicios;
    }

    id: number;
    nome: string;
    dias: number;
    exercicios: string;
}