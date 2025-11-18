// Frontend/src/screens/RegisterCaseScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Switch, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createDesaparecido } from '../../../api';

export default function RegisterCaseScreen({ navigation }) {
  // Campos mínimos (lista de inicio)
  const [description, setDescription] = useState('');
  const [photo_url, setPhotoUrl] = useState('');
  const [last_seen_location, setLocation] = useState('');

  // Campos detallados
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [date_of_birth, setDob] = useState('');           // YYYY-MM-DD
  const [sex, setSex] = useState('');                     // male | female | other
  const [nationality, setNationality] = useState('');
  const [habitual_address, setHabitualAddress] = useState('');
  const [disappearance_date, setDisappearanceDate] = useState(''); // YYYY-MM-DD
  const [disappearance_place, setDisappearancePlace] = useState('');
  const [disappearance_reason, setDisappearanceReason] = useState('');
  const [disorders_diseases, setDisordersDiseases] = useState('');
  const [disability, setDisability] = useState('');
  const [treatment, setTreatment] = useState('');
  const [addictions, setAddictions] = useState('');
  const [gender_violence, setGenderViolence] = useState(false);
  const [recurrence, setRecurrence] = useState('unknown'); // yes | no | unknown
  const [status, setStatus] = useState('active');          // active | found | closed

  const submit = async () => {
    if (!first_name || !last_name) {
      return Alert.alert('Faltan nombre y apellidos');
    }
    try {
      await createDesaparecido({
        // bloque mínimo (para /cases)
        description,
        photo_url,
        last_seen_location,
        status,

        // bloque detallado (para /desaparecidos)
        first_name,
        last_name,
        date_of_birth: date_of_birth || null,
        sex: sex || null,
        nationality,
        habitual_address,
        disappearance_date: disappearance_date || null,
        disappearance_place,
        disappearance_reason,
        description, 
        disorders_diseases,
        disability,
        treatment,
        addictions,
        gender_violence: !!gender_violence,
        recurrence
      });

      Alert.alert('Caso registrado');
      navigation.navigate('Inicio');
    } catch (e) {
      Alert.alert('Error registrando caso', e?.message || 'Intenta de nuevo');
    }
  };


  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : 'height'}>
  
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Campos mínimos */}
      {/* Campos detallados */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={first_name}
          onChangeText={setFirstName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          value={last_name}
          onChangeText={setLastName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fecha de nacimiento (YYYY-MM-DD)</Text>
        <TextInput
          value={date_of_birth}
          onChangeText={setDob}
          style={styles.input}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Sexo</Text>
        <Picker selectedValue={sex} onValueChange={setSex} 
          style={Platform.OS === "web" ? undefined :{ height: 70, width: '50%' }}>
          <Picker.Item label="Selecciona..." value="" />
          <Picker.Item label="Hombre" value="male" />
          <Picker.Item label="Mujer" value="female" />
          <Picker.Item label="Otro" value="other" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nacionalidad</Text>
        <TextInput
          value={nationality}
          onChangeText={setNationality}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>URL de foto</Text>
        <TextInput
          value={photo_url}
          onChangeText={setPhotoUrl}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fecha de desaparición (YYYY-MM-DD)</Text>
        <TextInput
          value={disappearance_date}
          onChangeText={setDisappearanceDate}
          style={styles.input}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Última localización</Text>
        <TextInput
          value={last_seen_location}
          onChangeText={setLocation}
          style={styles.input}
        />
      </View>

      
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Domicilio habitual</Text>
        <TextInput
          value={habitual_address}
          onChangeText={setHabitualAddress}
          style={styles.input}
        />
      </View>

      

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Lugar de desaparición</Text>
        <TextInput
          value={disappearance_place}
          onChangeText={setDisappearancePlace}
          style={styles.input}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Motivo de desaparición</Text>
        <TextInput
          value={disappearance_reason}
          onChangeText={setDisappearanceReason}
          style={styles.input}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Trastornos / Enfermedades</Text>
        <TextInput
          value={disorders_diseases}
          onChangeText={setDisordersDiseases}
          multiline
          style={styles.input}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Discapacidad</Text>
        <TextInput
          value={disability}
          onChangeText={setDisability}
          style={styles.input}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Tratamiento</Text>
        <TextInput
          value={treatment}
          onChangeText={setTreatment}
          style={styles.input}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Adicciones</Text>
        <TextInput
          value={addictions}
          onChangeText={setAddictions}
          style={styles.input}
        />
      </View>

      {/* Selectores especiales */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Violencia de género</Text>
        <Switch value={gender_violence} onValueChange={setGenderViolence} />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Reincidencia</Text>
        <Picker selectedValue={recurrence} onValueChange={setRecurrence}
          style={Platform.OS === "web" ? undefined :{ height: 70, width: '50%' }}>
          <Picker.Item label="Desconocido" value="unknown" />
          <Picker.Item label="Sí" value="yes" />
          <Picker.Item label="No" value="no" />
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Estado del caso</Text>
        <Picker selectedValue={status} onValueChange={setStatus}
          style={Platform.OS === "web" ? undefined :{ height: 70, width: '50%' }}>
          <Picker.Item label="Activo" value="active" />
          <Picker.Item label="Encontrado" value="found" />
          <Picker.Item label="Cerrado" value="closed" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#eaedf1'
  },
  inputContainer: {
    marginBottom: 14
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
    button: {
    marginTop: 20,
    backgroundColor: 'rgb(172, 11, 27)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15
  },
  buttonText: {
  color: 'rgb(255,255,255)',
  fontSize: 16,
  fontWeight: '700',
  alignSelf: 'center'
  },
});
