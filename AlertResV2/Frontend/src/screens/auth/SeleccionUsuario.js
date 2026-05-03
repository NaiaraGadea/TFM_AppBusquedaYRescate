// src/screens/auth/SeleccionUsuario.js
/*
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function SeleccionUsuario({navigation}){
    return (
        <View style = {styles.containger}>
            <Text style = {styles.title}>Seleccione su tipo de usuario:</Text>

            <TouchableOpacity style = {styles.button}
            onPress={()=>navigation.replace("TabsVoluntarios")}>
                <Text style = {styles.text}>Voluntario</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {styles.button}
            onPress={()=>navigation.replace("TabsMiembros")}>
                <Text style = {styles.text}>Miembro de grupo</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {styles.button}
            onPress={()=>navigation.replace("TabsGrupos")}>
                <Text style = {styles.text}>Grupo</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex:1, justifyContent:'center', alignItems: 'center'},
    title: {fontSize:28, marginBotton: 40},
    button: {backgroundColor:'#333', padding:15, width:250, borderRadius:10, marginVertical:10},
    text: {color: 'white', textAlign:'center', fontSize:18}

});
*/

// src/screens/auth/SeleccionUsuario.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUsers, getPeople, getPersonById, getGroupByPersonID } from '../../../api'; // funciones exportadas en tu api.js
import { UserContext } from '../../../App'; // Para guardar qué usuario se ha loggeado

export default function SeleccionUsuario({ navigation }) {
  const [users, setUsers] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser } = useContext(UserContext);


  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const usersData = await getUsers(); // devuelve array de users
      console.log("USERS DATA:", usersData);

      // Obtener persona asociada a cada usuario usando getPeople(person_id)
      const peoplePromises = usersData.map(u =>
        getPeople(1) // fallback: si tu getPeople solo soporta limit, se puede usar getPeople() y filtrar; aquí asumimos getPeople/:id no existe
          .then(() => null)
          .catch(() => null)
      );

      // Si tu api.js no tiene getPeople(id) sino getPeople(limit),
      // en la siguiente sección se intentará obtener la persona por separado.
      // Para evitar múltiples llamadas innecesarias, intentamos usar getPeople por id si existe:
      const peopleById = await Promise.all(
        usersData.map(async (u) => {
          try {
            const p = await getPeople(); // si getPeople(limit) devuelve lista, filtramos
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

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, marginBottom: 20 },
  pickerWrap: { width: '100%', backgroundColor: '#fff', borderRadius: 8, marginBottom: 16 },
  picker: { width: '100%' },
  button: { backgroundColor: '#333', padding: 14, width: 300, borderRadius: 10, marginVertical: 8 },
  secondary: { backgroundColor: '#555' },
  text: { color: 'white', textAlign: 'center', fontSize: 16 }
});
