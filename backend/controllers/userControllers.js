const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    })
};

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, pic } = req.body;
    const userExists = await User.findOne({ email });   //If user given email exists then throw error

    if (userExists) {
        res.status(400)
        throw new Error("User Already Exits");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    })

    if (user) {
        res.status(201)
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(400);
        throw new Error('User creation failed!')
    }

});

const authUser = asyncHandler(async (req, res) => {
    const { password, email } = req.body.Userdata;
    const user = await User.findOne({email});
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });

    } else {
        console.log("error")
        res.status(400);
        throw new Error('Invalid Email or Password!')
    }

});

// using search query to extract serach paramater ?search = prerna
const getallUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search?{
         $or:[
            // if name or email matches with the keyword . i means case sensitive
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
         ]
    }:{};

    const user = await User.find( keyword ).find({_id:{$ne:req.user._id}});
    // exclude the user logged in. 
   
    res.send(user)
});


module.exports = { registerUser, authUser, getallUsers }
