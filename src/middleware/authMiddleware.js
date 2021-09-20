import jwt from 'jsonwebtoken';

exports.verifyToken = (req,res)=>{
  
}


exports.isLogedIn = async (req, res, next) => {
  try {
    if(req.cookies.jwt) {
      let decode = jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN)
  
      let currentUser = await User.findById(decode.id)
  
      // if(!currentUser) return next()
  
      // if user
      if(currentUser) req.user = user
      console.log(currentUser)
      next()
    }

  }catch(err) {
    console.log(err.messsage)
  }

}