import User from "@/classes/user";
import { get, post, put } from "./service_config";
import Campeonato from "@/classes/campeonato";

export default function CampeonatoService(){

    const addCampeonato = (params: Campeonato) => {
        console.log(params)
        return post("/add-campeonato", params);
    }

    const getCampeonatos = (user_id: string) =>{
        const promise = get<Campeonato[]>(`/get-campeonatos/${user_id}`);
        return promise.then(res => res.data);
    }

    return {addCampeonato, getCampeonatos}
}