const mongodb=require("./MongoDb.services")
const mongoConfig=require("../config")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const tokenSecret=require("../config")
const { query } = require("express")

const userregister=async(user)=>{

   
  try{ 

    if(!user.username||!user.email||!user.password)
    return{
        status:false,message:"please fill all field"
    }
    const passwordhash=await bcrypt.hash(user.password,10)
    
    let userObject={
        email:user.email,
        username:user.username,
        password:passwordhash
    }
    let savedUsers=await mongodb.db.collection(mongoConfig.mongoConfig.collections.USERS).insertOne(userObject)
    if(savedUsers.acknowledged && savedUsers.insertedId)
    {

        let token=jwt.sign({username:userObject.username,email:userObject.email},"fooDelivery",{expiresIn:"24h"});
        return{
            status:true,message:"registered successfully",data:token
        }
    }
    else{
        return{
            status:false,message:"registration unsuccessfully"
        }
        
    }
    }
    catch(error){
        return{
            status:false,message:"registration unsuccessfully"
        }
    }
 
}
const userLogin=async(user)=>{
    try{
        if(!user.username||!user.password)
        return{
            status:false,message:"please fill all field"
        }
        let userObject=await mongodb.db.collection(mongoConfig.mongoConfig.collections.USERS).findOne({username:user.username})
        if(userObject){
            let isuserVerified=await bcrypt.compare(user.password,userObject.password)
            if(isuserVerified){
                let token=jwt.sign({username:userObject.username,email:userObject.email},"fooDelivery",{expiresIn:"24h"});
                return{
                    status:true,message:"login successfully",data:token
                }

            }
            else{
               return{ status:false,message:"incorrect password"}
            }
           

        }
        else{
            return{
                status:false,message:"login unsuccessfully"
            }

        }

    }
    catch(error){
        console.log(error)
        return{
            status:false,message:"no user found"
        }
        

    }

}
const userExist=async(query)=>{
    let messages={
        email:"this mail is already used",
        username:"user name taken"
    }
    try {
        let queryType=Object.keys(query)[0];

        let userObject=await mongodb.db.collection(mongoConfig.mongoConfig.collections.USERS).findOne(query)
        console.log(userObject)
        return (!userObject?
            {status:true,message:`this ${queryType} not taken`}:
            {status:false,message:messages[queryType]}
        )
        
    } catch (error) {
        
    }



}
module.exports={userregister,userLogin,userExist}