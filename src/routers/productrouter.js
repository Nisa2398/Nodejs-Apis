const express=require('express')
const router=express.Router()
const product=require('../services/productservice')


router.get('/product/:productid',product.getProduct)
router.post('/product',product.addProduct)
router.put('/product/:productid',product.updateProduct)
router.delete('/product/:productid',product.deleteProduct)

module.exports=router