import { deletar, get, post } from "./service_config";
import Campeonato, { CampeonatoDetalhes } from "@/classes/campeonato";

export default function CampeonatoService(){
    const prefix = "/campeonato";

    const addCampeonato = (params: Campeonato) => {
        return post(prefix + "/", params);
    }
    
    const getCampeonatos = (user_id: string) =>{
        const promise = get<Campeonato[]>(prefix + `/${user_id}`);
        return promise.then(res => res.data);
    }
    
    const getCampeonatoDetalhes = (campeonatoId: number) => {
        const promise = get<CampeonatoDetalhes>(prefix +`/detalhes/${campeonatoId}`);
        return promise.then(res => res.data);
    }

    const addTreino = (params: {campeonatoId: number, userId: number, exercicios_ids: number[]}) => {
        return post(prefix + "/add-treino", params);
    }

    const deleteCampeonato = (campeonatoId: number) => {
        return deletar(prefix + `/${campeonatoId}`);
    }

    return {addCampeonato, getCampeonatos, getCampeonatoDetalhes, addTreino, deleteCampeonato}
}