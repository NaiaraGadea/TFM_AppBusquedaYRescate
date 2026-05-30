// Frontend/src/screens/home/RegisterCaseScreen.js
import React, { useState, useContext } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert,ScrollView, 
        Switch, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {createPerson, createMissingPerson, createReporter, createCase} from '../../../api';
import { UserContext } from '../../../App';

export default function RegisterCaseScreen({ navigation }) {
  const { currentUser } = useContext(UserContext);

  // Campos persona
  //const [person, setPerson] = useState(null)
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [date_of_birth, setDob] = useState(''); // YYYY-MM-DD
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [age, setAge] = useState('');

  // Campos missing_people
  //const [missing_person, setMissing] = useState (null)
  const [nickname, setNickname] = useState('');
  const [adult, setAdult] = useState(false);
  const [sex, setSex] = useState(''); // 'female' | 'male' | 'other'
  const [nationality, setNationality] = useState('');
  const [languages, setLanguages] = useState('');
  const [habitual_address, setHabitualAddress] = useState('');
  const [photo_url, setPhotoUrl] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [hair, setHair] = useState('');
  const [facial_hair, setFacialHair] = useState(''); // 'beard','mustache','goatee','none'
  const [eye_color, setEyeColor] = useState('');
  const [last_clothing, setLastClothing] = useState('');
  const [physical_level, setPhysicalLevel] = useState(''); // 'sedentary','active','athlete'
  const [physical_constitution, setPhysicalConstitution] = useState(''); // 'slim','average','sotcky'
  const [other_physical_features, setOtherPhysicalFeatures] = useState('');
  const [medical_conditions, setMedicalConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [disability, setDisability] = useState(''); // 'psychiatric','physical','sensory','intellectual','none'
  const [lack_of_autonomy, setLackOfAutonomy] = useState('');
  const [treatment, setTreatment] = useState('');
  const [with_medication, setWithMedication] = useState(false);
  const [substance_abuse, setSubstanceAbuse] = useState(''); // 'drugs','alcohol','prescription drugs','other'
  const [visual_problems, setVisualProblems] = useState(''); // 'glasses','contact lenses','colorblind','other'
  const [hearing_problems, setHearingProblems] = useState(''); // 'hearing aid','cochlear implant','other'
  const [grade_of_deafness, setGradeOfDeafness] = useState('');
  const [gender_violence, setGenderViolence] = useState(false);

  // Campos cases
  const [disappearance_date, setDisappearanceDate] = useState('');
  const [case_status, setCaseStatus] = useState('active'); // ENUM
  const [missing_duration, setMissingDuration] = useState(''); // HH:MM:SS
  const [departure_point, setDeparturePoint] = useState('');
  const [expected_return_point, setExpectedReturnPoint] = useState('');
  const [last_seen_point, setLastSeenPoint] = useState('');
  const [last_seen_at, setLastSeenAt] = useState(''); // HH:MM:SS
  const [last_seen_by, setLastSeenBy] = useState('');
  const [last_known_point, setLastKnownPoint] = useState('');
  const [last_known_at, setLastKnownAt] = useState(''); // HH:MM:SS
  const [typology, setTypology] = useState('');
  const [category, setCategory] = useState('');
  const [recurrence, setRecurrence] = useState('unknown');
  const [created_by, setCreatedBy] = useState(currentUser?.group_id || null);

  

  // Campos del denunciante reporters+people
  const [rep_first_name, setRepFirstName] = useState('');
  const [rep_last_name, setRepLastName] = useState('');
  const [rep_dni, setRepDni] = useState('');
  const [rep_birth_date, setRepBirthDate] = useState('');
  const [rep_age, setRepAge] = useState('');
  const [rep_phone, setRepPhone] = useState('');
  const [rep_email, setRepEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [report_reason, setReportReason] = useState('');



  const [loading, setLoading] = useState(false);

  const submit = async () => {
    // Validaciones mínimas
    if (!first_name.trim() || !last_name.trim()) {
      return Alert.alert('Faltan datos', 'Introduce nombre y apellidos');
    }

    setLoading(true);
    try {
      // 1) Crear persona en tabla people
      const personPayload = {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        dni: dni || null,
        birth_date: date_of_birth || null,
        age: age ? Number(age) : null,
        phone: phone || null,
        email: email || null
      };

      const p = await createPerson(personPayload);
      const person_id = p?.person_id;
      if (!person_id) throw new Error('No se pudo crear la persona');


      // 2) Crear registro en missing_people
      const missingPayload = {
        person_id,
        nickname: nickname || null,
        adult: adult ? 1 : 0,
        sex: sex || null,
        nationality: nationality || null,
        languages: languages || null,
        habitual_address: habitual_address || null,
        photo_url: photo_url || null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        hair: hair || null,
        facial_hair: facial_hair || null,
        eye_color: eye_color || null,
        last_clothing: last_clothing || null,
        physical_level: physical_level || null,
        physical_constitution: physical_constitution || null,
        other_physical_features: other_physical_features || null,
        medical_conditions: medical_conditions || null,
        allergies: allergies || null,
        disability: disability || null,
        lack_of_autonomy: lack_of_autonomy || null,
        treatment: treatment || null,
        with_medication: with_medication ? 1 : 0,
        substance_abuse: substance_abuse || null,
        visual_problems: visual_problems || null,
        hearing_problems: hearing_problems || null,
        grade_of_deafness: grade_of_deafness || null,
        gender_violence: gender_violence ? 1 : 0,
      };

      const mp = await createMissingPerson(missingPayload);
      const missing_id = mp?.missing_id;
      if (!missing_id) throw new Error('No se pudo crear el registro de desaparecido');


      // 3) (Opcional) crear reporter si tu formulario tuviera datos del reportero
      let reporter_id = null;

      const hasReporter =
        rep_first_name.trim() ||
        rep_last_name.trim() ||
        rep_dni ||
        rep_phone ||
        rep_email ||
        relation ||
        report_reason;

      if (hasReporter) {

        // Validación mínima obligatoria
        if (!rep_first_name.trim() || !rep_last_name.trim()) {
          setLoading(false);
          return Alert.alert(
            "Datos incompletos",
            "Si introduces datos del denunciante, nombre y apellidos son obligatorios."
          );
        }

        const reporterPersonPayload = {
          first_name: rep_first_name.trim(),
          last_name: rep_last_name.trim(),
          dni: rep_dni || null,
          birth_date: rep_birth_date || null,
          age: rep_age ? Number(rep_age) : null,
          phone: rep_phone || null,
          email: rep_email || null
        };

        const pr = await createPerson(reporterPersonPayload);
        const reporterperson_id = pr?.person_id;

        const reporterPayload = {
          person_id: reporterperson_id,
          relation: relation || null,
          report_reason: report_reason || null
        };

        const r = await createReporter(reporterPayload);
        reporter_id = r?.reporter_id;
      }


      // 4) Crear case en tabla cases
      const casePayload = {
        missing_id,
        reporter_id,
        disappearance_date: disappearance_date || null,
        case_status: case_status || null,
        missing_duration: missing_duration || null,
        departure_point: departure_point || null,
        expected_return_point: expected_return_point || null,
        last_seen_point: last_seen_point || null,
        last_seen_at: last_seen_at || null,
        last_seen_by: last_seen_by || null,
        last_known_point: last_known_point || null,
        last_known_at: last_known_at || null,
        typology: typology || null,
        category: category || null,
        recurrence: recurrence || null,
        created_by: created_by || null
      };


      const caseRes = await createCase(casePayload);
      const case_id = caseRes?.case_id;
      if (!case_id) throw new Error('No se pudo crear el caso');

      Alert.alert('Caso registrado', `ID: ${case_id}`);
      navigation.goBack();
    } catch (err) {
      console.error('Error creando caso:', err);
      Alert.alert('Error', err?.message || 'No se pudo registrar el caso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {loading && <ActivityIndicator size="large" color="#ac0b1b" style={{ marginBottom: 12 }} />}
        
        {/*DATOS DE LA PERSONA*/}
        <Text style={styles.sectionTitle}>Datos de la persona</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput value={first_name} onChangeText={setFirstName} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput value={last_name} onChangeText={setLastName} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apodo / Nombre habitual</Text>
          <TextInput value={nickname} onChangeText={setNickname} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>DNI</Text>
          <TextInput value={dni} onChangeText={setDni} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nacionalidad</Text>
          <TextInput value={nationality} onChangeText={setNationality} style={styles.input} />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Fecha de nacimiento (YYYY-MM-DD)</Text>
            <TextInput value={date_of_birth} onChangeText={setDob} style={styles.input} />
          </View>

          <View style={{ width: 100 }}>
            <Text style={styles.label}>Edad</Text>
            <TextInput value={age} onChangeText={setAge} style={styles.input} keyboardType="numeric" />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>¿Es adulto?</Text>
            <Switch value={adult} onValueChange={setAdult} />
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Sexo</Text>
          <Picker selectedValue={sex} onValueChange={setSex} style={Platform.OS === 'web' ? undefined : { height: 70, width: '50%' }}>
            <Picker.Item label="Selecciona..." value="" />
            <Picker.Item label="Hombre" value="male" />
            <Picker.Item label="Mujer" value="female" />
            <Picker.Item label="Otro" value="other" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dirección habitual</Text>
          <TextInput value={habitual_address} onChangeText={setHabitualAddress} multiline style={[styles.input, { minHeight: 70 }]} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Idiomas</Text>
          <TextInput value={languages} onChangeText={setLanguages} style={styles.input} placeholder="Ej: Español, Inglés" />
        </View>

        {/*INFORMACIÓN DEL CASO DE DESAPARICIÓN*/}
        <Text style={styles.sectionTitle}>Datos de desaparición</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de desaparición (YYYY-MM-DD)</Text>
          <TextInput value={disappearance_date} onChangeText={setDisappearanceDate} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tiempo desaparecido (HH:MM:SS)</Text>
          <TextInput
            value={missing_duration}
            onChangeText={setMissingDuration}
            style={styles.input}
            placeholder="Ej: 05:30:00"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Punto de partida</Text>
          <TextInput
            value={departure_point}
            onChangeText={setDeparturePoint}
            style={[styles.input, { minHeight: 60 }]}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Punto de retorno esperado</Text>
          <TextInput
            value={expected_return_point}
            onChangeText={setExpectedReturnPoint}
            style={[styles.input, { minHeight: 60 }]}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Último punto visto</Text>
          <TextInput
            value={last_seen_point}
            onChangeText={setLastSeenPoint}
            style={[styles.input, { minHeight: 60 }]}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hora última vez visto (HH:MM:SS)</Text>
          <TextInput
            value={last_seen_at}
            onChangeText={setLastSeenAt}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visto por</Text>
          <TextInput
            value={last_seen_by}
            onChangeText={setLastSeenBy}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Último punto conocido</Text>
          <TextInput
            value={last_known_point}
            onChangeText={setLastKnownPoint}
            style={[styles.input, { minHeight: 60 }]}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hora último punto conocido (HH:MM:SS)</Text>
          <TextInput
            value={last_known_at}
            onChangeText={setLastKnownAt}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipología</Text>
          <Picker selectedValue={typology} onValueChange={setTypology} style={styles.picker}>
            <Picker.Item label="Voluntaria" value="voluntary" />
            <Picker.Item label="Involuntaria" value="involuntary" />
            <Picker.Item label="Forzosa" value="forcible" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoría</Text>
          <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
            <Picker.Item label="Autista" value="authistic" />
            <Picker.Item label="Niño 1-3" value="child 1-3" />
            <Picker.Item label="Niño 4-6" value="child 4-6" />
            <Picker.Item label="Niño 7-9" value="child 7-9" />
            <Picker.Item label="Niño 10-12" value="child 10-12" />
            <Picker.Item label="Niño 13-15" value="child 13-15" />
            <Picker.Item label="Demencia / Alzheimer" value="dementia (alzheimer)" />
            <Picker.Item label="Enfermedad mental" value="mental illness" />
            <Picker.Item label="Discapacidad intelectual" value="intellectual disability" />
            <Picker.Item label="Secuestro" value="kidnapping" />
            <Picker.Item label="Escalador" value="climber" />
            <Picker.Item label="Depresivo / Suicida" value="depressed/suicidal" />
            <Picker.Item label="Recolector" value="forager" />
            <Picker.Item label="Senderista" value="walker/hiker" />
            <Picker.Item label="Corredor" value="runner" />
            <Picker.Item label="Jinete" value="horse rider" />
            <Picker.Item label="Cazador" value="hunter" />
            <Picker.Item label="Espeleología" value="speleology" />
            <Picker.Item label="Pescador" value="fisher" />
            <Picker.Item label="Campista" value="camper" />
            <Picker.Item label="Ciclista montaña" value="mountain biker" />
            <Picker.Item label="Esquiador / Snowboard" value="skier/snowboarder" />
            <Picker.Item label="Motos de nieve" value="snowmobile" />
            <Picker.Item label="Raquetas nieve" value="snowshoe" />
            <Picker.Item label="Abuso sustancias" value="substance abuse" />
            <Picker.Item label="Entorno urbano" value="urban entrapment" />
            <Picker.Item label="Vehículo desaparecido" value="missing vehicle" />
            <Picker.Item label="ATV / Quad" value="atv/ quad" />
            <Picker.Item label="Aeronave" value="aircraft" />
            <Picker.Item label="Agua" value="water" />
            <Picker.Item label="Trabajador" value="worker" />
            <Picker.Item label="Otro" value="other" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reincidencia</Text>
          <Picker selectedValue={recurrence} onValueChange={setRecurrence} style={styles.picker}>
            <Picker.Item label="Sí" value="yes" />
            <Picker.Item label="No" value="no" />
            <Picker.Item label="Desconocido" value="unknown" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estado del caso</Text>
          <Picker selectedValue={case_status} onValueChange={setCaseStatus} style={styles.picker}>
            <Picker.Item label="Activo" value="active" />
            <Picker.Item label="Cerrado" value="closed" />
          </Picker>
        </View>


        {/*INFORMACIÓN FÍSICA Y MÉDICA DE LA PERSONA*/}
        <Text style={styles.sectionTitle}>Datos psicofísicos de la persona</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>URL de foto</Text>
          <TextInput value={photo_url} onChangeText={setPhotoUrl} style={styles.input} />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Altura (cm)</Text>
            <TextInput value={height} onChangeText={setHeight} style={styles.input} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput value={weight} onChangeText={setWeight} style={styles.input} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cabello</Text>
          <TextInput value={hair} onChangeText={setHair} style={styles.input} placeholder="Ej: Castaño, corto" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vello facial</Text>
          <Picker selectedValue={facial_hair} onValueChange={setFacialHair} style={styles.picker}>
            <Picker.Item label="Ninguno" value="none" />
            <Picker.Item label="Barba" value="beard" />
            <Picker.Item label="Bigote" value="mustache" />
            <Picker.Item label="Perilla" value="goatee" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Color de ojos</Text>
          <TextInput value={eye_color} onChangeText={setEyeColor} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Última ropa vista</Text>
          <TextInput value={last_clothing} onChangeText={setLastClothing} multiline style={[styles.input, { minHeight: 70 }]} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nivel físico</Text>
          <Picker selectedValue={physical_level} onValueChange={setPhysicalLevel} style={styles.picker}>
            <Picker.Item label="Sedentario" value="sedentary" />
            <Picker.Item label="Activo" value="active" />
            <Picker.Item label="Deportista" value="athlete" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Constitución física</Text>
          <Picker selectedValue={physical_constitution} onValueChange={setPhysicalConstitution} style={styles.picker}>
            <Picker.Item label="Delgado" value="slim" />
            <Picker.Item label="Normal" value="average" />
            <Picker.Item label="Robusto" value="sotcky" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Otros rasgos físicos</Text>
          <TextInput value={other_physical_features} onChangeText={setOtherPhysicalFeatures} multiline style={[styles.input, { minHeight: 70 }]} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Condiciones médicas</Text>
          <TextInput value={medical_conditions} onChangeText={setMedicalConditions} multiline style={[styles.input, { minHeight: 70 }]} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Alergias</Text>
          <TextInput value={allergies} onChangeText={setAllergies} multiline style={[styles.input, { minHeight: 70 }]} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Discapacidad</Text>
          <Picker selectedValue={disability} onValueChange={setDisability} style={styles.picker}>
            <Picker.Item label="Ninguna" value="none" />
            <Picker.Item label="Psiquiátrica" value="psychiatric" />
            <Picker.Item label="Física" value="physical" />
            <Picker.Item label="Sensorial" value="sensory" />
            <Picker.Item label="Intelectual" value="intellectual" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Falta de autonomía</Text>
          <TextInput value={lack_of_autonomy} onChangeText={setLackOfAutonomy} multiline style={[styles.input, { minHeight: 70 }]} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tratamiento</Text>
          <TextInput value={treatment} onChangeText={setTreatment} multiline style={[styles.input, { minHeight: 70 }]} />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>¿Lleva la medicación consigo?</Text>
          <Switch value={with_medication} onValueChange={setWithMedication} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Consumo de sustancias</Text>
          <Picker selectedValue={substance_abuse} onValueChange={setSubstanceAbuse} style={styles.picker}>
            <Picker.Item label="Ninguna" value="" />
            <Picker.Item label="Drogas" value="drugs" />
            <Picker.Item label="Alcohol" value="alcohol" />
            <Picker.Item label="Medicamentos" value="prescription drugs" />
            <Picker.Item label="Otras" value="other" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Problemas visuales</Text>
          <Picker selectedValue={visual_problems} onValueChange={setVisualProblems} style={styles.picker}>
            <Picker.Item label="Ninguno" value="" />
            <Picker.Item label="Gafas" value="glasses" />
            <Picker.Item label="Lentillas" value="contact lenses" />
            <Picker.Item label="Daltonismo" value="colorblind" />
            <Picker.Item label="Otros" value="other" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Problemas auditivos</Text>
          <Picker selectedValue={hearing_problems} onValueChange={setHearingProblems} style={styles.picker}>
            <Picker.Item label="Ninguno" value="" />
            <Picker.Item label="Audífono" value="hearing aid" />
            <Picker.Item label="Implante coclear" value="cochlear implant" />
            <Picker.Item label="Otros" value="other" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Grado de sordera</Text>
          <TextInput value={grade_of_deafness} onChangeText={setGradeOfDeafness} style={styles.input} />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Violencia de género</Text>
          <Switch value={gender_violence} onValueChange={setGenderViolence} />
        </View>


        {/*DATOS DE LA PERSONA DENUNCIANTE*/}
        <Text style={styles.sectionTitle}>Datos del denunciante</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={rep_first_name}
            onChangeText={setRepFirstName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            value={rep_last_name}
            onChangeText={setRepLastName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>DNI</Text>
          <TextInput
            value={rep_dni}
            onChangeText={setRepDni}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de nacimiento (YYYY-MM-DD)</Text>
          <TextInput
            value={rep_birth_date}
            onChangeText={setRepBirthDate}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Edad</Text>
          <TextInput
            value={rep_age}
            onChangeText={setRepAge}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            value={rep_phone}
            onChangeText={setRepPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={rep_email}
            onChangeText={setRepEmail}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Relación con la persona desaparecida</Text>
          <TextInput
            value={relation}
            onChangeText={setRelation}
            style={[styles.input, { minHeight: 60 }]}
            multiline
            placeholder="Ej: Madre, amigo, vecino..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Motivo del reporte</Text>
          <TextInput
            value={report_reason}
            onChangeText={setReportReason}
            style={[styles.input, { minHeight: 60 }]}
            multiline
            placeholder="Describe por qué realiza la denuncia"
          />
        </View>



        

        <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  button: {
    marginTop: 20,
    backgroundColor: 'rgb(172, 11, 27)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 30
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  }
});
