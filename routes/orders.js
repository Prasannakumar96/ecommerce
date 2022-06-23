const express = require("express")

const connection = require("../db")

const ordersTable = "orders"

const router = express.Router()

router.post("/createOrder",(req,res)=>{
    if(req.isAuth){
        const query =`INSERT INTO ${ordersTable} (cart,address,paymentId,userId,coupon,total,discount) VALUES(${req.body.cart},${req.body.address},${req.body.paymentId},${req.userId},${req.body.total},${req.body.discount},${req.body.coupon})`

        connection.query(query,(err,result)=>{
            if(err){
                res.send(err)
                return
            }
            else{
                res.send(result)
                return
            }
        })
    }
    else{
        res.setEncoding({err:"please login"})
        return
    }
})


router.get("/order",(req,res)=>{
    if(req.isAuth){
        const getOrder = `SELECT * FROM${ordersTable} WHERE userId = ${req.userId}`
        connection.query(getOrder,(err,results)=>{
            if(err){
                res.send(err)
                return
            }else{
                res.send(results)
                return
            }
        })
    }else{
        res.send({Err:"please login"})
        return
    }
})

module.exports = router