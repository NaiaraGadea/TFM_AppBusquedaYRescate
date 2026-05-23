// Backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//import casesRouter from './routes/cases.js';
//import alertsRouter from './routes/alerts.js';
//import desaparecidosRouter from './routes/desaparecidos.js';
//import searchsRouter from './routes/searchs.js';

import alertsRouter from './routes2/alerts.js';
import casesRouter from './routes2/cases.js';
import foundCasesRouter from './routes2/found_cases.js';
import groupMembersRouter from './routes2/group_members.js';
import missingPeopleRouter from './routes2/missing_people.js';
import peopleRouter from './routes2/people.js';
import reportersRouter from './routes2/reporters.js';
import rescueGroupsRouter from './routes2/rescue_groups.js';
import searchParticipantsRouter from './routes2/search_participants.js';
import searchesRouter from './routes2/searches.js';
import usersRouter from './routes2/users.js';


dotenv.config();
const app = express();

// enlace donde escuchará el backend: http://localhost8081, http://localhost8082, http://localhost8083
//app.use(cors({ origin: process.env.CORS_ORIGIN || '*'})); // Si solo usásemos un único localhost

//const cors = require("cors");
const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(cors({
  origin: function(origin,callback){
    if(!origin||allowedOrigins.includes(origin)){
      callback(null,true);
    }else{
      callback(new Error("Origen no permitido por CORS, error en url"))
    }
  }
}))


app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, service: 'AlertRes API' }));
app.use('/cases', casesRouter);
app.use('/alerts', alertsRouter);
app.use('/found_cases', foundCasesRouter);
app.use('/group_members', groupMembersRouter);
app.use('/missing_people', missingPeopleRouter);
app.use('/people', peopleRouter);
app.use('/reporters', reportersRouter);
app.use('/rescue_groups', rescueGroupsRouter);
app.use('/search_participants', searchParticipantsRouter);
app.use('/searches', searchesRouter);
app.use('/users', usersRouter);


const port = Number(process.env.PORT || 4000);
app.listen(port, "0.0.0.0",() => {
  console.log(`AlertRes API escuchando en http://192.168.0.206:${port}`);
});
