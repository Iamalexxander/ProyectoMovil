import { NativeBaseProvider, View } from "native-base";

export const Contenedor = ({children})=>{
    return <NativeBaseProvider>
        <View>
            {children}
        </View>
    </NativeBaseProvider>
}