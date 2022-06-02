require('dotenv').config();

const {leerInput, inquirerMenu, pausar, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const main = async()=>{
    let opt;
    const busquedas = new Busquedas(); 
    do{
        opt = await inquirerMenu();

        switch(opt){

            case 1:
                //Mostrar msj
                const termino = await leerInput('Ciudad: ');
                

                //Buscar los lugares
                
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id ==='0') continue;

                //Guardar en DB

                const lugarSeleccionado = lugares.find(l => l.id === id);

                
                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                

                //CLima
                console.log('Buscar clima'.red);
                const clima = await busquedas.buscarClima(lugarSeleccionado.lat,lugarSeleccionado.lng);

                //console.log('El clima es: '.red, clima);
                //Mostrar resultados

                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:',lugarSeleccionado.nombre.green);
                console.log('Lat:',lugarSeleccionado.lat);
                console.log('Lng:',lugarSeleccionado.lng);
                console.log('Temperatura:',clima.temp);
                console.log('Descripcion:',clima.desc.green);
                console.log('Minima:',clima.min);
                console.log('Maxima:',clima.max);
            
            break;
            
            case 2: 
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
            break;

                
        }


        if(opt !== 0) await pausar();

    }while(opt !== 0);
    


}

main();