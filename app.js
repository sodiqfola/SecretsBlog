//jshint esversion:8
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/SecretsUserDB');

const SecretsUserSchema = new mongoose.Schema({
    email: String,
    password: String
});

SecretsUserSchema.plugin(encrypt, {secret: process.env.KEY, encryptedFields:['password']});
const SecretUser = new mongoose.model('SecretUser', SecretsUserSchema);
app.get('/', function(req, res){
    res.render('home');
});

app.route('/login')
    .get(function(req, res){
        res.render('login');
    })
    .post(function(req, res){
        const email = req.body.email;
        const password = req.body.password;
        SecretUser.findOne({email: email},function(err, foundUser){
            if(err){
                console.log(err);
            }else{
                if(foundUser){
                    if(foundUser.password === password){
                        res.render('secrets');
                    }
                }
            }
        });
    });

app.route('/register')
    .get(function(req, res){
        res.render('register');
    })
    .post(function(req, res){
        const newUser = new SecretUser({
            email: req.body.email,
            password: req.body.password
        });
        newUser.save(function(err){
            if(err) {
                console.log(err);
            }else{res.render('secrets');}    
        });
    });





app.listen(3500, function(){
    console.log('listening on port 3500');
});