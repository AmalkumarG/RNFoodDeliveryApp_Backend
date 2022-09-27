var express = require('express');
var router = express.Router();
const {userregister,userLogin,userExist}=require("../Services/authentication.services")

router.post('/register', async(req, res, next)=> {
    let body=req.body
    let response=await userregister(body)
    res.json(response)
 
});
router.post('/login', async(req, res, next)=> {
    let body=req.body
    let response=await userLogin(body)
    res.json(response)
 
});
router.get('/user_exist', async(req, res, next)=> {
    let params=req.query
    let response=await userExist(params)
    res.json(response)
 
});

module.exports = router;
