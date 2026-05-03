import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getCasesWithAlerts } from '../../../api';
import CaseItem from '../components/CaseItem';

// Caso de ejemplo que se mostrará si no hay ninguna desaparición.
const demoCase = {
  id: 'demo',
  full_name: 'Ejemplo: Juan Pérez',
  first_name: 'Ejemplo: Juan',
  last_name:'Pérez',
  age: 35,
  height: 1.78,
  weight: 80,
  hair: 'corto y marrón',
  facial_hair: 'barba',
  eye_color: 'marrón',
  physical_constitution: 'delgado',
  description: 'Persona de ejemplo para mostrar el formato.',
  information: 'Información adicional de ejemplo.',
  photo_url: 'https://tse4.mm.bing.net/th/id/OIP.awAiMS1BCAQ2xS2lcdXGlwHaHH?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
  last_seen_location: 'Sevilla, España',
  last_seen_point: 'Sevilla, España',
  desappearance_date: '21/03/2026',
  group_name: 'Policía Nacional',
  group_phone: '091',
};

export default function listaDesaparecidos() {
  const navigation = useNavigation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
  setLoading(true);
  try {
    const data = await getCasesWithPublicAlerts();
    console.log("Casos con alertas:", data);
    setCases(data);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  // Detectar si es web o móvil
  const isWeb = Dimensions.get('window').width > 768; // Cambia el umbral según tus necesidades

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Los has visto?</Text>
      {loading && <Text>Cargando...</Text>}
      <FlatList
        data={cases.length > 0 ? cases : [demoCase]}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CaseItem
            item={item}
            onContact={(c) => navigation.navigate('casoPublico', { item: c })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        numColumns={isWeb ? 4 : 1} // Cambia a 3 columnas en web, 1 en móvil
        columnWrapperStyle={isWeb ? styles.columnWrapper : null} // Opcional para espaciar columnas
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 60,
    backgroundColor: '#eaedf1',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
