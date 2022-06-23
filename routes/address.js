const express = require("express")
const connection = require("../db")
const sql = require("../db")

const router = express.Router()

const userTable ="users"
const addressTable = "address"

router.post("/add",(req,res)=>{
    if(req.isAuth){
        try{
            const addAddressQuery = `INSERT INTO ${addressTable} (line1,line2,landmark,city,state,pin,name,userid) VALUES("${req.body.line1}","${req.body.line1}","${req.body.landmark}","${req.body.city}","${req.body.state}","${req.body.pin}","${req.body.name}","${req.userid}")`

            sql.query(addAddressQuery,(err,results)=>{
                res.send(results)
                return
            })
        }
        catch(err){
            res.send(err)
            return
        }
    }else{
        res.send("please login")
    }
})

router.delete("/delete/:addressId",(req,res)=>{
    if(req.isAuth){
        try{
            const deleteQuery = `DELETE FORM ${addressTable} WHERE id=${req.params.addressId}`
            sql.query(deleteQuery,(err,results)=>{
                if(err){
                    res.send(err)
                    return
                }else{
                    res.send(results)
                    return
                }
            })
        }
        catch(err){
            res.send(err)
        }
    }
    else{
        res.send({err:"please login"})
    }
})

router.put("/update/:addressId",(req,res)=>{
    if(req.isAuth){
        try{
            const body = req.body
            const keys = Object.keys(body)
            let str = ''
            keys.forEach((e)=>{
                str += `${e}=${body[e]}`
            })
            str = str.slice(0,-1)
            const updateQuery = `UPDATE ${addressTable} SET ${str} WHERE id=${req.params.addressId}`
            sql.query(updateQuery,(err,results)=>{
                if(err){
                    res.send(err)
                    return
                }
                else{
                    res.send(results)
                    return
                }
            })
        }
        catch(err){
            res.send(err)
            return

        }
    }
    else{
        res.send("please login")
        return
    }
})

module.exports = router