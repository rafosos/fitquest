import GrupoMuscular from "./grupo_muscular";

export default class Exercicio{
    constructor(id: number, nome: string, grupo_muscular: GrupoMuscular) {
        this.id = id;
        this.nome = nome;
        this.grupo_muscular = grupo_muscular;
    }

    id: number;
    nome: string;
    grupo_muscular_id: number = 0;
    grupo_muscular_nome: string = "";
    series: number = 0;
    repeticoes: number = 0;
    grupo_muscular: GrupoMuscular;
}