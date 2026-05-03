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
import PantallaBusqueda from './src/screens/search/pantallaBusqueda';
import listaDesaparecidos from './src/screens/home/Desaparecidos';
import casosGrupo from './src/screens/home/pantallaCasosGrupo';
import ajustes from './src/screens/settings/Ajustes';
import casoPublico from './src/screens/home/pantallaCasoPublic'; 

// Pantallas profesionales
import menuProfesionales from './src/screens/createSearch/menuProfesionales';
import RegisterCaseScreen from './src/screens/createSearch/RegisterCaseScreen';
import AlertsScreen from './src/screens/createSearch/AlertsScreen';
import nuevoDesaparecido from './src/screens/createSearch/nuevoDesaparecido';
import casosActivos from './src/screens/createSearch/casosActivos';
import historialCasos from './src/screens/createSearch/historialCasos';
import pantallaCaso from './src/screens/createSearch/pantallaCaso';
import pantallaCasoActivo from './src/screens/createSearch/pantallaCasoActivo';
import NuevaBusqueda from './src/screens/createSearch/nuevaBusqueda';

// Tema global
import { MyTheme } from './src/styles/Globalstyles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Contexto global para la búsqueda activa
export const SearchContext = createContext();

// Contexto para el usuario loggeado
export const UserContext = createContext();

// Stack para la pestaña "Profesionales"
function ProfesionalesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MenuProfesionales"
        component={menuProfesionales}
        options={{ title: 'Panel de profesionales' }}
      />
      <Stack.Screen
        name="RegistrarCaso"
        component={RegisterCaseScreen}
        options={{ title: 'Registrar caso' }}
      />
      <Stack.Screen
        name="CasosActivos"
        component={casosActivos}
        options={{ title: 'Casos Activos' }}
      />
      <Stack.Screen
        name="HistorialCasos"
        component={historialCasos}
        options={{ title: 'Historial' }}
      />
      <Stack.Screen
        name="PantallaCaso"
        component={pantallaCaso}
        options={{ title: 'Desaparecido' }}
      />
      <Stack.Screen
        name="PantallaCasoActivo"
        component={pantallaCasoActivo}
        options={{ title: 'Desaparecido' }}
      />
      <Stack.Screen
        name="CrearAlerta"
        component={AlertsScreen}
        options={{ title: 'Crear alerta' }}
      />
      <Stack.Screen
        name="NuevaBusqueda"
        component={NuevaBusqueda}
        options={{ title: 'Crear Búsqueda' }}
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
        options={{ title: 'Detalle del caso' }} 
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
        options={{ title: 'Casos del Grupo' }}
      />
      <Stack.Screen
        name="RegistrarCaso"
        component={RegisterCaseScreen}
        options={{ title: 'Registrar caso' }}
      />
    </Stack.Navigator>
  );
}


// Stack para la pestaña "Búsqueda"
function BusquedaStack() {
  return (
    <Stack.Navigator>
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
        else if (route.name === 'Búsqueda') iconName = 'map-marker-account';
        else if (route.name === 'Inicio') iconName = 'home';
        else if (route.name === 'Ajustes') iconName = 'cog';
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        }
      })}>

      <Tab.Screen name = "Inicio" component={InicioStack}/>
      <Tab.Screen name = "Búsqueda" component={BusquedaStack}/>
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
        else if (route.name === 'Búsqueda') iconName = 'map-marker-account';
        else if (route.name === 'Inicio') iconName = 'home';
        else if (route.name === 'Ajustes') iconName = 'cog';
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        }
      })}>

      <Tab.Screen name = "Inicio" component={InicioStack}/>
      <Tab.Screen name = "Búsqueda" component={BusquedaStack}/>
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
        else if (route.name === 'Búsqueda') iconName = 'map-marker-account';
        else if (route.name === 'Inicio') iconName = 'home';
        else if (route.name === 'Alertas') iconName = 'bell';
        else if (route.name === 'Ajustes') iconName = 'cog';
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        }
      })}>

      <Tab.Screen name = "Alertas" component={InicioStack}/>
      <Tab.Screen name = "Búsqueda" component={BusquedaStack}/>
      <Tab.Screen name="Inicio" component={CasosGrupoStack}/>

      <Tab.Screen name = "Grupo" component={ProfesionalesStack}/>
      <Tab.Screen name = "Ajustes" component={AjustesStack}/>

    </Tab.Navigator>
  );
}

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

/*
export default function App() {
  const [activeSearch, setActiveSearch] = useState(null);

  return (
    <SafeAreaProvider>
      <SearchContext.Provider value={{ activeSearch, setActiveSearch }}>
        <NavigationContainer theme={MyTheme}>
          <StatusBar style="auto" />
          <Tab.Navigator
            initialRouteName="Inicio"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Perfil') iconName = 'account';
                else if (route.name === 'Búsqueda') iconName = 'map-marker-account';
                else if (route.name === 'Inicio') iconName = 'home';
                else if (route.name === 'Profesionales') iconName = 'plus-circle';
                else if (route.name === 'Ajustes') iconName = 'cog';
                return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
              },
              headerShown: false,
            })}
          >
            <Tab.Screen name="Perfil" component={PerfilStack} />
            <Tab.Screen name="Búsqueda" component={BusquedaStack} />
            <Tab.Screen name="Inicio" component={InicioStack} />
            <Tab.Screen name="Profesionales" component={ProfesionalesStack} />
            <Tab.Screen name="Ajustes" component={AjustesStack} />
          </Tab.Navigator>
        </NavigationContainer>
      </SearchContext.Provider>
    </SafeAreaProvider>
  );
}*/
