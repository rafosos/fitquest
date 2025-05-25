import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity, Platform, ActivityIndicator, ScrollView } from "react-native";
import { router, useNavigation } from "expo-router";
import StyledText from "@/components/base/styledText";
import StyledTextInput from "@/components/base/styledTextInput";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import UserService from "@/services/user_service";
import { colors } from "@/constants/Colors";
import ErroInput from "@/components/ErroInput";
import { AntDesign } from "@expo/vector-icons";
import { regexSqlInjectionVerify, showDiaMes } from "@/utils/functions";
import { useToast } from "react-native-toast-notifications";
import HeaderLogoTitleSubTitle from "@/components/base/headerLogoTitleSub";
import LabeledInput from "@/components/base/labeledInput";
import BackgroundInputs from "@/components/BackgroundInputs";
import { fonts } from "@/constants/Fonts";

export default function Cadastro() {    
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState<Date>();
    const [erros, setErros] = useState<any>({});
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [datePicker, setDatePicker] = useState(false);
    
    const userService = UserService();

    const toast = useToast();

    const fullnameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    
    const navigator = useNavigation();

    useEffect(() => {
        if (Platform.OS == "android" && datePicker)
            DateTimePickerAndroid.open({
                mode: "date",
                value: nascimento ?? new Date(),
                onChange: handleDatePickerChange
        })
    }, [datePicker]);
    
    const handleCadastrar = () => {        
        let erroObj = {...erros};
        // checagem de erros
        erroObj = {...erros,
            geral: false,
            username: !username,
            usernameRegex: username && regexSqlInjectionVerify(username),
            fullname: !fullname,
            fullnameRegex: fullname && regexSqlInjectionVerify(fullname),
            email: !email,
            emailRegex: email && regexSqlInjectionVerify(email),
            nascimento: !nascimento,
            senha: !senha
        };
        setErros(erroObj);
        
        // se algum erro existe, a função .some vai voltar true e não vai chamar submit
        if(Object.values(erroObj).some(err => err)) return;
        if (!nascimento) return

        setLoading(true);
        userService.cadastrar({
            username,
            fullname,
            nascimento,
            email,
            senha
        })
            .then(res => {
                if (res){
                    router.back();
                    toast.show("Usuário cadastrado com sucesso!", {type: "success"});
                }
            })
            .catch(err => {
                if (err.response){
                    setErros({...erros, 
                        geral: err.response.data.detail,
                        username: err.response.data.detail.includes("Username"),
                        email: err.response.data.detail.includes("Email"),
                    });
                }
            })
            .finally(()=>setLoading(false));
    };

    const handleDatePickerChange = (e: DateTimePickerEvent , data?: Date) => {
        if (e.type == "set" && data)
            setNascimento(data);
        else if ((e.type == 'neutralButtonPressed' || e.type == 'dismissed') && !nascimento)
            setErros({...erros, nascimento: !nascimento});
        setDatePicker(false);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <AntDesign name="arrowleft" onPress={() => navigator.goBack()} style={styles.iconeVoltar} />
            
            <HeaderLogoTitleSubTitle 
                title="Crie sua conta"
                subtitle="Começe sua jornada fitness hoje mesmo!"
            />

            <ErroInput
                style={styles.erroGeral}
                show={erros.geral} 
                texto={erros.geral}
            />

            <BackgroundInputs
                inputList={[
                    <LabeledInput
                        key={"Username"}
                        label="Username"
                        inputComponent={
                            <StyledTextInput 
                                placeholder="Username"
                                value={username}
                                onChangeText={(txt) => setUsername(txt)} 
                                style={[styles.input, erros.username && styles.inputErro]}
                                enterKeyHint="next"
                                blurOnSubmit={false}
                                onBlur={() => setErros({...erros, username: !username})}
                                onSubmitEditing={() => fullnameRef.current && fullnameRef.current.focus()}
                            />
                        }
                        errors={[
                            <ErroInput 
                                show={erros.username && !erros.geral}
                                texto="O username é obrigatório!"
                            />,
                            <ErroInput 
                                show={erros.usernameRegex && !erros.username && !erros.geral}
                                texto="O username inserido é invalido!"
                            />
                        ]}
                    />,

                    <LabeledInput
                        key={"nome completo"}
                        label="Nome completo"
                        inputComponent={
                            <StyledTextInput 
                                placeholder="Nome completo"
                                value={fullname}
                                onChangeText={(txt) => setFullname(txt)} 
                                enterKeyHint="next"
                                style={[styles.input, erros.fullname && styles.inputErro]}
                                blurOnSubmit={false}
                                ref={fullnameRef}
                                onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
                                onBlur={() => setErros({...erros, fullname: !fullname})}
                            />
                        }
                        errors={[
                            <ErroInput 
                                show={erros.fullname && !erros.geral}
                                texto="O nome completo é obrigatório!"
                            />,
                            <ErroInput 
                                show={erros.fullnameRegex && !erros.fullname && !erros.geral}
                                texto="O nome completo inserido é inválido!"
                            />
                        ]}
                    />,

                    <LabeledInput
                        key={"email"}
                        label="Email"
                        inputComponent={
                            <StyledTextInput
                                autoComplete="email"
                                keyboardType="email-address"
                                placeholder="Email"
                                value={email}
                                onChangeText={(txt) => setEmail(txt)} 
                                enterKeyHint="next"
                                ref={emailRef}
                                style={[styles.input, erros.email && styles.inputErro]}
                                onBlur={() => setErros({...erros, email: !email})}
                            />
                        }
                        errors={[
                            <ErroInput 
                                show={erros.email && !erros.geral}
                                texto="O email é obrigatório!"
                            />,
                            <ErroInput 
                                show={erros.emailRegex && !erros.email && !erros.geral}
                                texto="O email inserido é inválido!"
                            />
                        ]}
                    />,

                    <LabeledInput
                        key={"data nascimento"}
                        label="Data de nascimento"
                        inputComponent={<>
                            <TouchableOpacity
                                style={[styles.input, erros.nascimento && styles.inputErro]}
                                onPress={() => setDatePicker(true)}
                                >
                                <StyledTextInput 
                                    placeholder="Data de nascimento"
                                    value={showDiaMes(nascimento) == "..." ? undefined : showDiaMes(nascimento)}
                                    editable={false}
                                    style={{color: colors.preto.padrao}}
                                    />
                            </TouchableOpacity>
                            {(datePicker && Platform.OS != "android") &&
                                <RNDateTimePicker 
                                mode="date"
                                onChange={handleDatePickerChange}
                                value={nascimento ?? new Date()}
                                />
                            }
                        </>}
                        errors={[  
                            <ErroInput 
                                show={erros.nascimento}
                                texto="O campo Data de nascimento é obrigatório."
                            />
                        ]}
                    />,

                    <LabeledInput
                        key={"senha"}
                        label="Senha"
                        inputComponent={
                            <StyledTextInput
                                placeholder="Senha"
                                secureTextEntry
                                value={senha}
                                onChangeText={(txt) => setSenha(txt)}
                                onBlur={() => setErros({...erros, senha: !senha})} 
                                style={[styles.input, erros.senha && styles.inputErro]}
                            />
                        }
                        errors={[
                            <ErroInput
                                show={erros.senha}
                                texto="O campo senha é obrigatório."
                            />
                        ]}
                    />
                ]}
                botao={
                    <TouchableOpacity style={styles.botaoEnviar} onPress={handleCadastrar}>
                        {loading ? <ActivityIndicator size={"small"} color={colors.verde.padrao}/> : 
                            <StyledText style={styles.textBotaoEnviar}>Criar conta</StyledText>
                        }
                    </TouchableOpacity>
                }
            />

            <StyledText style={styles.txtLogin}>Já tem conta?
                <StyledText style={styles.txtBotaoLogin} onPress={() => router.replace("/login")}> Entrar</StyledText>
            </StyledText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.preto.padrao,
        alignItems: "center",
        justifyContent: "center",
    },
    iconeVoltar:{
        fontSize: 30, 
        color: colors.cinza.medio3, 
        position: 'absolute', 
        top: 15, 
        left: 15
    },
    erroGeral: {
        marginVertical: 15
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
    input: {
        borderWidth: 1,
        backgroundColor: colors.cinza.medio3,
        borderColor: colors.preto.padrao,
        padding: 10,
        borderRadius: 15,
    },
    inputErro:{
        borderColor: colors.vermelho.erro,
        color: colors.vermelho.erro
    },
    botaoEnviar:{
        width: '100%',
        backgroundColor: colors.verde.padrao,
        alignItems: 'center',
        borderRadius: 15,
        padding: 10,
        paddingHorizontal: 25
    },
    textBotaoEnviar:{
        color: colors.preto.padrao,
        fontFamily: fonts.padrao.Bold700
    },
    txtLogin:{
        color: colors.cinza.medio3,
        marginTop: 25
    },
    txtBotaoLogin:{
        color: colors.verde.padrao2
    }

});