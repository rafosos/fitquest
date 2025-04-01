import { Atividade } from "@/classes/campeonato";
import StyledText from "@/components/base/styledText";
import { FlatList, View } from "react-native";

interface Props{
    atividades: Atividade[]
}

export default function ListaAtividades({atividades}: Props){
    return(
        <FlatList
            data={atividades}
            renderItem={({item}) => 
                <View>
                    <StyledText>{item.fullname}</StyledText>
                </View>
            }
        />
    )
}
