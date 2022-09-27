const {MongoClient}=require("mongodb")
const {mongoConfig}=require("../config")
class mongoDb{
    static connectToDb=()=>{
        MongoClient.connect(mongoConfig.connectionURl).then(
            (connection)=>{
        console.log("connected")
        this.db=connection.db(mongoConfig.database)
            })
        .catch(err=>console.log(`not connected${err}`))
    }
}
mongoDb.db=null


module.exports=mongoDb