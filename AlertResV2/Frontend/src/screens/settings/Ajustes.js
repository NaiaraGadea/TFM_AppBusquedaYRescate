// src/screens/settings/Ajustes.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Pantalla de ajustes de diferentes parámetros e información de AlertRes. Desde aquí se podrá cerrar sesión.
*/

// Importaciones
import React,{ useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // para iconos sutiles

// Exportación
export default function Ajustes({ navigation }) {
  const [notifications, setNotifications] = React.useState(true);
  // Para el modal de contacto
  const [showAddModal, setShowAddModal] = useState(false);

  // Vista de la pantalla
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

      <TouchableOpacity style={styles.button} onPress={() => setShowAddModal(true)}>
        <Text style={styles.buttonText}>{"Contacto"}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => { navigation.replace('SeleccionUsuario') }}>
        <Text style={styles.logoutText}>{"Cerrar Sesión"}</Text>
        <Ionicons name="log-out-outline" size={30} color="rgb(172, 11, 27)" />
      </TouchableOpacity>

      {/** Vista del modal de contacto con los responsables de AlertRes */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Contacto</Text>
            </View>

            <Text style={{ fontSize: 16, marginBottom: 20 }}>
              nairodgom@alum.us.es
            </Text>

            <TouchableOpacity style= {styles.modalButton} onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

// Estilo de la pantalla
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
  modalOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  modalHeader: {
    /*
    width: "100%",
    backgroundColor: "#c0d8ea", // gris-azulado institucional
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 15,*/
    backgroundColor: "#7F7F7F", // tu azul-gris
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeaderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  modalButton:{marginTop: 10,
    backgroundColor: "#9eb9cd",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, 
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
