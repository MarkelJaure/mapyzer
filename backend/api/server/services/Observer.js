import chokidar from 'chokidar'
import EventEmitter from 'events'
import csv from 'csvtojson'
import LugarService from "./LugarService";
import DireccionService from "./DireccionService";
import ZonaService from "./ZonaService";
import TrayectoService from "./TrayectoService";
import * as XLSX from 'xlsx'
import * as Papa from "papaparse"
import {json} from "sequelize";

const eventEmiter = EventEmitter.EventEmitter;

class Observer extends eventEmiter {
    constructor() {
        super();
    }

    watchFolder(folder) {
        try {
            console.log(
                `[${new Date().toLocaleString()}] Watching for folder changes on: ${folder}`
            );

            var watcher = chokidar.watch(folder, {persistent: true, ignoreInitial: true});

            watcher.on('add', async (filePath) => {
                    console.log(`file ${filePath} has been added`)

                    const fileName = filePath.split('/').slice(-1)[0];

                    const fileExt = fileName.split('.').slice(-1)[0]

                    console.log('extenasd' + fileName + ' ' + fileExt)

                    const nroEsquema = fileName.split('-')[0]

                    if (fileExt === 'xlsx' || fileExt === 'xls') {
                        let data = readExcel(filePath)
                        data.forEach(value => {
                            console.log(value)
                            if (fileName.split('-')[0] === '1') {
                                console.log(1)
                                LugarService.addLugarFromCsv1(value, fileName.split('-')[1])
                            }
                            if (fileName.split('-')[0] === '2') {
                                console.log(2)
                                DireccionService.addDireccion(value, fileName.split('-')[1])
                                // LugarService.addLugarFromCsv2(lugar, fileName.split('-')[1])
                            }
                            if (fileName.split('-')[0] === '3') {
                                console.log(3)
                                // console.log(value)
                                ZonaService.addZonaFromCsv(value, fileName.split('-')[1])
                                // LugarService.addLugarFromCsv2(lugar, fileName.split('-')[1])
                            }
                            if (fileName.split('-')[0] === '4') {
                                console.log(3)
                                // console.log(value)
                                TrayectoService.addTrayectoFromCSV(value, fileName.split('-')[1])
                                // LugarService.addLugarFromCsv2(lugar, fileName.split('-')[1])
                            }
                        })


                    } else {
                        const content = await csv()
                            .fromFile(filePath)
                            .then((json) => {
                                json.forEach(value => {
                                    if (fileName.split('-')[0] === '1') {
                                        console.log(1)
                                        LugarService.addLugarFromCsv1(value, fileName.split('-')[1])
                                    }
                                    if (fileName.split('-')[0] === '2') {
                                        console.log(2)
                                        DireccionService.addDireccion(value, fileName.split('-')[1])
                                        // LugarService.addLugarFromCsv2(lugar, fileName.split('-')[1])
                                    }
                                    if (fileName.split('-')[0] === '3') {
                                        console.log(3)
                                        // console.log(value)
                                        ZonaService.addZonaFromCsv(value, fileName.split('-')[1])
                                        // LugarService.addLugarFromCsv2(lugar, fileName.split('-')[1])
                                    }
                                    if (fileName.split('-')[0] === '4') {
                                        console.log(3)
                                        // console.log(value)
                                        TrayectoService.addTrayectoFromCSV(value, fileName.split('-')[1])
                                        // LugarService.addLugarFromCsv2(lugar, fileName.split('-')[1])
                                    }
                                })
                            })
                    }

                }
            )
            ;
        } catch
            (error) {
            console.log(error);
        }
    }
}

function readExcel(filePath) {
    var workbook = XLSX.readFile(filePath)
    var first_sheet_name = workbook.SheetNames[0];
    console.log('Sheetname: ' + first_sheet_name)
    let worksheet = workbook.Sheets[first_sheet_name];
    let csvData = XLSX.utils.sheet_to_csv(worksheet)

    let resutData = Papa.parse(csvData,
        {
            delimiter: ",",
            header: true,
            complete: (result, file) => {
                console.log('resultdata: ' + result.data);
                return result.data;
            }
        })
    console.log(resutData.data)
    // console.log(csvData)
    return resutData.data
}

export default Observer
// module.exports = Observer;
