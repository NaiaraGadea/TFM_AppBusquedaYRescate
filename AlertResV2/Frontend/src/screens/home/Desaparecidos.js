import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../../App';

// IMPORTACIONES API
import { 
  getPublicAlerts,
  getCaseByCaseId,
  getMissingPersonById,
  getPersonById,
  getGroupById
} from '../../../api';

import CaseItem from '../components/CaseItem';

// Caso de ejemplo que se mostrará si no hay ninguna desaparición.
const demoCase = {
  case_id: 'demo',
  missing: {
    photo_url: 'https://tse4.mm.bing.net/th/id/OIP.awAiMS1BCAQ2xS2lcdXGlwHaHH?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
    height: 1.78,
    weight: 80,
    hair: 'corto y marrón',
    facial_hair: 'barba',
    eye_color: 'marrón',
    physical_constitution: 'delgado',
    description: 'Persona de ejemplo para mostrar el formato.',
    information: 'Información adicional de ejemplo.',
  },
  person: {
    first_name: 'Ejemplo: Juan',
    last_name: 'Pérez',
    age: 35,
  },
  last_seen_point: 'Sevilla, España',
  group_name: 'Policía Nacional',
  group_phone: '091',
};

export default function listaDesaparecidos() {
  const navigation = useNavigation();
  const { currentUser } = useContext(UserContext);

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar alertas públicas + del grupo y reconstruir cada caso
  const load = async () => {
    if (!currentUser) return; // seguridad

    setLoading(true);
    try {
      // 1. Obtener alertas públicas + del grupo
      const alerts = await getPublicAlerts(currentUser.group_id ?? 0);

      // 2. Enriquecer cada alerta con datos del caso, missing, person y grupo
      const enriched = await Promise.all(
        alerts.map(async (alert) => {
          const caso = await getCaseByCaseId(alert.case_id);
          if (!caso) return null;

          const missing = await getMissingPersonById(caso.missing_id);
          if (!missing) return null;

          const person = await getPersonById(missing.person_id);
          if (!person) return null;

          const group = await getGroupById(caso.created_by);

          return {
            ...caso,
            alert,
            missing,
            person,
            group_name: group?.group_name || "Desconocido",
            group_phone: group?.group_phone || "",
          };
        })
      );

      setCases(enriched.filter(Boolean));

    } finally {
      setLoading(false);
    }
  };

  // Cargar datos cuando haya currentUser
  useEffect(() => {
    if (currentUser) load();
  }, [currentUser]);

  // Polling cada 30s (opcional)
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      load();
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [currentUser]);

  // Detectar si es web o móvil
  const isWeb = Dimensions.get('window').width > 768;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Los has visto?</Text>
      {loading && <Text>Cargando...</Text>}

      <FlatList
        key={isWeb ? 'web' : 'mobile'}
        data={cases.length > 0 ? cases : [demoCase]}
        keyExtractor={(item) => String(item.case_id)}
        renderItem={({ item }) => (
          <CaseItem
            item={item}
            onContact={(c) => navigation.navigate('casoPublico', { item: c })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        numColumns={isWeb ? 4 : 1}
        columnWrapperStyle={isWeb ? styles.columnWrapper : null}
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
