import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { router, useNavigation } from "expo-router";
import StyledText from "@/components/base/styledText";
import StyledTextInput from "@/components/base/styledTextInput";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';

import UserService from "@/services/user_service";
import ClasseService from "@/services/classe_service";
import Classe from "@/classes/classe";
import { fonts } from "@/constants/Fonts";
import GradienteInicio from "@/components/GradienteInicio";
import { colors } from "@/constants/Colors";
import ErroInput from "@/components/ErroInput";
import { AntDesign } from "@expo/vector-icons";
import { showDiaMes } from "@/utils/functions";

export default function Cadastro() {    
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState<Date>();
    const [erros, setErros] = useState<any>({});
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    // const [classes, setClasses] = useState<Classe[]>([]);
    const [datePicker, setDatePicker] = useState(false);
    
    const userService = UserService();
    // const classeService = ClasseService();

    const fullnameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    
    const navigator = useNavigation();

    // useEffect(() => {
    //     classeService.getAll()
    //         .then(res => setClasses(res))
    //         .catch(err => console.log(err));
    // }, []);

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
            fullname: !fullname,
            email: !email,
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
                    router.back()
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
        <View style={styles.container}>
            <GradienteInicio image={require("@/assets/images/avatar-cadastro.png")} />

            <AntDesign name="arrowleft" onPress={() => navigator.goBack()} style={styles.iconeVoltar} />
            
            <StyledText style={styles.title}>Cadastro</StyledText>
            <View style={styles.separator} />

            <ErroInput
                show={erros.geral} 
                texto={erros.geral}
            />
            
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
            <ErroInput 
                show={erros.username && !erros.geral}
                texto="O username é obrigatório!"
            />

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
            <ErroInput 
                show={erros.fullname}
                texto="O nome completo é obrigatório!"
            />

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
            <ErroInput 
                show={erros.email && !erros.geral}
                texto="O email é obrigatório!"
            />

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
            <ErroInput 
                show={erros.nascimento}
                texto="O campo Data de nascimento é obrigatório."
            />

            <StyledTextInput
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={(txt) => setSenha(txt)}
                onBlur={() => setErros({...erros, senha: !senha})} 
                style={[styles.input, erros.senha && styles.inputErro]}
            />
            <ErroInput
                show={erros.senha}
                texto="O campo senha é obrigatório."
            />

            <TouchableOpacity style={styles.botaoEnviar} onPress={handleCadastrar}>
                {loading ? <ActivityIndicator size={"small"} color={colors.verde.padrao}/> : 
                    <StyledText style={styles.textBotaoEnviar}>CADASTRAR</StyledText>
                }
            </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.branco.padrao,
        alignItems: "center",
        justifyContent: "center",
    },
    iconeVoltar:{
        fontSize: 30, 
        color: colors.preto.padrao, 
        position: 'absolute', 
        top: 15, 
        left: 15
    },
    title: {
        fontSize: 40,
        fontFamily: fonts.padrao.Medium500,
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
        width: "80%",
        borderWidth: 1,
        backgroundColor: colors.branco.padrao,
        borderColor: colors.preto.padrao,
        padding: 10,
        margin: 10,
        borderRadius: 20,
    },
    inputErro:{
        borderColor: colors.vermelho.erro,
        color: colors.vermelho.erro
    },
    botaoEnviar:{
        backgroundColor: colors.cinza.escuro,
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 5,
        padding: 10,
        paddingHorizontal: 25
    },
    textBotaoEnviar:{
        color: colors.branco.padrao
    }
});