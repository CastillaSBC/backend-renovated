import getService from '../controllers/service/status';
import getUsers from '../controllers/service/users';
import {Router} from 'express';

const service = Router();

service.get('/', async (req, res) => await getService(req, res));
service.get('/data/users', async (req, res) => await getUsers(req, res));
export default service;
