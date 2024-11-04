import { deletar, get, post } from "./service_config";
import Campeonato, { CampeonatoDetalhes, ExercicioCampeonato, UserProgresso } from "@/classes/campeonato";

export default function CampeonatoService(){
    const prefix = "/campeonato";

    const addCampeonato = (params: {
        nome:string,
        duracao:Date,
        participantes_ids: number[],
        exercicios: ExercicioCampeonato[]
    }) => {
        const promise = post<string>(`${prefix}/`, params);
        return promise.then(res => res.data);  
    }
    
    const getCampeonatos = (user_id: string) =>{
        const promise = get<Campeonato[]>(prefix + `/${user_id}`);
        return promise.then(res => res.data);
    }
    
    const getCampeonatoDetalhes = (userId: number, campeonatoId: number) => {
        const promise = get<CampeonatoDetalhes>(prefix +`/detalhes/${userId}/${campeonatoId}`);
        return promise.then(res => res.data);
    }

    const getDetalhesProgresso = (campeonatoId: number) => {
        const promise = get<UserProgresso[]>(prefix +`/detalhes_progresso/${campeonatoId}`);
        return promise.then(res => res.data);
    }

    const addTreino = (params: {campeonatoId: number, userId: number, exercicios_ids: number[]}) => {
        return post(prefix + "/add-treino", params);
    }

    const deleteCampeonato = (campeonatoId: number) => {
        return deletar(prefix + `/${campeonatoId}`);
    }

    return {addCampeonato, getCampeonatos, getCampeonatoDetalhes, addTreino, deleteCampeonato, getDetalhesProgresso}
}