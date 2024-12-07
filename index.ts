import { config } from 'dotenv';
import express from 'express';
import restApi from './rest-api';
config();

const rexCd = express();

rexCd.use(express.json());
rexCd.use(express.urlencoded({ extended: true }));
rexCd.use('/rest-api', restApi)


rexCd.listen(4455, () => {
    console.log('Server is running on port 4455');
});

