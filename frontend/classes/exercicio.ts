import GrupoMuscular from "./grupo_muscular";

export default class Exercicio{
    constructor(id: number, nome: string, grupo_muscular: GrupoMuscular) {
        this.id = id;
        this.nome = nome;
        this.grupo_muscular = grupo_muscular;
    }

    id: number;
    nome: string;
    grupo_muscular: GrupoMuscular;
    series: number = 0;
    repeticoes: number = 0;
}