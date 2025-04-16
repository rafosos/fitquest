import { RotinaDetalhes, RotinaResumida } from "@/classes/rotina";
import { deletar, get, post } from "./service_config";
import { ExercicioCampeonatoTreino } from "@/classes/campeonato";

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

    const addTreino = (ids_exercicios: number[], imagemUri: string) =>{
        const form = new FormData();
        ids_exercicios.forEach(id => form.append("ids_exercicios", id.toString()));
        form.append("imagem", {
            uri: imagemUri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });
        
        return post(prefix + "/treino/", form, {headers: {'Content-Type': 'multipart/form-data'}});    
    }

    const getExercicios = (rotinaId: Number) => {
        const promise = get<ExercicioCampeonatoTreino[]>(prefix +`/exercicios/${rotinaId}`);
        return promise.then(res => res.data);
    }

    const deletarRotina = (rotinaId: number) =>{
        const promise = deletar<string>(`${prefix}/${rotinaId}`);
        return promise.then(res => res.data);
    }

    return {addRotina, getRotinas, getDetalhesRotina, addTreino, deletarRotina, getExercicios}
}