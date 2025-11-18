import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// Caso de ejemplo que se mostrará si no hay usuario real
const demoCase = {
  id: 'demo',
  first_name: 'Ejemplo: Naiara',
  last_name: 'Rodríguez',
  email: 'nairodgom@alum.us.es',
  phone: '000000000',
  role: 'Miembro del Grupo',
  institution_code: 'US',
  location: 'Burgos',
  verified: true,
  searches: 12
}

export default function PerfilScreen () {
  return (
    <View style={styles.container}>
      {/* Imagen de perfil */}
      <Image
        source={{ uri: 'https://copilot.microsoft.com/th/id/BCO.da83c73a-9926-4192-a9bf-3d7e2aea0f3e.png' }}
        style={styles.avatar}
      />

      {/* Nombre */}
      <Text style={styles.name}>
        {demoCase.first_name} {demoCase.last_name}
      </Text>

      {/* Búsquedas */}
      <Text style={styles.searches}>
        {demoCase.searches} búsquedas
      </Text>

      <View style={styles.row}>
        <Ionicons name="mail-outline" size={20} color="#555" />
        <Text style={styles.info}>{demoCase.email}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="call-outline" size={20} color="#555" />
        <Text style={styles.info}>{demoCase.phone}</Text>
      </View>

      {/* Tarjeta de información */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={20} color="#555" />
          <Text style={styles.info}>{demoCase.location}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="business-outline" size={20} color="#555" />
          <Text style={styles.info}>Institución: {demoCase.institution_code}</Text>
        </View>
        
        <View style={styles.row}>
          <Ionicons name="person-outline" size={20} color="#555" />
          <Text style={styles.info}>{demoCase.role}</Text>
        </View>

      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() =>{}}>
            <Text style={styles.buttonText}>Formularios</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.button2} onPress={() =>{}}>
            <Text style={styles.buttonText}>Modificar Datos</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderColor: '#666',
    borderWidth: 2, 
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  searches: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  info: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333'
  },
  button: {
    marginTop: 12,
    backgroundColor: 'rgba(105, 29, 37, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  button2: {
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
})