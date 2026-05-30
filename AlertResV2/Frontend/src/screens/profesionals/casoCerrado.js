// src/screens/profesionals/CasoCerrado.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Pantalla con la que se recoge toda la información de un caso que se pretende cerrar, y se produce el cierre final del caso.
*/

// Importaciones
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createFoundCase, updateCase, updateSearchesByCase } from '../../../api';

// Exportación
export default function CasoCerrado({ route, navigation }) {
  const { item } = route.params;
  const case_id = item.case_id;

  const desaparecido = item.missing;
  const persona = item.person;

  // Campos de found_cases
  const [found_location, setFoundLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [distance_from_ipp_km, setDistance] = useState('');
  const [vertical_elevation_m, setElevation] = useState('');
  const [mobility_hours, setMobilityHours] = useState('');
  const [localization_type, setLocalizationType] = useState('');
  const [scenario, setScenario] = useState('');
  const [subject_status, setSubjectStatus] = useState('');
  const [climate_type, setClimateType] = useState('');
  const [disappearance_zone, setDisappearanceZone] = useState('');
  const [disappearance_terrain, setDisappearanceTerrain] = useState('');
  const [final_notes, setFinalNotes] = useState('');
  const [found_at, setFoundAt] = useState('');
  const [loading, setLoading] = useState(false);


  // Función que se ejecutará al presionar sobre el botón de 'Guardar'. 
  // Con esta función se pasa toda la información del caso cerrado a la base de datos. 
  async function submit() {
    if (!case_id) {
      return Alert.alert("Error", "No se recibió el case_id");
    }

    setLoading(true);
    try {
      const payload = {
        case_id,
        found_location: found_location || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        distance_from_ipp_km: distance_from_ipp_km ? parseFloat(distance_from_ipp_km) : null,
        vertical_elevation_m: vertical_elevation_m ? parseInt(vertical_elevation_m) : null,
        mobility_hours: mobility_hours ? parseFloat(mobility_hours) : null,

        localization_type: localization_type || null,
        scenario: scenario || null,
        subject_status: subject_status || null,
        climate_type: climate_type || null,
        disappearance_zone: disappearance_zone || null,
        disappearance_terrain: disappearance_terrain || null,

        final_notes: final_notes || null,
        found_at: found_at || null

      };

      const res = await createFoundCase(payload);
      if (!res?.found_id) throw new Error("No se pudo registrar el cierre del caso");

      // Cerramos el caso
      await updateCase(case_id, { case_status: "closed" });
      // Cerrar TODAS las búsquedas asociadas al caso
      await updateSearchesByCase(case_id, { search_status:  "finalizada"});


      Alert.alert("Caso cerrado", `Registro creado con ID: ${res.found_id}`);
      navigation.navigate("Inicio", {screen: "CasosGrupo"});

    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  }

  // Vista de la interfaz
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Información del caso (solo lectura) */}
        <Text style={styles.sectionTitle}>Información del caso</Text>

        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.text}>{persona.first_name} {persona.last_name}</Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.text}>{persona.age} años</Text>

        <Text style={styles.label}>Última vez visto:</Text>
        <Text style={styles.text}>{item.last_seen_point}</Text>

        <Text style={styles.label}>Fecha desaparición:</Text>
        <Text style={styles.text}>
          {new Date(item.disappearance_date).toLocaleDateString()}
        </Text>

        <Text style={styles.label}>Estado actual:</Text>
        <Text style={styles.text}>Activo (se cerrará al guardar)</Text>

        {/* Formulario de cierre */}
        <Text style={styles.sectionTitle}>Datos de cierre del caso</Text>

        {loading && <ActivityIndicator size="large" color="#ac0b1b" />}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Lugar donde fue encontrado</Text>
          <TextInput
            value={found_location}
            onChangeText={setFoundLocation}
            style={[styles.input, { minHeight: 70 }]}
            multiline
          />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Latitud</Text>
            <TextInput value={latitude} onChangeText={setLatitude} style={styles.input} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Longitud</Text>
            <TextInput value={longitude} onChangeText={setLongitude} style={styles.input} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Distancia desde IPP (km)</Text>
            <TextInput value={distance_from_ipp_km} onChangeText={setDistance} style={styles.input} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Elevación vertical (m)</Text>
            <TextInput value={vertical_elevation_m} onChangeText={setElevation} style={styles.input} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Horas de movilidad</Text>
          <TextInput value={mobility_hours} onChangeText={setMobilityHours} style={styles.input} keyboardType="numeric" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de localización</Text>
          <Picker selectedValue={localization_type} onValueChange={setLocalizationType} style={styles.picker}>
            <Picker.Item label="Selecciona..." value="" />
            <Picker.Item label="Estructuras" value="structures" />
            <Picker.Item label="Carreteras" value="roads" />
            <Picker.Item label="Caminos" value="tracks" />
            <Picker.Item label="Ramblas / drenajes" value="drainages" />
            <Picker.Item label="Zonas de agua" value="water_areas" />
            <Picker.Item label="Matorrales" value="brush/scrub" />
            <Picker.Item label="Bosques" value="woods" />
            <Picker.Item label="Campos" value="fields" />
            <Picker.Item label="Zonas rocosas" value="rocky_areas" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Escenario</Text>
          <Picker selectedValue={scenario} onValueChange={setScenario} style={styles.picker}>
            <Picker.Item label="Selecciona..." value="" />
            <Picker.Item label="Avalancha" value="avalanche" />
            <Picker.Item label="Criminal" value="criminal" />
            <Picker.Item label="Despondent" value="despondent" />
            <Picker.Item label="Evadido" value="evading" />
            <Picker.Item label="Investigativo" value="investigative" />
            <Picker.Item label="Perdido" value="lost" />
            <Picker.Item label="Médico" value="medical" />
            <Picker.Item label="Ahogamiento" value="drowning" />
            <Picker.Item label="Retraso" value="delay" />
            <Picker.Item label="Varado" value="stranded" />
            <Picker.Item label="Atrapado" value="trapped" />
            <Picker.Item label="Trauma" value="trauma" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estado del sujeto</Text>
          <Picker selectedValue={subject_status} onValueChange={setSubjectStatus} style={styles.picker}>
            <Picker.Item label="Selecciona..." value="" />
            <Picker.Item label="Sano" value="healthy" />
            <Picker.Item label="Herido leve" value="minor_injury" />
            <Picker.Item label="Herido grave" value="serious_injury" />
            <Picker.Item label="Fallecido" value="deceased" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Clima</Text>
          <Picker selectedValue={climate_type} onValueChange={setClimateType} style={styles.picker}>
            <Picker.Item label="Templado" value="temperate" />
            <Picker.Item label="Seco" value="dry" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Zona desaparición</Text>
          <Picker selectedValue={disappearance_zone} onValueChange={setDisappearanceZone} style={styles.picker}>
            <Picker.Item label="Natural / Rural" value="natural_or_rural" />
            <Picker.Item label="Urbana" value="urban_areas" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Terreno desaparición</Text>
          <Picker selectedValue={disappearance_terrain} onValueChange={setDisappearanceTerrain} style={styles.picker}>
            <Picker.Item label="Montaña" value="mountain" />
            <Picker.Item label="Llano" value="flat" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Notas finales</Text>
          <TextInput
            value={final_notes}
            onChangeText={setFinalNotes}
            style={[styles.input, { minHeight: 80 }]}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha/hora encontrado (YYYY-MM-DD HH:MM:SS)</Text>
          <TextInput value={found_at} onChangeText={setFoundAt} style={styles.input} />
        </View>

        <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Guardando..." : "Guardar"}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilo de la pantalla
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10,
    color: '#ac0b1b'
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
    fontWeight:'500'
  },
  text: {
    fontSize: 14,
    marginBottom: 8
  },
  image: {
    width: "40%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 12,
    alignSelf: "center",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 14
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14
  },
  button: {
    backgroundColor: '#ac0b1b',
    padding: 14,
    borderRadius: 10,
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  }
});