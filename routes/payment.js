const e = require("express")
const express = require("express")

const stripe = require("stripe")(process.env.STRIPE_KEY)

const sql = require("../db")

const router = express.Router()

router.post("/saveCustomer",async (req,res)=>{
    try{
        if(req.isAuth){
            const selectUser = `SELECT * FROM users WHERE if=${req.userId}`
            sql.query(selectUser,async (err,results)=>{
                if(err){
                    res.send(err)
                    return
                }
                const customer = await stripe.customers.create({
                    name : results[0].name,
                    email : results[0].email,
                    phone : results[0].phone
                })
                const saveCustomer = `INSERT INTO customers (userId,cId,balance,payment_source,currency) VALUE (${req.userId},"${customer.Id}",${customer.balance},"${customer.default_source}","${customer.currency}")`
                sql.query(saveCustomer,(err,result)=>{
                    if(err){
                        res.send(err)
                        return
                    }
                    else{
                        res.send(result)
                        return
                    }
                })
            })
           
        }
        else{
            res.send("please login")
            return
        }
    }
    catch(err){
        res.send(err)
        return
    }
})


router.post("/paymentMethod",async (req,res)=>{
    try{
        if(req.isAuth){
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                  number: req.body.number,
                  exp_month: req.body.month,
                  exp_year: req.body.year,
                  cvc: req.body.cvc,
                }
              })
              const insertQuery =  `INSERT INTO paymentMethods (userId,pmId,fingerprint,last4,exp_year,exp_month) VALUES (${req.userId},"${paymentMethod.Id}","${paymentMethod.card}","${paymentMethod.card.last4}","${paymentMethod.card.exp_month}","${paymentMethod.card.exp_year}")`
              sql.query(insertQuery,(err,result)=>{
                if(err){
                    res.send(err)
                    return
                }
                else{
                    res.send(result)
                    return
                }
            })
        }else{
            res.send({err:"please login"})
        }
    }
    catch(err){
        res.send(err)
        return
    }
})

module.exports = router