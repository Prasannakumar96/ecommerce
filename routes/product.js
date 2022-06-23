const express = require("express")
const connection = require("../db")
const sql = require("../db")

const productsTable = "products"
const router = express.Router()

router.post("/add",(req,res)=>{
    if(req.isAuth){
        const body =req.body
       const addQuery = `INSERT INTO ${productsTable} (name,desc,price,stock,image,brand,reviewId,tags,variants) VALUE ("${body.name}","${body.desc}","${body.price}","${body.stock}","${body.productImg.data}","${body.brand}","${body.reviewId}","${body.tags}","${body.variants}")`
       sql.query(addQuery,(err,results)=>{
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
    else{
        res.send({err:"please login"})
        return
    }
})

router.get("/allProducts",(req,res)=>{
    const query = `SELECT * FROM ${productsTable}`
    sql.query(query,(err,results)=>{
        if(err){
            res.send(err)
            return
        }
        else{
            res.send(results)
            return
        }
    })
})

router.get("/productId",(req,res)=>{
    const query = `SELECT * FROM ${productsTable} WHERE id=${req.params.productId}`
    sql.query(query,(err,results)=>{
        if(err){
            res.send(err)
            return
        }
        else{
            res.send(results)
            return
        }
    })
})

router.patch("/update/:productId",(req,res)=>{
    if(req.isAuth){
        if(req.admin){
            const body = req.body
            const productImage = req.files.productImg
            if(productImage){
                body.image = productImage.data
            }
            const keys = objects.keys(body)
            const updateStr = " "
            keys.forEach((e) => str += `${e} = ${body[e]},`)
            updateStr = updateStr.slice(0,-1)
            const query = `UPDATE ${productsTable} SET ${str} WHERE id=${req.params.productId}`
            sql.query(query,(err,results)=>{
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
        else{
            res.send({err:"Unauthorized access"})
            return
        }

    }
    else{
        res.send({err:"please login"})
        return
    }
})


router.delete("/delete/:addressId",(req,res)=>{
    if(req.isAuth){
        if(req.admin){
            const deleteQuery = `DELETE FORM ${productsTable} WHERE id=${req.params.productId}`
            sql.query(deleteQuery,(err,results)=>{
                if(err){
                    res.send(err)
                    return
                }else{
                    res.send(results)
                    return
                }
            })
        }else{
            res.send({err:"Unauthorized access"})
            return
        }
    }
    else{
        res.send({err:"please login"})
    }
})


module.exports = router