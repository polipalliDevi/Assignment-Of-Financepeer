if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require("express");
const bodyparser = require('body-parser');
const bcrypt= require('bcrypt')
const mongoose = require('mongoose');
const passport=require('passport')
const flash= require('express-flash')
const session= require('express-session')
const initilizePassport=require('./passport-config')
initilizePassport(passport,
    email=>users.find(user => user.email === email),
    id=>users.find(user => user.id === id)
)
const app=express()

const Data=require('./uploading')


app.use(express.static('public'))
app.use(express.urlencoded({extended:false}));
app.set("views", "./views")
app.set('view-engine','ejs')
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
const  users=[]
app.get("/", checkAuthenticated,async(req,res)=>{
    const datas= await Data.find()
    res.render("index.ejs",{datas});
})

app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs')
})
app.get('/register',checkNotAuthenticated,(req,res)=> {
    res.render('register.ejs')
})

app.post('/login',checkNotAuthenticated,passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true


}))

app.post('/register',checkNotAuthenticated,async(req,res)=>{
    try {
        const hashPassword = await bcrypt.hash(req.body.password,10)
        users.push({
        id:Date.now().toString(),
        name:req.body.name ,
        email:req.body.email,
        password:hashPassword
    })
    res.redirect('/login')
    } catch (error) {
        console.log(error)
    }
    console.log(users)
})
app.post('/logout',(req,res)=>{
    res.redirect('/login')
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/login')

    }
    next()
}
app.listen(5000)