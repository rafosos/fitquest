import { Button, StyleSheet, TextInput,Text, View } from "react-native";
import { useSession } from "./ctx";
import { router } from "expo-router";
import UserService from "@/services/user_service";
import { useRef, useState } from "react";
import { colors } from "@/constants/Colors";

export default function Login() {
    const { signIn, setUser } = useSession();
    const userService = UserService();
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");

    const passRef = useRef<TextInput>(null);

    const handleLogin = () => {
        userService.login(login, senha)
            .then(res => {
                if (res){
                    signIn(res.id.toString());
                    setUser(JSON.stringify(res));
                    router.replace("/");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem vindo ao FitQuest 💪</Text>
            <View style={styles.separator} />
            <TextInput 
                placeholder="Username"
                value={login}
                onChangeText={(txt) => setLogin(txt)} 
                style={styles.input}
                enterKeyHint="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passRef.current && passRef.current.focus()} 
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={senha}
                onChangeText={(txt) => setSenha(txt)} 
                style={styles.input}
                ref={passRef}
                onSubmitEditing={() => handleLogin()} 
            />
            <Button title="Login" onPress={handleLogin} />

            <View style={styles.separator} />
            
            <View>
                <Text>Ainda não tem conta?</Text>
                <Button title="Cadastre-se agora!" onPress={() => router.push("/cadastro")} />
            </View>
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
    borderColor: colors.preto.padrao,
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
});