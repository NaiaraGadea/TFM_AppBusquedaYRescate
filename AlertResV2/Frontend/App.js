/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Fichero que es el núcleo de la aplicación.
Aquí se inicializan los contextos globales, configura la navegación principal 
mediante stacks y tabs según el tipo de usuario, y aplica el tema visual global. 
*/

// Importaciones
import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Pantalla de inicio de seleccón de usuario
import SeleccionUsuario from './src/screens/auth/SeleccionUsuario';
import CreateUser from './src/screens/auth/CrearUsuario';

// Pantallas principales
import mostrarPerfil from './src/screens/profile/Perfil';
import pantallaListaBusquedas from './src/screens/search/pantallaListaBusquedas';
import PantallaBusqueda from './src/screens/search/pantallaBusqueda';
import listaDesaparecidos from './src/screens/home/Desaparecidos';
import casosGrupo from './src/screens/home/pantallaCasosGrupo.js';
import ajustes from './src/screens/settings/Ajustes';
import casoPublico from './src/screens/home/pantallaCasoPublic.js'; 

// Pantallas profesionales
//import menuProfesionales from './src/screens/profesionals/menuProfesionales';
import RegisterCaseScreen from './src/screens/profesionals/nuevoCaso.js';
import AlertsScreen from './src/screens/profesionals/nuevaAlerta.js';
//import nuevoDesaparecido from './src/screens/profesionals/nuevoDesaparecido';
//import casosActivos from './src/screens/profesionals/casosActivos';
//import historialCasos from './src/screens/profesionals/historialCasos';
//import pantallaCaso from './src/screens/profesionals/pantallaCaso';
import pantallaCasoActivo from './src/screens/profesionals/pantallaCasoActivo';
import NuevaBusqueda from './src/screens/profesionals/nuevaBusqueda';

import casoCerrado from './src/screens/profesionals/casoCerrado';

import listaMiembros from './src/screens/profesionals/MiembrosGrupo.js'

// Tema global
import { MyTheme } from './src/styles/Globalstyles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Contexto global para la búsqueda activa
export const SearchContext = createContext();

// Contexto para el usuario loggeado
export const UserContext = createContext();

// Stack para la pestaña "Grupo"
function ProfesionalesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListaMiembros"
        component={listaMiembros}
        options={{ title: 'Información del grupo' }}
      />
      
    </Stack.Navigator>
  );
}

// Stack para la pestaña "Inicio"
function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inicio"
        component={listaDesaparecidos}
        options={{ title: 'Inicio' }}
      />
      <Stack.Screen
        name="casoPublico"
        component={casoPublico}
        options={{ title: 'Información' }} 
      />
    </Stack.Navigator>
  );
}

// Stack para la pestaña "Inicio" pero de los grupos de rescate, donde se listan todos los casos del grupo
function CasosGrupoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="CasosGrupo"
        component={casosGrupo}
        options={{ title: 'Casos del grupo' }}
      />
      <Stack.Screen
        name="RegistrarCaso"
        component={RegisterCaseScreen}
        options={{ title: 'Registrar caso' }}
      />
      <Stack.Screen
        name="PantallaCasoActivo"
        component={pantallaCasoActivo}
        options={{ title: 'Caso' }}
      />
      <Stack.Screen
        name="CrearAlerta"
        component={AlertsScreen}
        options={{ title: 'Crear alerta' }}
      />
      <Stack.Screen
        name="NuevaBusqueda"
        component={NuevaBusqueda}
        options={{ title: 'Crear búsqueda' }}
      />
      <Stack.Screen
        name="CasoCerrado"
        component={casoCerrado}
        options={{ title: 'Cerrar caso' }}
      />
    </Stack.Navigator>
  );
}

// Stack para la pestaña "Búsqueda"
function BusquedaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListaBusquedas"
        component={pantallaListaBusquedas}
        options={{ title: 'Listado de búsquedas' }}
      />
      <Stack.Screen
        name="Búsqueda"
        component={PantallaBusqueda}
        options={{ title: 'Búsqueda' }}
      />
    </Stack.Navigator>
  );
}

// Stack para la pestaña "Perfil"
function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Perfil"
        component={mostrarPerfil}
        options={{ title: 'Perfil' }}
      />
    </Stack.Navigator>
  );
}

// Stack para la pestaña "Ajustes"
function AjustesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Ajustes"
        component={ajustes}
        options={{ title: 'Ajustes' }}
      />
    </Stack.Navigator>
  );
}

// TABS (Navegadores) según tipo de usuario
// Tab para el usuario Voluntario:
function TabsVoluntarios(){
  return (
    <Tab.Navigator initialRouteName= 'Inicio' screenOptions={({route})=>({
      headerShown:false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Perfil') iconName = 'account';
        else if (route.name === 'Búsquedas') iconName = 'map-marker-account';
        else if (route.name === 'Inicio') iconName = 'home';
        else if (route.name === 'Ajustes') iconName = 'cog';
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        }
      })}>

      <Tab.Screen name = "Inicio" component={InicioStack}/>
      <Tab.Screen name = "Búsquedas" component={BusquedaStack}/>
      <Tab.Screen name = "Perfil" component={PerfilStack}/>
      <Tab.Screen name = "Ajustes" component={AjustesStack}/>

    </Tab.Navigator>
  );
}

// Tab para el usuario Miembro Grupo:
function TabsMiembros(){
  return (
    <Tab.Navigator initialRouteName= 'Inicio' screenOptions={({route})=>({
      headerShown:false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Perfil') iconName = 'account';
        else if (route.name === 'Búsquedas') iconName = 'map-marker-account';
        else if (route.name === 'Inicio') iconName = 'home';
        else if (route.name === 'Ajustes') iconName = 'cog';
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        }
      })}>

      <Tab.Screen name = "Inicio" component={InicioStack}/>
      <Tab.Screen name = "Búsquedas" component={BusquedaStack}/>
      <Tab.Screen name = "Perfil" component={PerfilStack}/>
      <Tab.Screen name = "Ajustes" component={AjustesStack}/>

    </Tab.Navigator>
  );
}

// Tab para el usuario Grupo:
function TabsGrupos(){
  return (
    <Tab.Navigator initialRouteName= 'Inicio' screenOptions={({route})=>({
      headerShown:false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Grupo') iconName = 'account-group';
        else if (route.name === 'Búsquedas') iconName = 'map-marker-account';
        else if (route.name === 'Inicio') iconName = 'home';
        else if (route.name === 'Alertas') iconName = 'bell';
        else if (route.name === 'Ajustes') iconName = 'cog';
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        }
      })}>

      <Tab.Screen name = "Alertas" component={InicioStack}/>
      <Tab.Screen name = "Búsquedas" component={BusquedaStack}/>
      <Tab.Screen name="Inicio" component={CasosGrupoStack}/>
      <Tab.Screen name = "Grupo" component={ProfesionalesStack}/>
      <Tab.Screen name = "Ajustes" component={AjustesStack}/>

    </Tab.Navigator>
  );
}

// Exportación de la app
export default function App(){
  // Constante para conocersi hay o no una búsqueda en la que se está participando.
  const [activeSearch, setActiveSearch] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  return(
    <SafeAreaProvider>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <SearchContext.Provider value={{activeSearch,setActiveSearch}}>
      
        <NavigationContainer theme={MyTheme}>
          <StatusBar style='auto'/>
          <Stack.Navigator screenOptions={{headerShown:false}}>

            {/*Pantalla inicial*/}
            <Stack.Screen name='SeleccionUsuario' component={SeleccionUsuario}/>
            <Stack.Screen name='CreateUser' component={CreateUser}/>

            {/*Navegadores según usuario*/}
            <Stack.Screen name='TabsVoluntarios' component={TabsVoluntarios}/>
            <Stack.Screen name='TabsMiembros' component={TabsMiembros}/>
            <Stack.Screen name='TabsGrupos' component={TabsGrupos}/>

          </Stack.Navigator>

        </NavigationContainer>
      </SearchContext.Provider>
      </UserContext.Provider>
    </SafeAreaProvider>

  );
}