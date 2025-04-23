import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useSession } from "./ctx";
import StyledText from "@/components/base/styledText";
import { router } from "expo-router";
import UserService from "@/services/user_service";
import { useRef, useState } from "react";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import StyledTextInput from "@/components/base/styledTextInput";
import { Feather } from "@expo/vector-icons";
import ErroInput from "@/components/ErroInput";
import { errorHandlerDebug } from "@/services/service_config";
import GradienteInicio from "@/components/GradienteInicio";
import axios from "axios";
import { getCookie, regexSqlInjectionVerify } from "@/utils/functions";
import { ErrorHandler } from "@/utils/ErrorHandler";

export default function Login() {
    const { signIn, setUser } = useSession();
    const userService = UserService();
    const [erros, setErros] = useState<any>({});
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
  
    const passRef = useRef<TextInput>(null);
    const errorHandler = ErrorHandler();

    const handleLogin = () => {
        let erroObj = {...erros};

        // checagem de erros
        erroObj = {...erros,
            geral: false,
            inputLogin: !login,
            regex: login && regexSqlInjectionVerify(login),
            inputSenha: !senha,
        };
        setErros(erroObj);

        // se algum erro existe, a função .some vai voltar true e não vai chamar submit
        if(Object.values(erroObj).some(err => err)) return;
        
        // userService.getcsrftoken()
        // .then(res=> {
        //     console.log("res csrf")
        //     console.log(res)
        // })
        // .catch(err => errorHandler.handleError(err));

        // return

        setLoading(true);
        userService.login(login, senha)
            .then(res => {
                if (res){
                    axios.defaults.headers.common = { "Authorization": `Bearer ${res.data.access_token}` }
                    signIn(res.data);
                    setUser(JSON.stringify(res));
                    router.replace("/(auth)/(tabs)/home/");
                } else {
                    setErros({...erroObj, geral: `Login e senha inválidos ou incompatíveis, confira as informações inseridas e tente novamente.`});
                }
            })
            .catch(err => {
                errorHandlerDebug(err);
                if(err.response && err.response.status == 401)
                    setErros({...erroObj, geral: `Login e senha inválidos ou incompatíveis, confira as informações e tente novamente.`});
                else if(err.message == "Network Error") //server is down
                    setErros({...erroObj, geral: `Erro: ${err.message}`});
                else
                    setErros({...erroObj, geral: `Erro: ${err.message}`});
            })
            .finally(() => setLoading(false));
    };

    return (
        <View style={styles.container}>
            <GradienteInicio espelharGradiente image={require("@/assets/images/avatar-login.png")} />
            <StyledText style={styles.title}>Login</StyledText>
            <View style={styles.separator} />
            
            <ErroInput
                show={erros.geral}
                texto={erros.geral}
            />
            <View style={[styles.txtInputIcon, erros.inputLogin && styles.inputErro]}>
                <Feather name="mail" style={[styles.iconeTxtInput, erros.inputLogin && styles.inputErro]}/>
                <StyledTextInput 
                    placeholder="Email ou Username"
                    value={login}
                    onChangeText={(txt) => setLogin(txt)} 
                    style={[styles.input, erros.inputLogin && styles.inputErro]}
                    enterKeyHint="next"
                    blurOnSubmit={false}
                    onBlur={() => setErros({...erros, "inputLogin": !login})}
                    onSubmitEditing={() => passRef.current && passRef.current.focus()}
                />
            </View>
            <ErroInput
                show={erros.inputLogin}
                texto="O campo é obrigatório!"
            />
            <ErroInput
                show={erros.regex}
                texto="O usuário é inválido!"
            />

            <View style={[styles.txtInputIcon, erros.inputSenha && styles.inputErro]}>
                <Feather name="lock" style={[styles.iconeTxtInput, erros.inputSenha && styles.inputErro]}/>
                <StyledTextInput
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onBlur={() => setErros({...erros, "inputSenha": !senha})}
                    onChangeText={(txt) => setSenha(txt)}
                    style={styles.input}
                    ref={passRef}
                    onSubmitEditing={() => handleLogin()} 
                />
            </View>
            <ErroInput
                show={erros.inputSenha}
                texto="O campo é obrigatório!"
            />

            <TouchableOpacity style={styles.botaoEntrar} onPress={handleLogin}>
            {loading ? <ActivityIndicator size={"small"} color={colors.verde.padrao}/> : 
                <StyledText style={styles.txtBotaoEntrar}>ENTRAR</StyledText>}
            </TouchableOpacity>

            <View style={styles.separator} />
            
            <StyledText>Ainda não tem conta?</StyledText>

            <TouchableOpacity style={styles.botaoEntrar} onPress={() => router.push("/cadastro")}>
                <StyledText style={styles.txtBotaoEntrar}>CADASTRE-SE AGORA!</StyledText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.branco.padrao,
    },
    title: {
        fontSize: 40,
        fontFamily: fonts.padrao.Medium500,
        textAlign: 'center'
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: "center",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    txtInputIcon:{
        width: "80%",
        flexDirection: "row",
        borderWidth: 1,
        backgroundColor: colors.branco.padrao,
        borderColor: colors.preto.padrao,
        padding: 10,
        margin: 10,
        borderRadius: 20,
    },
    iconeTxtInput:{
        alignSelf: 'center',
        paddingRight: 5,
        fontSize: 18,
        color: colors.preto.padrao 
    },
    input: {
        flex:1
    },
    inputErro:{
        borderColor: colors.vermelho.padrao,
        color: colors.vermelho.padrao
    },
    botaoEntrar:{
        backgroundColor: colors.cinza.escuro,
        padding:10,
        paddingHorizontal: 25,
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 5
    },
    txtBotaoEntrar:{
        color: colors.branco.padrao,
    }
});