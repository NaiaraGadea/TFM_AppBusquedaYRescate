import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getCasesWithAlerts } from '../../../api';
import CaseItem from '../../../components/CaseItem';

// Caso de ejemplo que se mostrará si no hay ninguna desaparición.
const demoCase = {
  id: 'demo',
  full_name: 'Ejemplo: Juan Pérez',
  age: 35,
  description: 'Persona de ejemplo para mostrar el formato.',
  information: 'Información adicional de ejemplo.',
  photo_url: 'https://tse4.mm.bing.net/th/id/OIP.awAiMS1BCAQ2xS2lcdXGlwHaHH?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
  last_seen_location: 'Sevilla, España',
};

export default function listaDesaparecidos() {
  const navigation = useNavigation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
  setLoading(true);
  try {
    const data = await getCasesWithAlerts();
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
});
