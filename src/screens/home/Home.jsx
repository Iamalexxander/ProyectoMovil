import {
    Text,
    Button,
    Center,
    Image,
    Box,
    Divider,
    VStack,
    Heading,
} from "native-base";
import { Contenedor } from "../../components/contenedor/Contenedor";
import { ScrollView } from "react-native";

export const Home = ({ navigation }) => {
    const MenuCard = ({ title, description, route, imageUrl }) => (
        <Box bg="white" rounded="xl" shadow={3} p="4" mb="4">
            <Center>
                <Image
                    size={150}
                    mt="5"
                    my="5"
                    alt={`${title} Image`}
                    borderRadius={100}
                    borderWidth={3}
                    borderColor="cyan.500"
                    shadow={5}
                    source={{
                        uri: imageUrl
                    }}
                />
            </Center>
            <Text color="cyan.600" fontSize="lg" fontWeight="bold" mb="2">
                {title}
            </Text>
            <Text fontWeight="medium" textAlign="justify" mb="3" color="gray.600">
                {description}
            </Text>
            <Button
                bg="cyan.500"
                _pressed={{ bg: "cyan.600" }}
                rounded="lg"
                shadow={2}
                onPress={() => navigation.navigate(route)}
            >
                Ir a {title}
            </Button>
        </Box>
    );

    return (
        <Contenedor>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space={4} p="4">
                    <Center>
                        <Image
                            size={150}
                            mt="5"
                            my="5"
                            alt="Profile Image"
                            borderRadius={100}
                            borderWidth={3}
                            borderColor="cyan.500"
                            shadow={5}
                            source={{
                                uri: "https://static.wikia.nocookie.net/the-daily-life-of-the-immortal-king/images/d/df/Demon_master.jpg/revision/latest?cb=20220914163338"
                            }}
                        />
                    </Center>

                    <Box bg="white" p="5" rounded="xl" shadow={3}>
                        <Heading textAlign="center" fontSize="2xl">
                            Prueba web{" "}
                            <Text color="cyan.500" bold>
                                Prueba web
                            </Text>
                        </Heading>
                        <Text mt="3" fontWeight="medium" textAlign="center" color="gray.600">
                            Esta prueba fue hecha por Foxy
                        </Text>
                    </Box>

                    <MenuCard
                        title="Crud de Usuarios"
                        description="Esta pantalla nos servira para la prueba."
                        route="Usuarios"
                        imageUrl="https://lh6.googleusercontent.com/proxy/Iw7S760QwEKoYRokvLPlTxw7c4_ZMgffPJEg6-Vn1x4UBRAnF7QfGFxVawnLkOcfTNTRQ2zLp-XDRvaVj0eUZkSY516hSwN18SXsEkfAZQs"
                    />
                </VStack>
            </ScrollView>
        </Contenedor>
    );
};
