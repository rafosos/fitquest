import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, TextInput,Text, View,TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useSession } from "./ctx";
import UserService from "@/services/user_service";
import ClasseService from "@/services/classe_service";
import Classe from "@/classes/classe";

export default function Cadastro() {    
    const userService = UserService();
    const classeService = ClasseService();
    const [nickname, setNickname] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState(new Date());
    // const [classeId, setClasseId] = useState(0);
    const [senha, setSenha] = useState("");
    const [classes, setClasses] = useState<Classe[]>([]);
    const [datePicker, setDatePicker] = useState(false);

    const fullnameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);

    useEffect(() => {
        classeService.getAll()
            .then(res => setClasses(res))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (Platform.OS == "android" && datePicker)
            DateTimePickerAndroid.open({
                mode: "date",
                value: nascimento,
                onChange: handleDatePickerChange
        })
    }, [datePicker])

    const handleCadastrar = () => {
        // classe: classeId,
        userService.cadastrar({
            nickname,
            fullname,
            nascimento,
            email,
            senha
        })
            .then(res => {
                if (res){
                    router.replace("/");
                }
            })
            .catch(err => console.log("Erro ao fazer login"));
    };

    const handleDatePickerChange = (e: DateTimePickerEvent , data?: Date) => {
        if (e.type == "set" && data)
            setNascimento(data);
        setDatePicker(false);
    }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <View style={styles.separator} />
        <TextInput 
            placeholder="Nickname"
            value={nickname}
            onChangeText={(txt) => setNickname(txt)} 
            style={styles.input}
            enterKeyHint="next"
            blurOnSubmit={false}
            onSubmitEditing={() => fullnameRef.current && fullnameRef.current.focus()}
            />

        <TextInput 
            placeholder="Nome completo"
            value={fullname}
            onChangeText={(txt) => setFullname(txt)} 
            enterKeyHint="next"
            style={styles.input}
            blurOnSubmit={false}
            ref={fullnameRef}
            onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
        />

        <TextInput
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email"
            value={email}
            onChangeText={(txt) => setEmail(txt)} 
            enterKeyHint="next"
            ref={emailRef}
            style={styles.input}
        />

        <TouchableOpacity
            style={styles.input}
            onPress={() => setDatePicker(true)}
        >
            <TextInput 
                placeholder="nascimento"
                value={`${nascimento.getDate()}/${nascimento.getMonth()}/${nascimento.getFullYear()}`}
                editable={false}
                style={{color: "black"}}
            />
        </TouchableOpacity>
        {(datePicker && Platform.OS != "android") &&
            <RNDateTimePicker 
                mode="date"
                onChange={handleDatePickerChange}
                value={nascimento}
            />
        }

        {/* <View style={{...styles.input, padding:0}}>
        <Picker
            selectedValue={classeId}
            onValueChange={(itemValue) => itemValue != 0 && setClasseId(itemValue)}
        >
            <Picker.Item label="Selecione uma classe" value={0} key={0} style={{color: "rgba(0,0,0,0.6)"}}/>
            {classes.map((c) => 
                <Picker.Item label={c.nome} value={c.id} key={c.id}/>
            )}
        </Picker>
        </View> */}

        <TextInput
            placeholder="Password"
            secureTextEntry
            value={senha}
            onChangeText={(txt) => setSenha(txt)} 
            style={styles.input}
        />

        <Button title="Cadastrar" onPress={handleCadastrar} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
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
        borderColor: "#000",
        padding: 10,
        margin: 10,
        borderRadius: 4,
    },
});