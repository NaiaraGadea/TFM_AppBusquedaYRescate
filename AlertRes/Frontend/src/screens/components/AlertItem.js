import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CaseItem from './CaseItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AlertItem({ alert }) {
  const navigation = useNavigation()
  return (
    <View style={styles.card}>
      {/* Header de alerta */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="alert-circle" size={22} color="#fff" />
        <Text style={styles.headerText}>ALERTA</Text>
      </View>

      {/* Caso asociado */}
      <CaseItem 
      item={alert} 
      onContact={(c) => navigation.navigate('casoPublico', { alert: c })}
      />

      {/* Mensaje */}
      <View style={styles.body}>
        <Text style={styles.message}>{alert.message}</Text>
        <Text style={styles.type}>Tipo: {alert.alert_type}</Text>
        <Text style={styles.small}>
          Recibes la alerta porque estás en la zona de envío o alcance.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: 400,       // 👈 límite de ancho
    maxHeight: '60%',
    alignSelf: 'center', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f', // rojo alerta
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  body: {
    padding: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  type: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 4,
  },
  small: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
