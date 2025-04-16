import { useLocalSearchParams } from "expo-router";
import CampeonatoService from "@/services/campeonato_service";
import AddTreino from "@/components/AddTreino";

export default function AddTreinoCampeonato(){
    const campeonatoId = Number(useLocalSearchParams().campeonatoId);
    const campeonatoNome = useLocalSearchParams().campeonatoNome as string;
    const campeonatoService = CampeonatoService();

    return (
        <AddTreino 
            id={campeonatoId}
            nome={campeonatoNome}
            getExercicios={campeonatoService.getExercicios}
            salvarTreino={campeonatoService.addTreino} 
        />
    )
};