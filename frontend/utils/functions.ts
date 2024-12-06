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