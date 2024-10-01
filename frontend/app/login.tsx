import { Button, StyleSheet, TextInput,Text, View } from "react-native";
import { useSession } from "./ctx";
import { router } from "expo-router";
import UserService from "@/services/user_service";
import { useState } from "react";

export default function Login() {
    const { signIn } = useSession();
    const userService = UserService();
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = () => {
        console.log("login")
        userService.login(login, senha)
            .then(res => {
                console.log(res);
                if (res){
                    signIn(res);
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
            />
        <TextInput
            placeholder="Password"
            secureTextEntry
            value={senha}
            onChangeText={(txt) => setSenha(txt)} 
            style={styles.input}
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
    borderColor: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
});