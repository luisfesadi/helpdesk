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

module.exports.addNew = async (tipo, observacion, servicio, usuario, estado)=>{
  try {
    let newTicket = {
      fecha: new Date().getTime(),
      tipo: tipo,
      observacion: observacion,
      servicioAfectado: servicio,
      usuario: { 
        identidad: usuario.identidad,
        nombre: usuario.nombre,
        correo: usuario.correo
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

module.exports.addNote = async (id, observacion, accion, user) => {
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
            "identidad": user.identidad,
            "nombre": user.nombre,
            "correo": user.correo
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

module.exports.captureTicket = async (id, user) => {
  try {
    const _id = new ObjectId(id);
    const filter = { "_id": _id };
    const updateObj = { 
      "$set": //Duda en si es $set o $push, si se pueden almacenar varios o solo uno puede reclamarlo
      {
        "holder": {
          "identidad": user.identidad,
          "nombre": user.nombre,
          "correo": user.correo
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

module.exports.cerrar = async (id, user, tipoCierre) => {
  try {
    const fecha = new Date().getTime();
    const _id = new ObjectId(id);
    const filter = { "_id": _id };
    const updateObj = { 
      "$set": 
      {
        "fechaCierre": fecha,
        "usuarioCierre": {
          "identidad": user.identidad,
          "nombre": user.nombre,
          "correo": user.correo
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

let itemsPerPage = 25; //Variable global para la cantidad de registros por pagina

module.exports.getTicketsByUser = async (user, estado, page) => {
  try {
    let options = {
      skip: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
      projection: {
        fecha:1, 
        tipo:1, 
        observacion:1,
        servicioAfectado:1,
        usuario:1,
        holder:1,
        notas:1
      }, //Los campos a mostrar
      sort: [["fecha", -1]] //muestra los registros por fecha descendente
    };
    console.log(user.identidad);
    let filter = { 
      "usuario": {
        "identidad": user.identidad,
        "nombre": user.nombre,
        "correo": user.correo
      }, 
      "estado": estado 
    };

    let docsCursor = helpdeskCollection.find(filter, options);
    let rownum = await docsCursor.count();
    let rows = await docsCursor.toArray();
    return {rownum, rows};
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.getTicketsByHolder = async (user, estado, page) => {
  try {
    let options = {
      skip: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
      projection: {
        fecha:1, 
        tipo:1, 
        observacion:1,
        servicioAfectado:1,
        usuario:1,
        holder:1,
        notas:1
      }, //Los campos a mostrar
      sort: [["fecha", -1]] //muestra los registros por fecha descendente
    };
    console.log(user.identidad);
    let filter = { 
      "holder": {
        "identidad": user.identidad,
        "nombre": user.nombre,
        "correo": user.correo
      }, 
      "estado": estado 
    };

    let docsCursor = helpdeskCollection.find(filter, options);
    let rownum = await docsCursor.count();
    let rows = await docsCursor.toArray();
    return {rownum, rows};
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.getTickets = async (estado, page) => {
  try {
    let options = {
      skip: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
      projection: {
        fecha:1, 
        tipo:1, 
        observacion:1,
        servicioAfectado:1,
        usuario:1,
        holder:1,
        notas:1
      }, //Los campos a mostrar
      sort: [["fecha", -1]] //muestra los registros por fecha descendente
    };
    
    let filter = { 
      "estado": estado
    };

    let docsCursor = helpdeskCollection.find(filter, options);
    let rownum = await docsCursor.count();
    let rows = await docsCursor.toArray();
    return {rownum, rows};
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.getTicketsAge = async (estado, page) => {
  try {
    let options = {
      skip: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
      projection: {
        fecha:1, 
        tipo:1, 
        observacion:1,
        servicioAfectado:1,
        usuario:1,
        holder:1,
        notas:1
      }, //Los campos a mostrar
      sort: [["fecha", -1]] //muestra los registros por fecha descendente
    };

    let filter = {
      "estado":estado 
    };

    let docsCursor = helpdeskCollection.find(filter, options);
    let rownum = await docsCursor.count();
    let rows = await docsCursor.toArray();
    return {rownum, rows};
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}

module.exports.getTicketById = async (id) => {
  try {
    const _id = new ObjectId(id);
    const filter = { "_id": _id };
    let row = helpdeskCollection.findOne(filter);
    return row;
  } catch (ex) {
    console.log(ex);
    throw(ex);
  }
}