const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var fetchUser = require('../middleware/fetchUser')

const JWT_SECRET = 'Jatin@i@d$hello';

//Route 1: to create user via post
router.post('/create-user', async (req, res)=>{
    let success=false;
    // genrating salt 
    const salt = await bcrypt.genSalt(10);
    // hashing password
    const secPassword = await bcrypt.hash(req.body.password, salt);
    
    //checking for user with same email
    let user = await User.findOne({email: req.body.email})
    try {
        //responding with error if user exist with same email
        if(user){
            return res.status(400).json({ success, error: 'Sorry a user with this email already exists'})
        }

        //creating new user
        user = await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
        })

        //data part of jwt
        const data ={
            user:{
                id: user.id
            }
        }

        //siging and genrating auth token for user
        const authToken = jwt.sign(data, JWT_SECRET)
        success=true;
        return res.json({success, authToken})
    } catch (error) {
        return res.status(500).json({success, error:'Someting went wrong :('});
    }
})

//Route 2: to log a user in via post
router.post('/user-login', async (req, res)=>{
    let success=false;
    //destructuring email and password from request 
    const {email, password} = req.body;

try {
    //searching user with the requested email in db
    let user = await User.findOne({email});
    //returning a error if no such user exist
    if(!user){
        return res.status(404).json({success, error: "Invalid credentials"});
    }

    //comparing password send via request with the password with the email(send via request) given in db
    const passwordCompare = await bcrypt.compare(password, user.password);

    //returing error if passwords did'nt match
    if(!passwordCompare){
        return res.status(400).json({success, error: "Invalid credentials"});
    }
    
    const data ={
        user:{
            id: user.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    
    //returning auth-token
    success=true;
    return res.json({success, authToken})

} catch (error) {
    return res.status(500).json({success, error:'Someting went wrong :('});
}    
    
})

//Route 3: to get user details @login required
router.post('/get-user', fetchUser, async (req, res)=>{
    let success=false;
    try {
        //decoded id of user form jwt send using header validated using middleware fetchUser
        userId = req.user.id;
        
        //getting user details except password from db
        const user = await User.findById(userId).select('-password');
        success=true;
        return res.send({success, user})

    } catch (error) {
        return res.status(500).json({success, error:'Someting went wrong :('});
    }
})

module.exports = router