const nodemailer = require('nodemailer')
const mysql=require('mysql2')
const dotenv = require('dotenv').config()


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
})


const sendOtp=(email,otp)=>{
    const mail={
        from: 'nethrabalan05@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp} it is valid for 5 mins`
    }

    transporter.sendMail(mail)
    
}

module.exports= {sendOtp}