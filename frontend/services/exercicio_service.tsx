import { StatusTreino, TreinoResumo } from "@/classes/user_exercicio";
import { get, patch } from "./service_config";
import Exercicio from "@/classes/exercicio";
import { InformacoesUsuario } from "@/classes/streaks";

export default function ExercicioService(){
    const getExercicioFiltro = (user_id: number, f: string, ids_escolhidos: number[]) => {
        const promise = get<Exercicio[]>(`/exercicio/${user_id}`, {f, ids_escolhidos});
        return promise.then(res => res.data.map(exercicio => new Exercicio(exercicio.id, exercicio.nome, exercicio.grupo_muscular)));
    }
    
    const getUltimosTreinosResumo = (userId: number) => {
        const promise = get<TreinoResumo[]>(`/exercicio/treinos_resumo/${userId}`);
        return promise.then(res => res.data);    
    }

    const getStreaks = (userId: number) => {
        const promise = get<InformacoesUsuario>(`/exercicio/streak_geral/${userId}`);
        return promise.then(res => res.data);
    }
    
    const atualizarStatusTreino = (treino_id: number, status: StatusTreino) => {
        const promise = patch<boolean>(`/exercicio/${treino_id}`, {status});
        return promise.then(res => res.data);    
    }
    
    const getDeletados = (user_id: number) => {
        const promise = get<TreinoResumo[]>(`/exercicio/get_deletados/${user_id}`);
        return promise.then(res => res.data);
    }

    return {getExercicioFiltro, getUltimosTreinosResumo, getStreaks, atualizarStatusTreino, getDeletados}
}