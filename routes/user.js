const express= require("express")
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");


const sql = require("../db");
const connection = require("../db");

const router = express.Router();
const userTabel="users";


router.post("/register",async(req,res)=>{
    const body = req.body;
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(body.password,salt);

    const registerQuery=`insert into ${userTabel}(name,email,password,phone)
    VALUES ("${body.name})","${body.email}","${password}""${body.phone})"`;
    const checkEmailPhone=`SELECT * FROM ${userTabel} WHERE email="${body.email}" OR
    phone=${body.phone}`;

    sql.query(registerQuery,(err,results)=>{
        if(results.length>0){
            res.send({err:"User aleready registered"});
            return;
        }
        else{
            sql.query(registerQuery),(err,res)=>{
                if(err){
                    res.send();
                    return;
                }
            }
            res.send(res);
            return;
        }
        
    })
})

router.post("/login",(req,res)=>{
    const findEmailQuery = `SELECT id,email,password FROM
     ${userTable}  WHERE email = ${req.body.email}"`;
     sql.query(findEmailQuery,(err,results)=>{
     if(results.length>0){
         const checkPass = bcrypt.compareSync(req.body.password,results[0].password);
         if(checkPass){
             const token = jwt.sign({
                 id:results[0].id,
                 email:results[0].email
             },process.env.JWT_KEY)
             res.send(token)
             return
            }
            else{
                res.send({err:"wrong password"});
                return;
            }
        }
        else{
            res.send({err:"email not found"});
            return;
        }
    })
})  

router.patch("/updateWishlist/:productId",(req,res)=>{
    if(req.isAuth){
       const getWishlist = `SELECT wishlist from ${userTable}
       WHERE id =${req.userId}`;

       sql.query(getWishlist,(err,wishlistArr)=>{
           if(err){
               res.send(err)
           }
           else{
               const wishlist = wishlistArr[0].wishlist;
               const wishArr = JSON.parse(wishlist);
               const temp = wishArr.filter(a=>a !=req.params.productId);
               if(temp.length != wishArr.length){
                  updateQuery = `UPDATE ${userTabel} SET
                  wishlist=${JSON.stringify(temp)} WHERE id =${req.userId}`;
               }
                  else{
                      wishArr.push(req.params.productId);
                      updateQuery = `UPDATE ${userTabel} SET
                      wishlist=${JSON.stringify(temp)} WHERE id =${req.userId}`;
                   }
                   sql.query(updateQuery,(err,results)=>{
                       if(err){
                           res.send(err);
                           return;
                       }
                       else{
                           res.send(results)
                           return;
                       }
                   })
                }
       })
    }
    else{
        res.send({err:"email not founnd"});
        return;
    }
})

router.post("/changePass",(req,res)=>{
    if(req.isAuth){
        const salt = bcrypt.genSaltSync()
        const password = bcrypt.hashSync(req.body.password,salt)
        const updatePass = `UPDATE ${userTabel} SET password="${password}" WHERE id="${req.userId}"`
        sql.query(updatePass,(err,results)=>{
            if(err){
                res.send(err)
                return
            }else{
                res.send(results)
                return
            }
        })
    }else{
        const getUser = `SELECT email FROM ${userTabel} WHERE email="${req.body.email}"`
        sql.query(getUser,(err,results)=>{
            if(err){
                res.send(err)
                return
            }
            if(results.length==0){
                res.send({err:"Email Not Registered"})
                return
            }else{
                const token = jwt.sign({
                    email : req.body.email,
                    userId : results[0].id
                },process.env.JWT_KEY,{expiresIn:"2days"})
                res.send(token)
                return
            }
        })
    }
})

router.post("/verifyAndChangePass",(req,res)=>{
    const query = req.query
    if(!query){
        res.send({err:"Wrong Link"})
        return
    }
    const token = query.token
    if(!token){
        res.send({err:"Token Not Provided"})
    }
    const verifyToken = jwt.verify(token.process.env.JWT_KEY)
    if(verifyToken){
        const email = verifyToken.email

        const salt = bcrypt.genSaltSync()
        const password = bcrypt.hashSync(req.body.password,salt)
        const updatePass = `UPDATE ${userTabel} SET password="${password}" WHERE email="${req.email}"`
        sql.query(updatePass,(err,results)=>{
            if(err){
                res.send(err)
                return
            }else{
                res.send(results)
                return
            }
        })

    }else{
        res.send({err:"Invalid Token"})
    }
})


module.exports=router;
