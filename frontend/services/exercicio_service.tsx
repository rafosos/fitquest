import { TreinoResumo } from "@/classes/user_exercicio";
import { get } from "./service_config";
import Exercicio from "@/classes/exercicio";
import { Streaks } from "@/classes/streaks";

export default function ExercicioService(){
    const getExercicioFiltro = (user_id: number, f: string, ids_escolhidos: number[]) => {
        const promise = get<Exercicio[]>(`/exercicio/${user_id}`, {f, ids_escolhidos});
        return promise.then(res => res.data.map(exercicio => new Exercicio(exercicio.id, exercicio.nome, exercicio.grupo_muscular)));
    }
    
    const getUltimosTreinosResumo = (userId: number) => {
        const promise = get<TreinoResumo[]>(`/treinos_resumo/${userId}`);
        return promise.then(res => res.data);    
    }

    const getStreaks = (userId: number) => {
        const promise = get<Streaks>(`/exercicio/streak_geral/${userId}`);
        return promise.then(res => res.data);
    }

    return {getExercicioFiltro, getUltimosTreinosResumo, getStreaks}
}