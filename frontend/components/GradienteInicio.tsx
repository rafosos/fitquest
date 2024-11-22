import { colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, ImageSourcePropType, StyleSheet } from "react-native";

interface GradienteProps{
    image?: ImageSourcePropType;
    semImagem?: boolean;
    espelharGradiente?: boolean
}

export default function GradienteInicio({image, semImagem = false, espelharGradiente = false}:GradienteProps){
    return <>
        {!semImagem && image &&
            <Image
                source={image}
                resizeMode="cover"
                style={styles.imageBackground}
            />
        }
            
        <LinearGradient 
            colors={[
                colors.gradiente.cinzaClaro,
                colors.gradiente.verdeClaro,
                colors.gradiente.cinzaClaro,
                colors.gradiente.verdeEscuro,
                colors.gradiente.cinzaClaro,
            ]}
            style={styles.gradiente}
            start={espelharGradiente ? {x:0, y:0} : {x:0.9, y:0}}
            locations={espelharGradiente?
                [0.02, 0.06, 0.2, 0.95, 1]
                :
                [0, 0.05, 0.2, 0.95, 1]
            }
        />
    </>
}

const styles = StyleSheet.create({
    imageBackground:{
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    gradiente:{
        opacity: 0.8, 
        position: 'absolute', 
        left: 0, 
        right: 0, 
        top:0, 
        height: '100%'
    },
});