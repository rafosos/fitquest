import { RotinaDetalhes, RotinaResumida } from "@/classes/rotina";
import { get, post } from "./service_config";

export default function RotinaService(){

    const addRotina = (user_id: string, rotina: {
        nome: string,
        dias: number,
        exercicios: {id: number, series: number, repeticoes: number}[]
    }) =>{
        const promise = post<string>(`/add-rotina/${user_id}`, rotina);
        return promise.then(res => res.data);
    }

    const getRotinas = (user_id: string) => {
        const promise = get<RotinaResumida[]>(`/rotina/${user_id}`);
        return promise.then(res => res.data);    
    }

    const getDetalhesRotina = (rotina_id: number) => {
        const promise = get<RotinaDetalhes>(`/rotina_detalhes/${rotina_id}`);
        return promise.then(res => res.data);
    }

    const addTreino = (treino: {rotinaId: number, userId: number, ids_exercicios: number[]}) =>{
        const promise = post<string>(`/add-treino`, treino);
        return promise.then(res => res.data);
    }

    return {addRotina, getRotinas, getDetalhesRotina, addTreino}
}