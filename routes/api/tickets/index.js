const express = require('express');
const router = express.Router();
const { 
  addNew, 
  addNote, 
  captureTicket, 
  cerrar, 
  evaluar,
  getTicketsByUser,
  getTicketsByHolder,
  getTickets,
  getTicketsAge,
  getTicketById
} = require('./tickets.model');

router.post(
  "/new",
  async (req, res)=>{
    try{
      let {tipo, observacion, servicio, usuario} = req.body;
      usuario = JSON.parse(usuario); // Convierte un String a un objeto JSON, el parametro viene escrito con la estructura de un JSON ejemplo {"identidad":"0827123412345", "nombre":"Scarlett Raquel","correo":"sraquel@gmail.com"}
      let docInserted = await addNew(tipo, observacion, servicio, usuario, 'ACT');
      res.status(200).json(docInserted);
    }catch(ex){
      res.status(500).json({"msg":"Error"});
    }
  }
);

router.put(
  "/addnote/:id",
  async (req, res)=>{
    try {
      const { id } = req.params;
      let {observacion, accion, user} = req.body;
      user = JSON.parse(user); 
      let result = await addNote(id, observacion, accion, user);
      res.status(200).json(result);
    } catch (ex) {
      res.status(500).json({"msg":"Error"});
    }
  }
);

router.put(
  "/captureticket/:id",
  async (req, res)=>{
    try {
      const { id } = req.params;
      let { user } = req.body;
      user = JSON.parse(user);
      let result = await captureTicket(id, user);
      res.status(200).json(result);
    } catch (ex) {
      res.status(500).json({"msg":"Error"});
    }
  }
);

router.put(
  "/cerrar/:id",
  async (req, res)=>{
    try {
      const { id } = req.params;
      let { user, tipoCierre} = req.body;
      user = JSON.parse(user);
      let result = await cerrar(id, user, tipoCierre);
      res.status(200).json(result);
    } catch (ex) {
      res.status(500).json({"msg":"Error"});
    }
  }
);

router.put(
  "/evaluar/:id",
  async (req, res)=>{
    try {
      const { id } = req.params;
      const { eficiencia, satisfaccion, conformidad} = req.body;
      let result = await evaluar(id, eficiencia, satisfaccion, conformidad);
      res.status(200).json(result);
    } catch (ex) {
      res.status(500).json({"msg":"Error"});
    }
  }
);

router.get(
  "/getbyuser/:estado/:page",
  async (req, res)=>{
    try {
      let {estado, page} = req.params;
      let {user} = req.body;
      page = parseInt(page);
      user = JSON.parse(user);
      let result = await getTicketsByUser(user, estado, page);
      res.status(200).json({...result, page, estado});
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);

router.get(
  "/getbyholder/:estado/:page",
  async (req, res)=>{
    try {
      let {estado, page} = req.params;
      let {holder} = req.body;
      page = parseInt(page);
      holder = JSON.parse(holder);
      let result = await getTicketsByHolder(holder, estado, page);
      res.status(200).json({...result, page, estado});
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);

router.get(
  "/gettickets/:estado/:page",
  async (req, res)=>{
    try {
      let {estado, page} = req.params;
      page = parseInt(page);
      let result = await getTickets(estado, page);
      res.status(200).json({...result, page, estado});
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);

router.get(
  "/getticketsage/:estado/:page",
  async (req, res)=>{
    try {
      let {estado, page} = req.params;
      page = parseInt(page);
      let result = await getTicketsAge(estado, page);
      res.status(200).json({...result, page, estado});
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);

router.get(
  "/getbyid/:id",
  async (req, res)=>{
    try {
      let { id } = req.params;
      let row = await getTicketById(id);
      res.status(200).json(row);
    } catch (ex) {
      res.status(500).json({ "msg": "Error" });
    }
  }
);

module.exports = router;