// src/screens/search/PantallaBusqueda.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Pantalla donde se muestra la información de la búsqueda seleccionada.

NOTA: se ha intentado implementar el mapa pero no ha sido posible que funcione correctamente.
*/

// Importaciones
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
// import MapView, { Marker } from 'react-native-maps'; // No funciona
import { Ionicons } from '@expo/vector-icons';
import { SearchContext } from '../../../App';

// MAPA UNIVERSAL (funciona en Expo Go, Android, iOS y Web)
//import MapView, { Marker } from "react-native-web-maps"; // Tampoco funciona
import { WebView } from 'react-native-webview';

// Exportación
export default function PantallaBusqueda({ route, navigation }) {
  //const { activeSearch, setActiveSearch } = useContext(SearchContext);
  const { item } = route.params || {};
  const [showRecs, setShowRecs] = React.useState(false);
 
  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={60} color="#888" style={{ marginBottom: 15 }} />
        <Text style={styles.emptyTitle}>Sin búsquedas activas</Text>
        <Text style={styles.emptySubtitle}>
          Actualmente no estás participando en ninguna búsqueda.
        </Text>
      </View>
    );
  }

  // Coordenadas (si no hay, usar Madrid)
  const lat = item.latitude || 40.4168;
  const lng = item.longitude || -3.7038;

  // URL del mapa con marcador
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  // Vista de la pantalla
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Título */}
        <Text style={styles.title}>Búsqueda #{item.search_id} - {item.person.first_name} {item.person.last_name}</Text>

        {/* Info del desaparecido */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Info del desaparecido</Text>
          <Text style={styles.name}>{item.person.first_name} {item.person.last_name}</Text>
          <Text style={styles.text}>Edad actual: {item.person.age || 'Desconocida'} años</Text>
          {item.missing.height ? <Text style={styles.text}>Altura: {item.missing.height} m</Text> : null}
          {item.missing.weight ? <Text style={styles.text}>Peso: {item.missing.weight} kg</Text> : null}
          {item.missing.hair ? <Text style={styles.text}>Pelo: {item.missing.hair}</Text> : null}
          {item.missing.facial_hair ? <Text style={styles.text}>Vello facial: {item.missing.facial_hair}</Text> : null}
          {item.missing.eye_colour ? <Text style={styles.text}>Color de ojos: {item.missing.eye_colour}</Text> : null}
          {item.missing.physical_constitution ? <Text style={styles.text}>Constitución física: {item.missing.physical_constitution}</Text> : null}
          {item.missing.description ? <Text style={styles.text}>Descripción: {item.missing.description}</Text> : null}
          {item.missing.information ? <Text style={styles.text}>Información extra: {item.missing.information}</Text> : null}

          <Text style={styles.label}>Caso asociado:</Text>
          <Text style={styles.value}>{item.case_id}</Text>
          <Text style={styles.label}>Información:</Text>
          <Text style={styles.value}>{item.message}</Text>
        </View>

        {/* Mapa - NO FUNCIONA*/}
        {/*<View style={styles.card}>
          <Text style={styles.sectionTitle}>Mapa</Text>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: item.latitude || 40.4168,
              longitude: item.longitude || -3.7038,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {item.latitude && item.longitude && (
              <Marker
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title="Punto de encuentro"
              />
            )}
          </MapView>
        </View>*/}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mapa</Text>

          <WebView
            style={styles.map}
            source={{ uri: mapUrl }}
          />
        </View>


        {/* Detalles */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalles de la búsqueda</Text>
          <Text style={styles.label}>Fecha y hora prevista:</Text>
          <Text style={styles.value}>{item.meeting_date}</Text>
          <Text style={styles.label}>Lugar de encuentro:</Text>
          <Text style={styles.value}>{item.meeting_point}</Text>
          <Text style={styles.label}>Grupo organizador:</Text>
          <Text style={styles.value}>
            {item.creatorGroup?.group_name || "Grupo desconocido"}
          </Text>
        </View>

        {/* Botón de recomendaciones */}
        <TouchableOpacity style={styles.infoButton} onPress={() => setShowRecs(true)}>
          <Ionicons name="information-circle-outline" size={20} color="#1976d2" />
          <Text style={styles.infoText}>Recomendaciones</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Botón salir */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Salir de la búsqueda</Text>
      </TouchableOpacity>

      {/* Modal recomendaciones */}
      <Modal visible={showRecs} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Recomendaciones</Text>
            <Text style={styles.value}>{item.recommendations}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowRecs(false)}>
              <Text style={{ color: '#fff' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilo de la pantalla
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', margin: 16, color: '#333' },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#444' },
  label: { fontWeight: '600', marginTop: 6, color: '#555' },
  value: { color: '#222', marginBottom: 4 },
  map: { height: 180, borderRadius: 8, marginTop: 8 },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
  },
  infoText: { marginLeft: 8, color: '#1976d2', fontWeight: '600' },
  exitButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#d32f2f',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9'
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  image: {
    width: '25%',
    height: undefined,
    aspectRatio: 2 / 3, // mantiene proporción en móvil y web
    borderRadius: 8,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  //map:{width:'80%', height: '80%' }
});
