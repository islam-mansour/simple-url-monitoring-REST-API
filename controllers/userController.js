const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const User = require("../models/user");
const Hashes = require("../models/hashes");


module.exports = {
    register: async (req, res) => {
        try {
            const { first_name, last_name, email, password } = req.body;
            const oldUser = await User.findOne({ email });
        
            if (oldUser) {
              return res.status(409).send("User Already Exist. Please Login");
            }
        
            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);
        
            const user = await User.create({
              first_name,
              last_name,
              email: email.toLowerCase(), // sanitize: convert email to lowercase
              password: encryptedPassword,
            });
        
            // Create token
            const token = jwt.sign(
              { user_id: user._id, email },
              process.env.TOKEN_KEY,
              {
                expiresIn: process.env.JWT_EXPIRE,
              }
            );
            user.token = token;
        
            res.status(201).json(user.populate({path: 'checksCreated', select: 'name url status'}));
          } catch (err) {
            console.log(err);
          }
    },

    login: async (req, res) => {
        try {
            let { email, password } = req.body;
        
            if (!(email && password)) {
              res.status(400).send("All inputs are required");
            }
            email = email.toLowerCase();
            const user = await User.findOne({ email });
        
            if (user && (await bcrypt.compare(password, user.password))) {
              const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: process.env.JWT_EXPIRE,
              }
              );
        
              user.token = token;
              const data = await user.populate({path: 'checksCreated', select: 'name url status'});
              res.status(200).json(data);
            }
            res.status(400).send("Invalid Credentials");
          } catch (err) {
            console.log(err);
          }
    },

    send: (req, res) => {
        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        
        const user_email = req.query.to.toLowerCase();
        encryptedHash = (Math.random() + 1).toString(36).substring(2)
        
        const hash = Hashes.create({
            email: user_email,
            hash: encryptedHash
        })
        
        host=req.get('host');
        link="http://"+ host +"/user/verify?hash="+encryptedHash;
        mailOptions={
            to : user_email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        }
        
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
                res.send("error");
            }else{
                console.log("Message sent: " + response.message);
                res.send("sent");
            }
        });
    },

    verify: async (req, res) => {
        encryptedHash = req.query.hash;
        try{
            let ret = await Hashes.findOne({hash: encryptedHash});
            user = await User.findOne({ email: ret.email });
            user.verified = true;
            user.save();
            res.end('verified')
        }catch(err){
            res.end('error');
        }
    }
}
