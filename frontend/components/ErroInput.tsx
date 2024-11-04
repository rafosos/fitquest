import { Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

interface PropsErroInput{
    texto: string,
    show: boolean
}

export default function ErroInput({ texto, show }: PropsErroInput) {
    return (                        
        show ? <Text style={styles.txtErroInput}>{texto}</Text> : <></>
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
  