// src/screens/createSearch/pantallaCaso.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { getDesaparecidoByCaseId, getCaseByCaseId } from "../../../api";
import { useNavigation } from "@react-navigation/native";

export default function InformacionCaso({ route }) {
  const { caseId } = route.params;
  const [info, setInformacion] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const desaparecido = await getDesaparecidoByCaseId(caseId).catch(() => ({}));
        const caso = await getCaseByCaseId(caseId).catch(() => ({}));
        setInformacion({ ...desaparecido, ...caso });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [caseId]);

  if (!info) return <Text>Cargando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Caso #{caseId}</Text>

      {info.photo_url ? (
              <Image source={{ uri: info.photo_url }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={[styles.image, styles.placeholder]} />
            )}
            
      <Text style = {styles.label}>Nombre:</Text>
      <Text style = {styles.text}>{info.first_name} {info.last_name}</Text>
      <Text style = {styles.label}>Edad:</Text>
      <Text style = {styles.text}>{info.age} años </Text>
      <Text style = {styles.label}>Nacionalidad:</Text>
      <Text style = {styles.text}> {info.nationality}</Text>
      <Text style = {styles.label}>Dirección habitual:</Text>
      <Text style = {styles.text}> {info.habitual_address}</Text>
      <Text style = {styles.label}>Última vez visto:</Text>
      <Text style = {styles.text}> {info.disappearance_place}</Text>
      <Text style = {styles.label}>Motivo desaparición:</Text>
      <Text style = {styles.text}> {info.disappearance_reason}</Text>
      <Text style = {styles.label}>Estado:</Text>
      <Text style = {styles.text}>{info.status}</Text>


      {/* Aquí irán los datos de contacto de familiares/denunciantes*/}
      
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.button2} onPress={() =>{}}>
            <Text style={styles.buttonText}>Modificar Datos</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('NuevaBusqueda', { caseId})}>
            <Text style={styles.buttonText}>Crear Búsqueda</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CrearAlerta', { caseId})}>
            <Text style={styles.buttonText}>Enviar Alerta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  label: {fontSize: 14, fontWeight: '600',paddingLeft: 10, margintop: 15},
  text: {fontSize:14, paddingLeft:10},
  button: {
    marginTop: 12,
    backgroundColor: 'rgba(131, 14, 25, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  button2: {
    marginTop: 12,
    backgroundColor: 'rgb(143,164,179)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
  color: 'rgb(255,255,255)',
  fontSize: 16,
  fontWeight: '600',
  alignSelf: 'center'
  },
  image: {
    width: '15%',
    height: undefined,
    aspectRatio: 2 / 3, // mantiene proporción en móvil y web
    borderRadius: 8,
    backgroundColor: '#eee',
    marginBottom: 12,
    alignSelf: 'center'
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
