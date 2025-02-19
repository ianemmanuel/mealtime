import { Router } from "express"

const subScriptionRouter = Router()


subScriptionRouter.get('/',(req,res)=> res.send({ title: 'GET all subscriptions'}))

subScriptionRouter.get('/:id',(req,res)=> res.send({ title: 'GET subscription details'}))

subScriptionRouter.get('/customer/:id',(req,res)=> res.send({ title: 'GET subscription details'}))

subScriptionRouter.post('/',(req,res)=> res.send({ title: 'CREATE all subscriptions'}))

subScriptionRouter.put('/:id',(req,res)=> res.send({ title: 'UPDATE subscription details'}))

subScriptionRouter.delete('/:id',(req,res)=> res.send({ title: 'DELETE subscription details'}))

export default subScriptionRouter