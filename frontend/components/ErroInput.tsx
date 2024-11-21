import { StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';
import StyledText from './base/styledText';

interface PropsErroInput{
    texto: string,
    show: boolean
}

export default function ErroInput({ texto, show }: PropsErroInput) {
    return (                        
        show ? <StyledText style={styles.txtErroInput}>{texto}</StyledText> : <></>
    );
}

const styles = StyleSheet.create({
    txtErroInput:{
        backgroundColor: colors.vermelho.padrao,
        color: colors.branco.padrao,
        padding: 10,
        borderRadius: 15
    },
  });
  