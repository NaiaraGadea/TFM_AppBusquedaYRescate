// src/screens/home/pantallaCasoPublic.js
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TextInput, Button, 
  TouchableOpacity, Share, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';

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
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.container}
      >

        {/* ETIQUETAS */}
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <InfoTag 
            text={item.case_status ? "Activo" : "Cerrado"} 
            backgroundColor={item.case_status ? "#27ae60" : "#AC0B1B"} 
          />
          <InfoTag 
            text={item.alert?.is_public ? "Público" : "Privado"} 
            backgroundColor={item.alert?.is_public ? "#188fff" : "#555"} 
          />
        </View>

        {/* FOTO */}
        <Image source={{ uri: item.missing.photo_url }} style={styles.image} />

        {/* NOMBRE */}
        <Text style={styles.name}>
          {item.person.first_name} {item.person.last_name}
        </Text>

        {/* INFO DEL CASO */}
        <Text style={styles.label}>Fecha de desaparición:</Text>
        <Text style={styles.text}>{item.disappearance_date}</Text>

        <Text style={styles.label}>Edad actual:</Text>
        <Text style={styles.text}>{item.age || 'Desconocida'} años</Text>

        <Text style={styles.label}>Última localización:</Text>
        <Text style={styles.text}>{item.last_seen_point}</Text>

        {item.missing.height && (
          <>
            <Text style={styles.label}>Altura:</Text>
            <Text style={styles.text}>{item.missing.height} m</Text>
          </>
        )}

        {item.missing.weight && (
          <>
            <Text style={styles.label}>Peso:</Text>
            <Text style={styles.text}>{item.missing.weight} kg</Text>
          </>
        )}

        {item.missing.hair && (
          <>
            <Text style={styles.label}>Pelo:</Text>
            <Text style={styles.text}>{item.missing.hair}</Text>
          </>
        )}

        {item.missing.facial_hair && (
          <>
            <Text style={styles.label}>Vello facial:</Text>
            <Text style={styles.text}>{item.missing.facial_hair}</Text>
          </>
        )}

        {item.missing.eye_colour && (
          <>
            <Text style={styles.label}>Color de ojos:</Text>
            <Text style={styles.text}>{item.missing.eye_colour}</Text>
          </>
        )}

        {item.missing.physical_constitution && (
          <>
            <Text style={styles.label}>Constitución física:</Text>
            <Text style={styles.text}>{item.missing.physical_constitution}</Text>
          </>
        )}

        {item.missing.description && (
          <>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.text}>{item.missing.description}</Text>
          </>
        )}

        {item.missing.information && (
          <>
            <Text style={styles.label}>Información extra:</Text>
            <Text style={styles.text}>{item.missing.information}</Text>
          </>
        )}

        {item.group_name && (
          <>
            <Text style={styles.label}>Grupo encargado:</Text>
            <Text style={styles.text}>{item.group_name}</Text>
          </>
        )}

        {/* CONTACTO */}
        <Text style={styles.label}>Contacto:</Text>

        {item.group_phone && (
          <Text style={styles.text}>Teléfono: {item.group_phone}</Text>
        )}

        {item.group_email && (
          <Text style={styles.text}>Correo: {item.group_email}</Text>
        )}

        {/* BOTÓN COMPARTIR */}
        <TouchableOpacity 
          style={[styles.button2, { backgroundColor: '#1976d2' }]} 
          onPress={onShare}
        >
          <Text style={styles.buttonText}>Compartir en redes sociales</Text>
        </TouchableOpacity>

        {/* MENSAJE */}
        <Text style={styles.subtitle}>Contactar responsables:</Text>

        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => alert(`Mensaje enviado: ${message}`)}
        >
          <Text style={styles.buttonText}>Enviar mensaje</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 80,
    flexGrow: 1, // 🔥 IMPORTANTE PARA QUE EL SCROLL BAJE EN MÓVIL
  },

  image: {
    width: "40%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 16,
    alignSelf: "center",
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    paddingLeft: 10,
  },

  text: {
    fontSize: 14,
    paddingLeft: 10,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },

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

  button2: {
    marginTop: 12,
    backgroundColor: 'rgb(129, 173, 198)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
  },

  tagContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },

  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
