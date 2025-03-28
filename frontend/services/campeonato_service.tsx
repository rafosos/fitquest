import { deletar, get, patch, post } from "./service_config";
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
    
    const getCampeonatos = () =>{
        const promise = get<Campeonato[]>(prefix + `/`);
        return promise.then(res => res.data);
    }

    const getCampeonatosPesquisa = (termo: string) =>{
        const promise = get<Campeonato[]>(prefix + `/pesquisa/${termo}`);
        return promise.then(res => res.data);
    }
    
    const getCampeonatoDetalhes = (campeonatoId: number) => {
        const promise = get<CampeonatoDetalhes>(prefix +`/detalhes/${campeonatoId}`);
        return promise.then(res => res.data);
    }

    const getDetalhesProgresso = (campeonatoId: number) => {
        const promise = get<UserProgresso[]>(prefix +`/detalhes_progresso/${campeonatoId}`);
        return promise.then(res => res.data);
    }
    
    const addTreino = (params: {campeonatoId: number, exercicios_ids: number[]}) => {
        return post(prefix + "/add-treino", params);
    }

    const deleteCampeonato = (campeonatoId: number) => {
        return deletar(prefix + `/${campeonatoId}`);
    }

    const entrarCampeonato = (campeonatoId: number) => {
        const promise = patch<boolean>(prefix + `/entrar/${campeonatoId}`);
        return promise.then(res => res.data);
    }
    
    const sairCampeonato = (campeonatoId: number) => {
        const promise = patch<boolean>(prefix + `/sair/${campeonatoId}`);
        return promise.then(res => res.data);
    }

    return {addCampeonato, sairCampeonato, entrarCampeonato, getCampeonatos, getCampeonatoDetalhes, addTreino, deleteCampeonato, getDetalhesProgresso, getCampeonatosPesquisa}
}