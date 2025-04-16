import { useSession } from "@/app/ctx"
import { AxiosError, isAxiosError } from "axios";
import { useToast } from "react-native-toast-notifications"

export const ErrorHandler = () => {
    const toast = useToast();
    const {signOut} = useSession();

    const checkError = (error: any) => {
        console.log("\n\nerror.toJson:  ################################################################################");
        console.log(error.toJSON());

        if(isAxiosError(error)){
            error as AxiosError;

            const tipo = {type: "danger"};

            if(error.response){
                if (error.response.status == 401){
                    signOut();
                    toast.show("Você precisa logar novamente!", tipo);
                    return
                }

                if (error.response.status == 400 && error.response.data.detail){
                    toast.show(error.response.data.detail, tipo);
                    return;
                }

                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("error.response:  #############################################################################")
                console.log(error.response.status);
                console.log(error.response.data);
                console.log(error.response.headers);
            }
            if (error.request) {
                console.log("error.request:   #########################################################################")
                console.log(error.request);
            }
            toast.show("Ops, ocorreu um erro :(\nPor favor, tente novamente", {type: 'danger'});
            console.log('Error.message: ', error.message);
            console.log("error.config: ", error.config);
        }else{
            toast.show("Um erro ocorreu. :(", {type: "danger"});
        }

    }

    return {handleError: checkError}
} 