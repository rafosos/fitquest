import { StatusTreino, TreinoResumo } from "@/classes/user_exercicio";
import { get, patch } from "./service_config";
import Exercicio from "@/classes/exercicio";
import { InformacoesUsuario } from "@/classes/streaks";

export default function ExercicioService(){
    const getExercicioFiltro = (f: string, ids_escolhidos: number[]) => {
        const promise = get<Exercicio[]>(`/exercicio/`, {f, ids_escolhidos});
        return promise.then(res => res.data.map(exercicio => new Exercicio(exercicio.id, exercicio.nome, exercicio.grupo_muscular)));
    }
    
    const getUltimosTreinosResumo = (amigoId?: number) => {
        const promise = get<TreinoResumo[]>(`/exercicio/treinos_resumo/` + (amigoId ?? "0"));
        return promise.then(res => res.data);
    }

    const getStreaks = () => {
        const promise = get<InformacoesUsuario>(`/exercicio/streak_geral/`);
        return promise.then(res => res.data);
    }
    
    const atualizarStatusTreino = (treino_id: number, status: StatusTreino) => {
        const promise = patch<boolean>(`/exercicio/${treino_id}`, {status});
        return promise.then(res => res.data);
    }
    
    const getDeletados = () => {
        const promise = get<TreinoResumo[]>(`/exercicio/get_deletados/`);
        return promise.then(res => res.data);
    }

    return {getExercicioFiltro, getUltimosTreinosResumo, getStreaks, atualizarStatusTreino, getDeletados}
}