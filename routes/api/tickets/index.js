const express = require('express');
const router = express.Router();
const { 
  addNew, 
  addNote, 
  captureTicket, 
  cerrar, 
  evaluar
} = require('./tickets.model');

router.post(
  "/new",
  async (req, res)=>{
    try{
      let {tipo, observacion, servicio, identidad, nombre, correo} = req.body;
      let docInserted = await addNew(tipo, observacion, servicio, identidad, nombre, correo, 'ACT');
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
      const {observacion, accion, identidad, nombre, correo} = req.body;
      let result = await addNote(id, observacion, accion, identidad, nombre, correo);
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
      const { identidad, nombre, correo } = req.body;
      let result = await captureTicket(id, identidad, nombre, correo);
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
      const { identidad, nombre, correo, tipoCierre} = req.body;
      let result = await cerrar(id, identidad, nombre, correo, tipoCierre);
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

module.exports = router;