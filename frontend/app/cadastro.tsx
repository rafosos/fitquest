import { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput,Text, View,TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { useSession } from "./ctx";
import UserService from "@/services/user_service";
import ClasseService from "@/services/classe_service";

export default function Cadastro() {
    const { signIn } = useSession();
    const userService = UserService();
    const classeService = ClasseService();
    const [nickname, setNickname] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState(new Date());
    const [classe, setClasse] = useState(0);
    const [senha, setSenha] = useState("");
    const [classes, setClasses] = useState([]);
    const [datePicker, setDatePicker] = useState(false);

    useEffect(() => {
        classeService.getAll()
            .then(res => setClasses(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleCadastrar = () => {
        userService.cadastrar({
            nickname,
            fullname,
            nascimento,
            email,
            classe,
            senha
        })
            .then(res => {
                console.log(res);
                if (res){
                    signIn();
                    router.replace("/");
                }
            })
            .catch(err => console.log("Erro ao fazer login"));
    };

  return (
    <View style={styles.container}>
        <View style={styles.separator} />
        <Text style={styles.title}>Cadastro</Text>
        <TextInput 
            placeholder="Nickname"
            value={nickname}
            onChangeText={(txt) => setNickname(txt)} 
            style={styles.input} 
            />

        <TextInput 
            placeholder="Nome completo"
            value={fullname}
            onChangeText={(txt) => setFullname(txt)} 
            style={styles.input}
        />

        <TextInput 
            placeholder="Email"
            value={email}
            onChangeText={(txt) => setEmail(txt)} 
            style={styles.input}
        />

        <TouchableOpacity
            style={{width: "100%"}} 
            onPress={() => setDatePicker(true)}
        >
            <TextInput 
                placeholder="nascimento"
                value={`${nascimento.getDate()}/${nascimento.getMonth()}/${nascimento.getFullYear()}`}
                style={styles.input}
                editable={false}
            />
        </TouchableOpacity>
        {datePicker && Platform.OS === "android" ?
            <DateTimePickerAndroid
                mode="date"
                onChange={(e, value) => value ? setNascimento(value) : setDatePicker(false)}
                value={nascimento}
                // adicionar restrição para menores de alguma idade?
            />
            :
            <RNDateTimePicker 
                mode="date"
                onChange={(e, value) => value ? setNascimento(value) : setDatePicker(false)}
                value={nascimento}
            />}

        {/* <TextInput 
            placeholder="Classe"
            value={classe}
            onChangeText={(txt) => setClasse(txt)} 
            style={styles.input}
        /> */}

        <TextInput
            placeholder="Password"
            secureTextEntry
            value={senha}
            onChangeText={(txt) => setSenha(txt)} 
            style={styles.input}
        />
        <Button title="Login" onPress={handleCadastrar} />
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