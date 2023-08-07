export const isAuthenticated=(req, res, done)=> {
    if(req.user){
        done()
    }else{
        res.status(401).json({message: "Unauthorized"})
    }
}
export const sanitizeUser=(user)=>{
    return {
        id : user.id,
        role: user.role,
    }

}