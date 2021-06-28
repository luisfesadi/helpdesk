const MongoDB = require('../../utilities/db');
const ObjectId = require('mongodb').ObjectId;
let db;
let helpdeskCollection;

(async function(){
    try{
      if (!helpdeskCollection) {
        db = await MongoDB.getDB();
        helpdeskCollection = db.collection("helpdesk");
        if(process.env.ENSURE_INDEX == 1){
          // Vamos a asegurarnos de que exista el indice
        }
      }
    }catch(ex){
      console.log(ex);
      process.exit(1);
    }
})();

module.exports.addNew = async (tipo, observacion, servicio, identidad, nombre, correo, estado)=>{
  try {
    let newTicket = {
      fecha: new Date().getTime(),
      tipo: tipo,
      observacion: observacion,
      servicioAfectado: servicio,
      usuario: { 
        identidad: identidad,
        nombre: nombre,
        correo: correo
      },
      holder: [],
      estado: estado,
      notas:[],
      fechaCierre: "",
      usuarioCierre: {},
      tipoCierre: "",
      evaluacion: {}
    };
    let result = await helpdeskCollection.insertOne(newTicket);
    return result.ops;
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.addNote = async (id, observacion, accion, identidad, nombre, correo) => {
  try {
    const fecha = new Date().getTime();
    const _id = new ObjectId(id);
    const filter = { "_id": _id };
    const updateObj = { 
      "$push": 
      {
        "notas": {
          "fecha": fecha,
          "observacion": observacion,
          "accion": accion,
          "usuario": {
            "identidad": identidad,
            "nombre": nombre,
            "correo": correo
          }
        }
      } 
    };
    let result = await helpdeskCollection.updateOne(filter, updateObj);
    return result;
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.captureTicket = async (id, identidad, nombre, correo) => {
  try {
    const _id = new ObjectId(id);
    const filter = { "_id": _id };
    const updateObj = { 
      "$push": //Duda en si es $set o $push, si se pueden almacenar varios o solo uno puede reclamarlo
      {
        "holder": {
          "identidad": identidad,
          "nombre": nombre,
          "correo": correo
        }
      }
    };
    let result = await helpdeskCollection.updateOne(filter, updateObj);
    return result;
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.cerrar = async (id, identidad, nombre, correo, tipoCierre) => {
  try {
    const fecha = new Date().getTime();
    const _id = new ObjectId(id);
    const filter = { "_id": _id };
    const updateObj = { 
      "$set": 
      {
        "fechaCierre": fecha,
        "usuarioCierre": {
          "identidad": identidad,
          "nombre": nombre,
          "correo": correo
        },
        "tipoCierre": tipoCierre
      }
    };
    let result = await helpdeskCollection.updateOne(filter, updateObj);
    return result;
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.evaluar = async (id, eficiencia, satisfaccion, conformidad) => {
  try {
    const _id = new ObjectId(id);
    const filter = { "_id": _id };
    const updateObj = {
       "$set":
       {
         "evaluacion":
         {
           "eficiencia": eficiencia,
           "satisfaccion": satisfaccion,
           "conformidad": conformidad
         }
       }  
    };
    let result = await helpdeskCollection.updateOne(filter, updateObj);
    return result;
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}