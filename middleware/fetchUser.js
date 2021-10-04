const jwt = require('jsonwebtoken')

//middleware for authentication 
const JWT_SECRET = 'Jatin@i@d$hello';

const fetchUser = (req, res, next)=>{

    // Getting user from jwt token and add id to req object
    const token = req.header('auth-token');

    if (!token){
        res.status(401).send({error: 'Please authenticate using a valid token'})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
        
    } catch (error) {
        return res.status(401).send({error: 'Please authenticate using a valid token'}) 
    }
   
}

module.exports = fetchUser;