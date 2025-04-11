import { ImagePickerAsset } from "expo-image-picker";
import { deletar, get, patch, post } from "./service_config";
import Campeonato, { Atividade, AtividadeDetalhada, CampeonatoDetalhes, ExercicioCampeonato, ExercicioCampeonatoTreino, UserProgresso } from "@/classes/campeonato";

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
 
    const getAtividades = (campeonatoId: number) => {
        const promise = get<Atividade[]>(prefix +`/atividades/${campeonatoId}`);
        return promise.then(res => res.data);
    }
    
    const addTreino = (exercicios_ids: number[], imagem: ImagePickerAsset) => {
        const form = new FormData();
        exercicios_ids.forEach(id => form.append("exercicios_ids", id.toString()));
        form.append("imagem", {
            uri: imagem.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });
        return post(prefix + "/add-treino", form, {headers: {'Content-Type': 'multipart/form-data'}});
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
    
    const getExercicios = (campeonatoId: Number) => {
        const promise = get<ExercicioCampeonatoTreino[]>(prefix +`/exercicios/${campeonatoId}`);
        return promise.then(res => res.data);
    }

    const getAtividadeById = (atividadeId: Number) => {
        const promise = get<AtividadeDetalhada>(prefix +`/atividade/${atividadeId}`);
        return promise.then(res => res.data);
    }

    const deleteTreino = (treinoId: number) => {
        return deletar(prefix + `/treino/${treinoId}`);
    }

    return {addCampeonato, deleteTreino, getAtividadeById, sairCampeonato, getExercicios, entrarCampeonato, getAtividades, getCampeonatos, getCampeonatoDetalhes, addTreino, deleteCampeonato, getDetalhesProgresso, getCampeonatosPesquisa}
}