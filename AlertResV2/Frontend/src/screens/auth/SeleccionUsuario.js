// src/screens/auth/SeleccionUsuario.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: pantalla de inicio de sesión de la app. Desde aquí se selecciona el usuario con el que se quiere entrar.
*/
// Importaciones
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUsers, getPeople, getPersonById, getGroupByPersonID } from '../../../api'; 
import { UserContext } from '../../../App'; // Para guardar qué usuario se ha loggeado

// Exportación
export default function SeleccionUsuario({ navigation }) {
  const [users, setUsers] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser } = useContext(UserContext);


  useEffect(() => {
    loadUsers();
  }, []);

  // Función para cargar los usuarios actuales registrados en la aplicación. Se utilizará en el Picker.
  async function loadUsers() {
    try {
      setLoading(true);
      const usersData = await getUsers(); // devuelve array de users
      console.log("USERS DATA:", usersData);

      // Obtener persona asociada a cada usuario usando getPeople(person_id)
      const peoplePromises = usersData.map(u =>
        getPeople(1)
          .then(() => null)
          .catch(() => null)
      );

      // Lista de personas
      const peopleById = await Promise.all(
        usersData.map(async (u) => {
          try {
            const p = await getPeople();
            if (Array.isArray(p)) {
              return p.find(x => x.person_id === u.person_id) || null;
            }
            return null;
          } catch {
            return null;
          }
        })
      );

      const merged = usersData.map((u, i) => {
        const p = peopleById[i];
        const name = p ? `${p.first_name || ''} ${p.last_name || ''}`.trim() : 'Sin nombre';
        const key = `${u.user_id}-${name}-${u.rol}`;
        return { ...u, person_id: u.person_id, group_id: u.group_id || null, personName: name, key };
      });

      setUsers(merged);
      if (merged.length) setSelectedKey(merged[0].key);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }

  // Función que se ejecuta al presionar el botón de 'Entrar con usuario seleccionado' 
  async function handleSelect() {
    if (!selectedKey) {
      Alert.alert('Selecciona un usuario');
      return;
    }
    const sel = users.find(u => u.key === selectedKey);
    if (!sel) return;
    
    let group_id = null;
    const groupData = await getGroupByPersonID(sel.person_id);
    group_id = groupData?.group_id || null;

    // Guardamos el usuario seleccionado:
    setCurrentUser({user_id: sel.user_id, person_id: sel.person_id, group_id, rol: sel.rol}); 

    if (sel.rol === 'volunteer') navigation.navigate('TabsVoluntarios');
    else if (sel.rol === 'group_member') navigation.navigate('TabsMiembros');
    else if (sel.rol === 'group') navigation.navigate('TabsGrupos');
    else Alert.alert('Rol desconocido', `Rol: ${sel.rol}`);
  }

  // Vista de la interfaz de la pantalla
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/logoAlertRes.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Seleccione su usuario:</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={selectedKey}
              onValueChange={(itemValue) => setSelectedKey(itemValue)}
              style={styles.picker}
            >
              {users.map(u => (
                <Picker.Item
                  key={u.key}
                  label={`${u.user_id} - ${u.personName} - ${u.rol}`}
                  value={u.key}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSelect}>
            <Text style={styles.text}>Entrar con usuario seleccionado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondary]}
            onPress={() => navigation.navigate('CreateUser')}
          >
            <Text style={styles.text}>Crear nuevo usuario</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#333' },
  title: { fontSize: 22, marginBottom: 20, color: '#fff' },
  pickerWrap: { width: '100%', backgroundColor: '#fff', borderRadius: 8, marginBottom: 16 },
  picker: { width: '100%' },
  button: { backgroundColor: '#c0c0c0', padding: 14, width: 300, borderRadius: 10, marginVertical: 8 },
  secondary: { backgroundColor: '#81ADC6' },
  text: { color: 'black', textAlign: 'center', fontSize: 16 },
  image: {
    width: '50%',
    height: 180,
    marginBottom: 20,
  },

});
