import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Tus pantallas principales
import mostrarPerfil from './src/screens/profile/Perfil';
import PantallaBusqueda from './src/screens/search/pantallaBusqueda';
import listaDesaparecidos from './src/screens/home/Desaparecidos';
import ajustes from './src/screens/settings/Ajustes';
import casoPublico from './src/screens/home/pantallaCasoPublic'; 

// Pantallas profesionales
import menuProfesionales from './src/screens/createSearch/menuProfesionales';
import RegisterCaseScreen from './screens/RegisterCaseScreen';
import AlertsScreen from './screens/AlertsScreen';
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

// 🔹 Contexto global para la búsqueda activa
export const SearchContext = createContext();

// 🔹 Stack para la pestaña "Profesionales"
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

// 🔹 Stack para la pestaña "Inicio"
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
            <Tab.Screen name="Perfil" component={mostrarPerfil} />
            <Tab.Screen name="Búsqueda" component={PantallaBusqueda} />
            <Tab.Screen name="Inicio" component={InicioStack} />
            <Tab.Screen name="Profesionales" component={ProfesionalesStack} />
            <Tab.Screen name="Ajustes" component={ajustes} options={{ headerShown: true, title: "Ajustes" }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SearchContext.Provider>
    </SafeAreaProvider>
  );
}
