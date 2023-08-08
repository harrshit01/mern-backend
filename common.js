import passport from "passport";

export const isAuthenticated=(req, res, done)=> {
    if(req.user){
        console.log(req.user)
        done()
    }else{
        res.status(401).json({message: "Unauthorized"})
    }
    // return passport.authenticate('jwt');
}
export const sanitizeUser=(user)=>{
    return {
        id : user.id,
        role: user.role,
    }

}
export const cookieExtractor = (req)=> {
    let token = null;
    console.log(req.cookies);
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  };