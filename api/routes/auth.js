const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../authValidation/generateTokens");
const { verify } = require("../authValidation/authVerify");

// Register
router.post("/register", async (req, res) => {
    try{
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username:  req.body.username,
            email:     req.body.email,
            password:  hashedPassword,
        });
    
        // save user and return response
        const user = await newUser.save();
        res.status(200).json(user);

    }catch(err){
        res.status(500).json("Failed to register the user")
    }

});

// LOGIN
router.post("/login", async (req, res) => {
    try{
        // validate the req.body data
        const user = await User.findOne({email: req.body.email});
        if (!user){
            return res.status(404).json("User not found")
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword){
            return res.status(400).json("Wrong password")
        }

        //Generate an access token
        const accessToken = generateAccessToken({id: user._id, username: user.username, email: user.email});
        const refreshToken = generateRefreshToken({id: user._id, username: user.username, email: user.email});
        
        await user.updateOne({$set: {refreshToken: refreshToken}});

        res.status(200).json({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

    }catch(err){
        res.status(500).json("Failed to login user")
    }

})


// Logout
router.post("/logout", verify, async (req, res) => {
    try{
        const user = User.findOne({email: req.body.email})
        await user.updateOne({$set: {refreshToken: ""}});

        res.status(200).json("You logged out successfully.");
    }catch(err){
        res.status(500).json("Failed to logout user")
    }
})

module.exports = router;
