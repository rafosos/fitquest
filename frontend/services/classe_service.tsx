import { get } from "./service_config"

export default function ClasseService(){

    const getAll = () => 
        get("/classe");

    return {getAll}
}