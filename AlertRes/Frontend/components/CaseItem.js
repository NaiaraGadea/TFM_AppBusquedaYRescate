
// Frontend/src/components/CaseItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CaseItem({ item, onContact }) {
  return (
    <View style={styles.card}>
      {item.photo_url ? (
        <Image source={{ uri: item.photo_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <Text style={styles.name}>{item.full_name || 'Nombre Apellido'}</Text>
      {item.age != null && <Text style={styles.text}>Edad: {item.age}</Text>}
      {item.last_seen_location && (
        <Text style={styles.text}>Lugar: {item.last_seen_location}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => onContact?.(item)}>
        <Text style={styles.buttonText}>CONTACTAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    flex: 1,          // importante para que se adapte en grid
    maxWidth: 350,    // límite de ancho en web
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
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
