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

