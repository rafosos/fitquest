import { ActivityIndicator, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
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
import axios from "axios";
import { regexSqlInjectionVerify } from "@/utils/functions";
import { ErrorHandler } from "@/utils/ErrorHandler";
import DumbbelLogo from "@/assets/images/dumbbel_logo";
import BackgroundInputs from "@/components/BackgroundInputs";
import LabeledInput from "@/components/base/labeledInput";

export default function Login() {
    const { signIn } = useSession();
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

        setLoading(true);
        userService.login(login, senha)
            .then(res => {
                if (res){
                    axios.defaults.headers.common = { "Authorization": `Bearer ${res.data.access_token}` }
                    signIn(res.data);
                    router.replace("/(auth)/(tabs)/home/");
                } else {
                    setErros({...erroObj, geral: `Login e senha inválidos ou incompatíveis, confira as informações inseridas e tente novamente.`});
                }
            })
            .catch(err => {
                errorHandler.handleError(err);
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
            <StatusBar barStyle={"dark-content"} backgroundColor={colors.preto.padrao}/>
            
            <DumbbelLogo style={styles.logo}/>
            <StyledText style={styles.title}>Bem-vindo de volta!</StyledText>
            <StyledText style={styles.subtitle}>Entre para continuar sua jornada fitness</StyledText>
            
            <ErroInput
                style={styles.erroGeral}
                show={erros.geral}
                texto={erros.geral}
            />

            <BackgroundInputs
                inputList={[
                    <LabeledInput
                        erroStyle={erros.inputLogin && styles.inputErro}
                        label="Email ou username"
                        key="Email ou username"
                        inputComponent={
                            <View style={[styles.txtInputIcon, erros.inputLogin && styles.inputErro]}>
                                <Feather name="mail" style={[styles.iconeTxtInput, erros.inputLogin && styles.inputErro]}/>
                                <StyledTextInput 
                                    placeholder="Ex.: seu@email.com"
                                    value={login}
                                    onChangeText={(txt) => setLogin(txt)} 
                                    style={[styles.input, erros.inputLogin && styles.inputErro]}
                                    enterKeyHint="next"
                                    blurOnSubmit={false}
                                    onBlur={() => setErros({...erros, "inputLogin": !login})}
                                    onSubmitEditing={() => passRef.current && passRef.current.focus()}
                                />
                            </View>
                        }
                        errors={[
                            <ErroInput
                                show={erros.inputLogin}
                                texto="O campo é obrigatório!"
                            />,
                            <ErroInput
                                show={erros.regex}
                                texto="O usuário é inválido!"
                            />
                        ]}
                    />,

                    <LabeledInput
                        key={"senha"}
                        label="Senha"
                        erroStyle={erros.inputSenha && styles.inputErro}
                        inputComponent={
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
                        }
                        errors={[
                            <ErroInput
                                show={erros.inputSenha}
                                texto="O campo é obrigatório!"
                            />
                        ]}
                    />
                ]}
                botao={
                    <TouchableOpacity style={styles.botaoEntrar} onPress={handleLogin}>
                    {loading ? <ActivityIndicator size={"small"} color={colors.verde.padrao}/> : 
                        <StyledText style={styles.txtBotaoEntrar}>Entrar</StyledText>}
                    </TouchableOpacity>
                }
            />

            <StyledText style={styles.txtCadastro}>Ainda não tem conta?
                <StyledText style={styles.txtBotaoCadastro} onPress={() => router.push("/cadastro")}> Criar conta</StyledText>
            </StyledText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.preto.padrao,
    },
    logo: {
        marginBottom: 25, 
    },
    title: {
        fontSize: 25,
        fontFamily: fonts.padrao.Medium500,
        color: colors.branco.padrao,
        textAlign: 'center'
    },
    subtitle:{
        color: colors.cinza.medio3
    },
    erroGeral:{
        marginVertical: 15
    },
    containerInputs:{
        backgroundColor: colors.azul.escuro,
        borderRadius: 15,
        paddingVertical: 15,
        gap: 10,
        marginTop: 25,
        paddingHorizontal: 20,
    },
    containerInput:{
        width: '100%'
    },
    label:{
        color: colors.cinza.medio3
    },
    txtInputIcon:{
        flexDirection: "row",
        borderWidth: 1,
        backgroundColor: colors.cinza.medio3,
        borderColor: colors.preto.padrao,
        padding: 10,
        borderRadius: 15,
        marginBottom: 5
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
        backgroundColor: colors.verde.padrao2,
        padding: 10,
        paddingHorizontal: 25,
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 5
    },
    txtBotaoEntrar:{
        fontFamily: fonts.padrao.Bold700,
        color: colors.preto.padrao,
    },
    txtCadastro:{
        color: colors.cinza.medio3,
        marginTop: 25
    },
    txtBotaoCadastro:{
        color: colors.verde.padrao2
    }
});