// src/screens/home/pantallaCasoPublic.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, Share, ScrollView } from 'react-native';

export default function casoPublico({ route, navigation }) {
  const { item } = route.params;
  const [message, setMessage] = useState('');

  const onShare = async () => {
    try {
      await Share.share({
        message: `Ayuda a difundir: ${item.full_name}, visto por última vez en ${item.last_seen_location}. Más info: ${item.description || ''} ${item.information || ''}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.photo_url }} style={styles.image} />
      <Text style={styles.name}>{item.full_name}</Text>
      <Text style={styles.text}>Edad: {item.age || 'Desconocida'} años</Text>
      <Text style={styles.text}>Última localización: {item.last_seen_location}</Text>
      {item.description ? <Text style={styles.text}>Descripción: {item.description}</Text> : null}
      {item.information ? <Text style={styles.text}>Información extra: {item.information}</Text> : null}

      <TouchableOpacity style={[styles.button2, { backgroundColor: '#1976d2' }]} onPress={onShare}>
        <Text style={styles.buttonText}>Compartir en redes sociales</Text>
      </TouchableOpacity>
      
      <Text style={styles.subtitle}>Contactar responsables:</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu mensaje..."
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={() => alert(`Mensaje enviado: ${message}`)}>
        <Text style={styles.buttonText}>Enviar mensaje</Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingBottom: 50 },
  image: { width: '30%',
    height: '30%',
    aspectRatio: 2 / 3, // mantiene proporción en móvil y web
    borderRadius: 8,
    backgroundColor: '#eee',
    marginBottom: 16, 
    alignSelf: 'center'},
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 , alignSelf: 'center'},
  text: { fontSize: 16, marginBottom: 6, alignSelf: 'center' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 12,
    backgroundColor: 'rgb(143,164,179)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
  color: 'rgb(255,255,255)',
  fontSize: 16,
  fontWeight: '600',
  alignSelf: 'center'
  },
  button2: {marginTop: 12,
    backgroundColor: 'rgb(129, 173, 198)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,}
});