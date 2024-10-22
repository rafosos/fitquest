import User from "@/classes/user";
import { get, post, put } from "./service_config";
import Campeonato, { CampeonatoDetalhes } from "@/classes/campeonato";

export default function CampeonatoService(){

    const addCampeonato = (params: Campeonato) => {
        return post("/add-campeonato", params);
    }
    
    const getCampeonatos = (user_id: string) =>{
        const promise = get<Campeonato[]>(`/get-campeonatos/${user_id}`);
        return promise.then(res => res.data);
    }
    
    const getCampeonatoDetalhes = (campeonatoId: number) => {
        const promise = get<CampeonatoDetalhes>(`/get-campeonato-detalhes/${campeonatoId}`);
        return promise.then(res => res.data);
    }

    const addTreino = (params: {campeonatoId: number, userId: number, exercicios_ids: number[]}) => {
        return post("/add-treino", params);
    }

    return {addCampeonato, getCampeonatos, getCampeonatoDetalhes, addTreino}
}