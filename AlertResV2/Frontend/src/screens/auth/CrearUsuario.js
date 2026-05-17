// src/screens/auth/CrearUsuario.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DatePickerInput } from 'react-native-paper-dates';

import { createPerson, createGroup, createUser, createGroupMember } from '../../../api'; // funciones exportadas en tu api.js
import { UserContext } from '../../../App'; // Para guardar qué usuario se ha loggeado


export default function CreateUser({ navigation }) {
  const { setCurrentUser } = useContext(UserContext);

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [rol, setRol] = useState('volunteer'); // volunteer | group | group_member
  const [dni, setDNI] = useState('');
  const [birth_date,setBirthDate] = useState(null);
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email,setEmail] = useState('');
  const [group_name, setGroupName] = useState('');
  const [base_address, setBaseAddress] = useState('');
  const [group_email, setGroupEmail] = useState('');
  const [group_phone, setGroupPhone] = useState('');
  const [group_type, setGroupType] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para calcular la edad
  function calcAge(date) {
    const diff = Date.now() - date.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }


  async function handleCreate() {
    if (!first_name || !last_name || !dni) {
      Alert.alert('Faltan datos', 'Rellena nombre, apellidos y dni.');
      return;
    }

    const formattedBirthDate = birth_date
      ? birth_date.toISOString().split("T")[0]
      : null;

    try {
      setLoading(true);

      // 1) Crear persona
      const personData = await createPerson({ first_name, last_name, dni, 
        birth_date:formattedBirthDate, age: Number(age), phone, email });

      const person_id = personData.person_id;
      if (!person_id) throw new Error('person_id no devuelto por createPerson');

      let group_id = null;

      // 2) Si rol === 'group' crear grupo
      if (rol === 'group') {
        if (!group_name) {
          Alert.alert('Faltan datos', 'Rellena el nombre del grupo');
          setLoading(false);
          return;
        }
        const groupData = await createGroup({ group_name, base_address, group_email, group_phone, group_type });
        group_id = groupData.group_id;
        await createGroupMember({
          group_id,
          person_id,
          role_in_group: "Jefatura",
          joined_date: new Date().toISOString().split("T")[0] // opcional
        });

      }

      // 3) Crear usuario
      //await createUser({ person_id, rol, search_count: 0});
      // 3) Crear usuario
      const userData = await createUser({ person_id, rol, search_count: 0 });

      // userData.user_id debe existir. Si no, habría que buscarlo.
      setCurrentUser({
        user_id: userData.user_id,
        person_id: person_id,
        group_id,
        rol: rol
      });


      Alert.alert('Usuario creado', 'Usuario creado correctamente');

      if (rol === 'volunteer') navigation.replace('TabsVoluntarios');
      //else if (rol === 'group_member') navigation.replace('TabsMiembros'); // solo será posible ser parte de un grupo si desde el grupo se actualiza el rol.
      else if (rol === 'group') navigation.replace('TabsGrupos');
      else navigation.replace('SeleccionUsuario');

    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear nuevo usuario</Text>

      <TextInput placeholder="Nombre" style={styles.input} value={first_name} onChangeText={setFirstName} />
      <TextInput placeholder="Apellidos" style={styles.input} value={last_name} onChangeText={setLastName} />
      <TextInput placeholder="DNI" style={styles.input} value={dni} onChangeText={setDNI} />
      <Text style={{ marginTop: 8 }}>Fecha de Nacimiento</Text>

        <DatePickerInput
          locale="es"
          label="Fecha de nacimiento"
          value={birth_date}
          onChange={(d) => {
            setBirthDate(d);
            setAge(calcAge(d));
          }}
          inputMode="start"
        />


      {/* EDAD (AUTOMÁTICA) */}
      <Text style={{ marginTop: 8 }}>Edad</Text>
      <TextInput style={styles.input} value={String(age)} editable={false}/>

      <TextInput placeholder="Teléfono" style={styles.input} value={phone} onChangeText={setPhone} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={{ marginTop: 8 }}>Rol</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={rol} onValueChange={setRol}>
          <Picker.Item label="Voluntario" value="volunteer" />
          <Picker.Item label="Grupo" value="group" />
        </Picker>
      </View>

      {rol === 'group' && (
        <View>
        <TextInput placeholder="Nombre del grupo" style={styles.input} value={group_name} onChangeText={setGroupName} />
        <TextInput placeholder="Dirección de la base del grupo" style={styles.input} value={base_address} onChangeText={setBaseAddress} />
        <TextInput placeholder="Email del grupo" style={styles.input} value={group_email} onChangeText={setGroupEmail} />
        <TextInput placeholder="Teléfono del grupo" style={styles.input} value={group_phone} onChangeText={setGroupPhone} />
        <TextInput placeholder="Descripción y tipo de grupo" style={styles.input} value={group_type} onChangeText={setGroupType} />
        </View>
      )}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Crear y entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingBottom: 50},
  title: { fontSize: 20, marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginVertical: 8 },
  pickerWrap: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginVertical: 8 },
  button: { backgroundColor: '#333', padding: 14, borderRadius: 8, marginTop: 12 },
  secondary: { backgroundColor: '#666' },
  buttonText: { color: '#fff', textAlign: 'center' }
});
