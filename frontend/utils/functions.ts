import { errorHandlerDebug } from "@/services/service_config";

export const showDiaMes = (data:string |Date |null|undefined) => {
    if (!data) return "..."
    data = new Date(data);
    data.setUTCHours(12)

    const hj = new Date();

    const dia = data.getDate().toString().padStart(2, '0');
    
    if(data.getFullYear() == hj.getFullYear())
        return `${dia}/${data.getMonth()+1}`;
    
    return `${dia}/${data.getMonth()+1}/${data.getFullYear()}`;
}

export const errorHandlerPadrao = (err: any, setErro: (erro: string) => void) => {
    errorHandlerDebug(err);
    if (err.response){
        setErro(err.response.data.detail);
    }
    else
        setErro(err.message);
}

export const getProgress = (dataInicial:Date, dataFinal:Date) => {
    const totalDias = datediff(dataInicial, dataFinal);
    const diasAteFinal = datediff(dataFinal, new Date());

    return 1 - (((diasAteFinal * 100) / totalDias) / 100);
}

export const datediff = (first: Date, second: Date) => {        
    return Math.abs(Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)));
}