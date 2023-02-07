import cron from 'node-cron'
import DireccionService from "../services/DireccionService";
import LugarService from "../services/LugarService";

class Scheduler {
    static async searchDirections(){
        let task = cron.schedule('*/5 * * * * *', async () => {
            let direction = await DireccionService.getDirUnprceced();
            if (direction){
                // console.log(direction.id)
                direction.procesado = true
                await DireccionService.updateDirection(direction)
                await LugarService.addLugarFromCsv2(direction, direction.proyecto_id)
            } else {
                console.log('No hay direcciones para procesar.')
            }
            console.log('Running a task every 5 second ' +Date.now());
        }, {
            scheduled: true
        });
        task.start;
    }
}

export default Scheduler
