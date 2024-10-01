import Classe from "@/classes/classe";
import { get } from "./service_config";

export default function ClasseService(){

    const getAll = () => {
        const promise = get<Classe[]>("/classe");
        return promise.then(res => res.data.map(classe => new Classe(classe.id, classe.nome)));
    } 

    return {getAll}
}