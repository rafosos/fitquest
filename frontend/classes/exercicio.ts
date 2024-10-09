export default class Exercicio{
    constructor(id: number, nome: string
    ) {
        this.id = id;
        this.nome = nome;
    }

    id: number;
    nome: string;
    series: number = 0;
    repeticoes: number = 0;
}