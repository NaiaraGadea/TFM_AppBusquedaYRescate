
// Frontend/src/components/CaseItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
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
export default function CaseItem({ item, onContact }) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row' , alignSelf: 'flex-end' }}>
      <InfoTag text={item.case_status ? "Activo" : "Activo"} backgroundColor="#27ae60" />
      <InfoTag text={item.alert_type ? "Público" : "Público"} backgroundColor="#188fff" />
      </View>
      {item.photo_url ? (
        <Image source={{ uri: item.photo_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}  
      <Text style={styles.name}>{item.full_name || 'Nombre'} {item.last_name|| 'Apellidos'}</Text>
      {item.age != null && <Text style={styles.text}>Edad actual: {item.age}</Text>}
      {item.last_seen_point && (
        <Text style={styles.text}>Lugar: {item.last_seen_point}</Text>
      )}
      {(item.height || item.weight) && (
        <Text style={styles.text}>
          {item.height && `Altura: ${item.height} m`}
          {item.height && item.weight && '   |   '}
          {item.weight && `Peso: ${item.weight} kg`}
        </Text>
      )}
      {item.physical_constitution && (
        <Text style={styles.text}>Constitución física: {item.physical_constitution}</Text>
      )}
      {item.group_name && (
        <Text style={styles.text}>Grupo encargado: {item.group_name}</Text>
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
  tagContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
