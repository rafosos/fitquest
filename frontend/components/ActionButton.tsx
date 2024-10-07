import { Text, TouchableOpacity } from "react-native";

export default function ActionButton({acao = () => {}}){
    return(
        <TouchableOpacity 
            onPress={acao}
            style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                position:'absolute',
                bottom: 10,
                right: 10,
                flex:1,
                backgroundColor: "#aaa",
                width: 60,
                height: 60,
                alignSelf: 'flex-end'
        }}>
            <Text
                style={{color: "#fff", fontSize: 35}}
            >+</Text>
        </TouchableOpacity>
    )
}