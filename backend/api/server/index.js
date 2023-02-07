import config from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import path from 'path'
import routes from './routes'
import Observer from "./services/Observer";
import Scheduler from "./utils/Scheduler";

let observer = new Observer();

config.config()

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/files', express.static(path.resolve(__dirname, '.', 'files')))
app.use(routes)

observer.on('file-added', log => {console.log(log.message)})
observer.watchFolder(path.resolve(__dirname, '.', 'files'))

//Scheduler.searchDirections().then(()=>console.log('Initializing Scheduler'));

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

export default app;