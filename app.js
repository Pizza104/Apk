import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
    const [texto1, setTexto1] = useState('Texto inicial 1');
    const [texto2, setTexto2] = useState('Texto inicial 2');

    const alterarTexto1 = () => {
        setTexto1('Texto com alguma coisa do botão 1');
    };

    const alterarTexto2 = () => {
        setTexto2('Texto com alguma coisa do botão 2');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>{texto1}</Text>
                <Button
                    title="Alterar Texto 1"
                    onPress={alterarTexto1}
                    color="#4CAF50"
                />

                <View style={styles.separator} />

                <Text style={styles.text}>{texto2}</Text>
                <Button
                    title="Alterar Texto 2"
                    onPress={alterarTexto2}
                    color="#2196F3"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    separator: {
        height: 30,
    },
});