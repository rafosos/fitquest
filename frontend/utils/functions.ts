export const showDiaMes = (data:string |Date |null|undefined) => {
    if (!data) return "..."
    data = new Date(data);
    return `${data.getDate()+1}/${data.getMonth()+1}/${data.getFullYear()}`;
}