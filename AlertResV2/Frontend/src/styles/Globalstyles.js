// Este fichero incluye distintas constantes con colores del Estilo que se quiere dar a la app.
// Documentación: https://reactnavigation.org/docs/themes

/*
Colores del logo:
Rojo: #AC0B1B rgb(172, 11, 27)
Gris mas claro: #EFEFEF, rgb(239,239,239)
Gris claro: #CCCCCC, rgb(204, 204, 204)
Gris oscuro: #7F7F7F, rgb(127,127,127)
Azul cabeza y cuerpo: #81ADC6 rgb(129, 173, 198)
Azul fondo: #8FA4B3 , rgb(143,164,179)
Negro: #000000, rgb(0,0,0)
Blanco: #FFFFFF, rgb(255,255,255)

Gris clarito para el fondo: #eaedf1
*/ 

// Estilo general de la app:
// primary: color de los ...
// background: color de fondo

export const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(172, 11, 27)',
    background: '#eaedf1',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(0, 0, 0)',
    border: 'rgb(200, 200, 200)',
    notification: 'rgb(172, 11, 27)',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: 'normal' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    light: { fontFamily: 'System', fontWeight: '300' },
    thin: { fontFamily: 'System', fontWeight: '100' },
  }
};

////////////////////////////COPIADO////////////////////////////////////////////
/*
const brandPrimary = '#be0f2e'; // Granate US. rgba(190,15,46,255)
const brandPrimaryTap = '#AA001A'; //  Granate US más oscuro
const brandSecondary = '#feca1b'; // Amarillo US.rgba(254,202,27,255)
const brandSecondaryTap = '#EAB607'; // amarillo US más oscuro
const brandSuccess = '#95be05'; // verde US
const brandBackground = 'rgb(228, 227, 227)'; // gris claro

//Estilo general de la app
const navigationTheme = {
    dark: false,
    colors: {
      primary: brandSecondary,
      background: brandBackground,
      card: brandPrimary,
      text: '#ffffff',
      border: `${brandPrimary}99`,
      notification: `${brandSecondaryTap}ff`
    }
  };

  
  const navigationTheme2 = {
    dark: false,
    colors: {
      primary: 'blue',
      background: 'white',
      card: 'gray',
      text: 'black',
      border: 'red',
      notification: 'orange',
    },
  };


  
export { navigationTheme, navigationTheme2, brandPrimary, brandPrimaryTap, brandSecondary, brandSecondaryTap, brandSuccess, brandBackground }
*/