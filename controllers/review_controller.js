const asyncHandler = require('../middleware/async_handle')
const { Review, Product } = require('../models')
const sequelize = require('sequelize')


const avgDataProduct = async (product_id) => {
    const result = await Review.findOne({
        where: { product_id: product_id },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('point')), 'avgPoint']
        ]
    })
    const avgPoint = Number(result.dataValues.avgPoint);
    await Product.update({
        avg_review: avgPoint
    }, {
        where: { id: product_id }
    })
}




exports.createOrUpdateReview = asyncHandler(async (req, res, next) => {
    const { point, content } = req.body
    const { id } = req.user
    const { product_id } = req.params

    let message = ""

    const myReview = await Review.findOne({
        where: {
            users_id: id,
            product_id: product_id
        }
    })

    if (myReview) {

        await Review.update({
            point: point,
            content: content
        }, {
            where: { id: myReview.id },
        })
        await avgDataProduct(product_id)
        message = "Review updated"
    } else {
        console.log(`user id: ${point}`)
        await Review.create({
            users_id: id,
            product_id: product_id,
            point: point,
            content: content
        })
        await Product.increment(
            { count_review: 1 }, 
            { where: { id: product_id } 
        })
        await avgDataProduct(product_id)
        message = "Review created";
    }



    res.status(201).json({

        message: message
    })



})
