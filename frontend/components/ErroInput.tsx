import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/Colors';
import StyledText from './base/styledText';
import { AntDesign } from '@expo/vector-icons';

interface PropsErroInput{
    texto: string,
    show: boolean,
    setShow?: (value: any) => void
}

export default function ErroInput({ texto, show, setShow }: PropsErroInput) {
    return (
        show ?
        <View style={styles.container}>
            <StyledText style={styles.txtErroInput}>{texto}</StyledText>
            {setShow && <AntDesign name="close" onPress={() => setShow(false)} style={styles.icone} />}
        </View>
        : <></>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.vermelho.padrao,
        padding: 10,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtErroInput:{
        color: colors.branco.padrao
    },
    icone:{
        color: colors.branco.padrao,
        fontSize: 15
    },
  });
  