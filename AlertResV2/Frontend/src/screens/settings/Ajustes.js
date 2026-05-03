// src/screens/createSearch/menuProfesionales.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // para iconos sutiles

export default function CrearMenuScreen({ navigation }) {
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.firstButton} onPress={() => { /* de momento no nada */ }}>
        <Text style={styles.buttonText}>{"Tutorial"}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>

      <View style={styles.button}>
        <Text style={styles.buttonText}>Notificaciones</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ true: "rgb(129, 173, 198)" , false:"rgb(239,239,239)"}}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => { /* de momento no hace nada */ }}>
        <Text style={styles.buttonText}>{"Cuenta"}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => { /* de momento no hace nada */ }}>
        <Text style={styles.buttonText}>{"Privacidad"}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => { /* de momento no hace nada */ }}>
        <Text style={styles.buttonText}>{"Ayuda"}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => { navigation.replace('SeleccionUsuario') }}>
        <Text style={styles.logoutText}>{"Cerrar Sesión"}</Text>
        <Ionicons name="log-out-outline" size={30} color="rgb(172, 11, 27)" />
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
  },


  button: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  paddingHorizontal: 40,
  paddingVertical: 30,
  width: '100%',
  borderBottomWidth: 1,
  borderColor: '#ccc',
},


firstButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  paddingVertical: 30,
  paddingHorizontal: 40,
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
},

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    alignSelf: 'center'
    
  },
  logoutButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  paddingHorizontal: 40,
  paddingVertical: 30,
  width: '100%',
  borderBottomWidth: 1,
  borderColor: '#ccc',
},

logoutText: {
  fontSize: 16,
  fontWeight: '600',
  color: 'rgb(172, 11, 27)', // 👈 rojo para diferenciar
  alignSelf: 'center',
},
});
