const express = require('express');
const router = express.Router();
const { addNew, addNote } = require('./tickets.model');

router.post(
    "/new",
    async (req, res)=>{
      try{
        let {tipo, observacion, servicio, identidad, nombre, correo} = req.body;
        let docInserted = await addNew(tipo, observacion, servicio, identidad, nombre, correo, 'Activo');
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

module.exports = router;