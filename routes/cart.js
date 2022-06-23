const express = require("express")
const connection = require("../db")

const cartsTable = "carts"

const router = express.Router()

router.post("/addCart",(res,req)=>{
    if(req.isAuth){
        const query = `INSERT INTO ${cartsTable} (cart,total,userId) VALUES ("${req.body.cart}","${req.body.total}","${req.body.userId}")`

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
    }
})

router.patch("/addToCart",(req,res)=>{
    if(req.isAuth){
        const getCart = `SELECT * from ${cartsTable} WHERE userId = ${req.userId}`
        connection.query(getCart,(err,result)=>{
            if(err){
                res.send(err)
                return
            }else{

                
            }
        })

    }else{
        res.send({err:"please login"})
        return
    }
})

router.get("/cart",(req,res)=>{
    if(req.isAuth){
        const getCart = `SELECT * FROM${cartsTable} WHERE userId = ${req.userId}`
        connection.query(getCart,(err,results)=>{
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