// Frontend/src/screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, RefreshControl } from 'react-native';
import { getCases } from '../api';
import CaseItem from '../components/CaseItem';

// Caso de ejemplo que se mostrará sin no hay ninguna desaparición.
const demoCase = {
  id: 'demo',
  full_name: 'Ejemplo: Juan Pérez',
  age: 35,
  description: 'Persona de ejemplo para mostrar el formato.',
  photo_url: 'https://tse4.mm.bing.net/th/id/OIP.awAiMS1BCAQ2xS2lcdXGlwHaHH?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
  last_seen_location: 'Sevilla, España',
};


export default function HomeScreen({ navigation }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setCases(await getCases()); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

   return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Button title="Registrar caso" onPress={() => navigation.navigate('RegisterCase')} />
        <Button title="Alertas" onPress={() => navigation.navigate('Alerts')} />
      </View>
      {loading && <Text>Cargando...</Text>}
      <FlatList
        data={cases.length > 0 ? cases : [demoCase]}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CaseItem
            item={item}
            onContact={(c) => alert(`Contactar sobre ${c.full_name}`)}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}