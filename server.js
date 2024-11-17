const express=require("express")
const app=express()
const dotenv = require("dotenv").config();
const port=process.env.PORT || 5001
const mysql=require('mysql2')
const{sendOtp}=require('./service')
const cors=require('cors')



//middleware
app.use(express.json())
app.use(cors())

const db= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Nethrabalan@04',
    database:'firstTry'
})


//connect
db.connect((err)=>{
    if(err)
    {
        console.log(err)
    }
    else{
        console.log('Connected to mysql')
    }
})


//table creation
const table=`CREATE TABLE IF NOT EXISTS OTP( ID int PRIMARY KEY AUTO_INCREMENT,otp varchar(5))`

db.query(table,(err,result)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('Table created')
    }
})
//otp generater
const generateotp = ()=>{
    return Math.floor(Math.random()*90000+10000).toString()
}

//otp verify
const verifyOtp=(otp,res)=>{
    const query = `SELECT ID FROM OTP WHERE otp=?`

    db.query(query, [otp], (err, result) => {
        if(err){
            console.log(err)
            return res.status(500).json({msg: 'Internal Server Error'})
        }
        if(result.length > 0){
            res.json({msg: 'OTP verified successfully'})
            const q=`delete from OTP where otp=?`

            db.query(q, [otp], (err, result) => {
                if(err){
                    console.log(err)
                    return res.status(500).json({msg: err})
                }
            })
        }
        else{
            res.status(401).json({msg: 'Invalid OTP'})
        }
    })
}
app.post("/send", async(req,res)=>{

    const {email}=req.body
    if(!email){
        return res.status(400).json({msg: 'Email is required'})
    }
    const otp=generateotp()
    try{
        await sendOtp(email,otp)
        db.query('INSERT INTO OTP (otp) VALUES (?)', [otp], (err, result) => {
            if(err){
                console.log(err)
                return res.status(500).json({msg: 'Internal Server Error'})
            }
            res.json({msg: 'OTP sent successfully'})
        })
    }
    catch(error){
        console.log(error)
    }

})

app.post("/verify",async(req,res)=>{
    const {otp}=req.body
    if(!otp){
        return res.status(400).json({msg: 'OTP is required'})
    }
    
    verifyOtp(otp,res)
})

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.port}`)
})