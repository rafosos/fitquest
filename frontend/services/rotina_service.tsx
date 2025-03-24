import { RotinaDetalhes, RotinaResumida } from "@/classes/rotina";
import { deletar, get, post } from "./service_config";

export default function RotinaService(){

    const prefix = "/rotina"

    const addRotina = (rotina: {
        nome: string,
        dias: number,
        exercicios: {id: number, series: number, repeticoes: number}[]
    }) =>{
        const promise = post<string>(`${prefix}/`, rotina);
        return promise.then(res => res.data);
    }

    const getRotinas = () => {
        const promise = get<RotinaResumida[]>(`${prefix}/`);
        return promise.then(res => res.data);    
    }

    const getDetalhesRotina = (rotina_id: number) => {
        const promise = get<RotinaDetalhes>(`${prefix}/detalhes/${rotina_id}`);
        return promise.then(res => res.data);
    }

    const addTreino = (treino: {rotinaId: number, ids_exercicios: number[]}) =>{
        const promise = post<string>(`${prefix}/treino/`, treino);
        return promise.then(res => res.data);
    }

    const deletarRotina = (rotinaId: number) =>{
        const promise = deletar<string>(`${prefix}/${rotinaId}`);
        return promise.then(res => res.data);
    }

    return {addRotina, getRotinas, getDetalhesRotina, addTreino, deletarRotina}
}