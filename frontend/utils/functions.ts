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

export const regexSqlInjectionVerify = (text: string):boolean => {
    const REGEX_SQLINJECTION = /(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.*)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s+.*)))(\s*[\;]\s*)*)+)/i;
    return !!text.match(REGEX_SQLINJECTION);
}

  
export function getCookie(name: string) {

    const cookieString = document.cookie;
    console.log("cookieString");
    console.log(cookieString);
    
    if (!cookieString) {
      return null;
    }
    const cookies = cookieString.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        return value;
      }
    }
    return null;
  }