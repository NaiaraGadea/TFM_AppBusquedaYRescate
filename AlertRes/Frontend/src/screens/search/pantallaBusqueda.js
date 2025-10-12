// src/screens/search/pantallaBusqueda
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchContext } from '../../../App';

export default function PantallaBusqueda() {
  const { activeSearch, setActiveSearch } = useContext(SearchContext);

  if (!activeSearch) {
    return (
      <View style={styles.center}>
        <Text>Actualmente no estás participando en ninguna búsqueda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Búsqueda #{activeSearch.id}</Text>
      <Text style={styles.label}>Alerta asociada:</Text>
      <Text>{activeSearch.case_id}</Text>

      <Text style={styles.label}>Fecha y hora prevista:</Text>
      <Text>{activeSearch.meeting_date}</Text>

      <Text style={styles.label}>Localización central:</Text>
      <Text>{activeSearch.meeting_place}</Text>

      <Text style={styles.label}>Información:</Text>
      <Text>{activeSearch.message}</Text>

      <Text style={styles.label}>Recomendaciones:</Text>
      <Text>{activeSearch.recommendations}</Text>

      {/* Botón para salir de la búsqueda */}
      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => setActiveSearch(null)}
      >
        <Text style={{ color: '#fff' }}>Salir de la búsqueda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  label: { fontWeight: '600', marginTop: 8 },
  exitButton: {
    marginTop: 20,
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
});
