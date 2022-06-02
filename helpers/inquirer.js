const inquirer = require('inquirer');
require('colors');

const menuOpts = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }

    ]
    }
]


const inquirerMenu = async()=>{
    console.clear();
    console.log('========================='.green);
    console.log('Seleccione una opcion'.white);
    console.log('=========================\n'.green);

    const {opcion} = await inquirer.prompt(menuOpts);
    return opcion;
}

const pausar = async()=>{
    const continuar = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar `,
        }
    ]
    console.log('\n');
    await inquirer.prompt(continuar);
}

const leerInput = async (message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }

        }

    ];
    const {desc} = await inquirer.prompt(question);
    return desc;
}
const confirmar = async () => {
    const question = [
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Esta seguro de borrar esta tarea?'
        }
    ]
    const {confirm} = await inquirer.prompt(question);

    return confirm;
}

const listarLugares = async(lugares = []) => {

    const choices = lugares.map((lugar, i) => {

        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`

        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar: ',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas);

    return id;

}   

const mostrarListadoChecklist = async(tareas = []) => {

    const choices = tareas.map((tarea, i) => {

        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false

        }
    });

    

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(pregunta);

    return ids;

}
module.exports = {
    inquirerMenu,
    pausar,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}