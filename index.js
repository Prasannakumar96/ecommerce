const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const {json,urlencoded} = require("express")
const userRouter = require("./routes/user")
const addressRouter = require("./routes/address")
const auth = require("./middlewares/auth")
const fileUpload = require("express-fileupload")
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_KEY)

const app = express()

app.use(json())
app.use(urlencoded({extended:false}))
app.use(cors())
app.use(auth)

const pay = async()=>{
  const customer = await stripe.customers.create({
    name : 'results[0].name',
    email : 'results@gmail.com',
    phone : 'results[0].phone'
  
})
console.log(customer)
}
pay()



const payment = async()=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 10999,
        currency: 'inr',
        payment_method_types: ['card'],
      });
      console.log(paymentIntent)
}
payment()

app.use(fileUpload())

app.use("/user",userRouter)
app.use("/address",addressRouter)

app.listen(4000)