// src/screens/createSearch/menuProfesionales.js
// FUERA
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // para iconos sutiles

export default function CrearMenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nombre del Grupo</Text>

      <TouchableOpacity style={styles.firstButton} onPress={() => navigation.navigate('RegistrarCaso')}>
        <Ionicons name={"add-circle-outline"} size={22} color="rgb(172, 11, 27)" style={styles.icon} />
        <Text style={styles.buttonText}>{"Registrar caso"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Ionicons name={"search-outline"} size={22} color="rgb(25, 104, 133)" style={styles.icon} />
        <Text style={styles.buttonText}>{"Gestionar búsquedas"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CasosActivos')}>
        <Ionicons name={"folder-open-outline"} size={22} color="rgb(25, 104, 133)" style={styles.icon} />
        <Text style={styles.buttonText}>{"Casos activos"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HistorialCasos')}>
        <Ionicons name={"time-outline"} size={22} color="rgb(25, 104, 133)" style={styles.icon} />
        <Text style={styles.buttonText}>{"Historial de casos"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => { /* de momento no hace nada */ }}>
        <Ionicons name={"people-outline"} size={22} color="rgb(25, 104, 133)" style={styles.icon} />
        <Text style={styles.buttonText}>{"Equipo"}</Text>
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    marginTop:24,
    textAlign: 'center',
    color: '#111827',
    
  },

  button: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  paddingVertical: 20,
  width: '100%',
  borderBottomWidth: 1,
  borderColor: '#ccc',
},
firstButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  paddingVertical: 20,
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
},
  icon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    alignSelf: 'center'
  },
});

