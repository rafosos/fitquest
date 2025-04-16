import AddTreino from "@/components/AddTreino";
import RotinaService from "@/services/rotina_service";
import { useLocalSearchParams } from "expo-router";

export default function RotinaTreino(){
    const id = Number(useLocalSearchParams().rotinaId);
    const nome = useLocalSearchParams().rotinaNome as string;
    const rotinaService = RotinaService();

    return(
        <AddTreino
            id={id} 
            nome={nome}
            getExercicios={rotinaService.getExercicios}
            salvarTreino={rotinaService.addTreino}
            localizacao={false}
        />
    ) 
}