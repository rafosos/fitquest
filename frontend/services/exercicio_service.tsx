import { get } from "./service_config";
import Exercicio from "@/classes/exercicio";

export default function ExercicioService(){
    const getExercicioFiltro = (user_id: number, f: string, ids_escolhidos: number[]) => {
        const promise = get<Exercicio[]>(`/exercicio/${user_id}`, {f, ids_escolhidos});
        return promise.then(res => res.data.map(exercicio => new Exercicio(exercicio.id, exercicio.nome, exercicio.grupo_muscular)));
    } 

    return {getExercicioFiltro}
}