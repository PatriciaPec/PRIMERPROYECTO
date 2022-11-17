// Declaramos las variables necesarias
const API_Key = '7bae7df1124e89528bcd61e69a6ead69';
const miArray = [];
let respuesta = '';
let fecha = '';
let hora = '';
let opciones = { year: 'numeric', month: 'long', day: 'numeric' };
let fechasHoras = [];

const button = document.querySelector('button'); // Seleccionamos el botón
const h1 = document.querySelector('h1'); // Seleccionamos el h1

// Creamos la función que nos localizará mediante el método getCurrentPosition de Navigator y le pasaremos
// al método getData la ubicación
function geoFindMe() {
    navigator.geolocation.getCurrentPosition(getData);

    // Tras todo lo anterior removemos el botón y el h1
    button.remove();
    h1.remove();
}

// Llamamos a la función geoFindMe al hacer click en el botón
button.addEventListener('click', geoFindMe);

// Creamos la función encargada de obtener los datos de la API del tiempo
async function getData(position) {
    const { latitude, longitude } = position.coords; // Destructuramos la latitud y la longitud de position.coords
    let url = `http://api.openweathermap.org/data/2.5/forecast?units=metric$&lat=${latitude}&lon=${longitude}&appid=${API_Key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData(data); // Llamamos a la función setWeatherData y le pasamos data como parámetro
    } catch (error) {
        console.error(error);
    }
}

// Creamos la función que servirá para recorrer los datos obtenidos, sacará la información que necesitamos
// y la meterá en un array que hemos creado
async function setWeatherData(data) {
    try {
        for (const item of data.list) {
            miArray.push(item);
        }
        isRain(miArray); // Llamamos a la función isRain y le pasamos el array con toda la información que
                         // queremos para que compruebe si lloverá o no
    } catch (error) {
        console.error(error);
    }
}

// Función que mostrará si llueve o no dependiendo de la información obtenida de la API
function isRain(data) {
    
    
    // Creamos un bucle para recorrer el array con la información del tiempo
    for (const objeto of data) {   

        // Creamos un condicional para comprobar que el tiempo será lluvioso y en caso afirmativo
        // realizamos un formateo de la fecha y horas obtenidos de la API para mostrarlo en un formato
        // más amistoso al usuario
        if (objeto.weather[0].main === 'Rain') {
            fecha = new Date(objeto.dt_txt).toLocaleDateString('es', opciones);
            hora = objeto.dt_txt.substring(10, 19);
        // Al ternimar el bucle tenemos un array con las fechas y horas que llueve
            fechasHoras.push({
                fecha: fecha,
                hora: hora
            })
        }
    }
    
    let fechasSinDuplicados = groupBy(fechasHoras, 'fecha');
    for (const item in fechasSinDuplicados) {
        respuesta += `<h2>${item}</h2>`;
        
        for (const objeto of fechasSinDuplicados[item]) {
            respuesta += `<p>A la hora ${objeto.hora} se esperan lluvias</p>`;
        }
    }
    document.querySelector('section').innerHTML = respuesta; // Mostramos la respuesta en el HTML
}

// Creamos función para eliminar duplicados
function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];
  
      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
}
  