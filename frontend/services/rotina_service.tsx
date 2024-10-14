import Rotina from "@/classes/rotina";
import { post } from "./service_config";

export default function RotinaService(){

    const addRotina = (user_id: string, rotina: {
        nome: string,
        dias: number,
        exercicios: {id: number, series: number, repeticoes: number}[]
    }) =>{
        const promise = post<string>(`/add-rotina/${user_id}`, rotina);
        return promise.then(res => res.data);
    }
    
    const getRotinas = (user_id: string) => {
        const promise = post<Rotina>(`/rotina/${user_id}`);
        return promise.then(res => res.data);    
    }

    return {addRotina}
}