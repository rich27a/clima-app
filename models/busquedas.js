const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath ='./db/database.json';

    constructor(){
        // TODO: leer DB si existe 
        this.leerDB();
    }

    get historialCapitalizado(){
        //capitalizar cada palabra
        let historialCapitalizado = [];
        historialCapitalizado = this.historial.slice().map(lugar => {
            return lugar.charAt(0).toUpperCase() + lugar.slice(1);
        })
        //console.log('Historial capitalizado'.green, historialCapitalizado);
        return historialCapitalizado;
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsOpenWeather(){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }
    

    async ciudad(lugar = ''){
        try {
            //peticion http

            console.log('Haciendo peticion http'.red,lugar);
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            
            return [];

        }
    }

    async buscarClima(lat, lon){

        try {
            console.log('HISTORIAL CAPITALIZADO'.red, this.historialCapitalizado);
            
            console.log('Buscando clima'.red);
            //instance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.paramsOpenWeather,
                    'lat': lat,
                    'lon': lon,
                }
            });
            //resp.data
            const resp = await instance.get();

            //console.log('Este son los datos del clima: '.red, resp.data);

            return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp
            }
            
        } catch (error) {
            
        }


    }

    agregarHistorial(lugar = ''){
        //TODO prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
        
    }

    leerDB(){
        if(fs.existsSync(this.dbPath)){
            const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
            const data = JSON.parse(info);
            this.historial = data.historial;
        }
    }


}


module.exports = Busquedas;