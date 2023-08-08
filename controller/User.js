import { User } from "../model/User.js"

export const fetchUserByid = async(req,res) => {
    const id  = req.user.id;
    try {
        const user = await User.findById(id);
        res.status(200).json({id:user.id,address:user.address,email:user.email,role:user.role});
    } catch (error) {
        res.status(400).json(error);
    }
}
export const updateUser =async (req,res) => {
    const { id } = req.params
    try {
        const user =await User.findByIdAndUpdate(id,req.body,{new:true});
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json(error);
    }
}