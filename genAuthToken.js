const jwt = require('jsonwebtoken');
require("dotenv").config();
const getAuthToken=(user)=>{
    const jwt_secret_key = process.env.JWT_SECRET_KEY 

    const token =jwt.sign({
        _id:user._id,
        name:user.name,
        email:user.email,
    },
    jwt_secret_key
    );
    return token;
}
module.exports=getAuthToken;