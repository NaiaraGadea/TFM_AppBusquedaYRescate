// src/screens/home/pantallaCasoPublic.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, Share, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

// Etiqueta moderna
const InfoTag = ({
  text,
  backgroundColor = '#3498db',
  textColor = '#fff',
  style,
}) => {
  return (
    <View style={[styles.tagContainer, { backgroundColor }, style]}>
      <Text style={[styles.tagText, { color: textColor }]}>{text}</Text>
    </View>
  );
};


export default function casoPublico({ route, navigation }) {
  const { item } = route.params;
  const [message, setMessage] = useState('');

  const onShare = async () => {
    try {
      await Share.share({
        message: `Ayuda a difundir: ${item.full_name}, 
        visto por última vez en ${item.last_seen_location}. 
        Más info: ${item.description || ''} ${item.information || ''}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}>
    <ScrollView style={styles.container}>
      <InfoTag text={item.case_status ? "Activo" : "Cerrado"} backgroundColor={item.case_status ? "#27ae60" : "#AC0B1B"} />
      <InfoTag text={item.alert_type ? "Público" :  "Privado"} backgroundColor={item.alert?.is_public ? "#188fff" : "#555"}/>
      <Image source={{ uri: item.missing.photo_url }} style={styles.image} />
      <Text style={styles.name}>{item.person.first_name} {item.person.last_name}</Text>
      <Text style={styles.text}>Fecha de desaparición: {item.disappearance_date}</Text>
      <Text style={styles.text}>Edad actual: {item.age || 'Desconocida'} años</Text>
      <Text style={styles.text}>Última localización: {item.last_seen_point}</Text>
      {item.missing.height ? <Text style={styles.text}>Altura: {item.missing.height} m</Text> : null}
      {item.missing.weight ? <Text style={styles.text}>Peso: {item.missing.weight} kg</Text> : null}
      {item.missing.hair ? <Text style={styles.text}>Pelo: {item.missing.hair}</Text> : null}
      {item.missing.facial_hair ? <Text style={styles.text}>Vello facial: {item.missing.facial_hair}</Text> : null}
      {item.missing.eye_colour ? <Text style={styles.text}>Color de ojos: {item.missing.eye_colour}</Text> : null}
      {item.missing.physical_constitution ? <Text style={styles.text}>Constitución física: {item.missing.physical_constitution}</Text> : null}
      {item.missing.description ? <Text style={styles.text}>Descripción: {item.missing.description}</Text> : null}
      {item.missing.information ? <Text style={styles.text}>Información extra: {item.missing.information}</Text> : null}
      {item.group_name ? <Text style={styles.text}>Grupo encargado: {item.group_name}</Text> : null}
      <Text style={styles.text}>Contacto: </Text>
      {item.group_phone ? <Text style={styles.text}>Teléfono de contacto: {item.group_phone}</Text> : null}
      {item.group_email ? <Text style={styles.text}>Correo electrónico de contacto: {item.group_email}</Text> : null}

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
    </KeyboardAvoidingView>
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
    borderRadius: 6,
  },
  tagContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
});