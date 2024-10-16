const asyncHandler = require('../middleware/async_handle');
const { Product, Category, Review, User, Profile } = require('../models');
const fs = require('fs');
const { Op } = require('sequelize');


exports.addProduct = asyncHandler(async (req, res) => {
    let { name, description, price, stock, category_id } = req.body;

    let image = req.file;
    if (!image) {
        throw new Error("image is required");
    }

    const image_path = image.filename;

    const path = `${req.protocol}://${req.get('host')}/public/uploads/${image_path}`;

    const newProduct = await Product.create(
        {
            name: name,
            description: description,
            price: price,
            stock: stock,
            category_id: category_id,
            image: path
        }
    )
    res.status(201).json({
        "message": "success",
        "data": newProduct
    });
});

exports.getProducts = asyncHandler(async (req, res) => {

    let { search, limit, page } = req.query;
    let productData = [];
    if (search || limit || page) {
        const limitData = limit * 1 || 100;
        const pageData = page * 1 || 1;
        const offsetData = (pageData - 1) * limitData;
        const searchData = search || "";

        const products = await Product.findAll({
            where: {
                name: {
                    [Op.like]: "%" + searchData + "%"
                }
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['name', 'id']
            }],
            attributes: { exclude: ['createdAt', 'updatedAt', 'category_id'] },
            limit: limitData,
            offset: offsetData
        });
        productData = products;
        res.status(200).json({
            "message": "success",
            "total": productData.length,
            "limit": limitData,
            "current_page": pageData,
            "data": productData
        });

    } else {
        const products = await Product.findAll(
            {
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['name', 'id']
                }],
                attributes: { exclude: ['createdAt', 'updatedAt', 'category_id'] },
            }
        );
        productData = products;

    }
    res.status(200).json({
        "message": "success",
        "total": productData.length,
        "data": productData
    });


});

exports.getProductById = asyncHandler(async (req, res) => {

    let id = req.params.id;

    const product = await Product.findByPk(id, {
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['name', 'id']
            },
            {
                model: Review,
                as: 'reviewer_product',
                attributes: { exclude: ['createdAt', 'updatedAt', 'product_id', 'users_id'] },
                include: [{
                    model: User,
                    as: 'user_review',
                    attributes: ['name', 'id'],
                    include: [{
                        model: Profile,
                        as: 'profile_user',
                        attributes: ['image', 'age'],
                    }],
                }]
            }
        ],
        attributes: { exclude: ['createdAt', 'updatedAt', 'category_id'] },
    });
    if (!product) {
        throw new Error("product not found");
    }
    res.status(200).json({
        "message": "success",
        "data": product
    });
});


exports.updateProduct = asyncHandler(async (req, res) => {
    let id = req.params.id;
    let { name, description, price, stock, category_id } = req.body;


    const product = await Product.findByPk(id);
    if (!product) {
        throw new Error("product not found");
    }

    const file = req.file;
    if (file) {
        const name_image = product.image.replace(`${req.protocol}://${req.get('host')}/public/uploads/`, '')
        const path_file = `./public/uploads/${name_image}`;

        fs.unlink(path_file, (err) => {
            if (err) {
                throw new Error("failed to delete file");
            }
        });

        const image_path = file.filename;
        const path_new = `${req.protocol}://${req.get('host')}/public/uploads/${image_path}`;

        product.image = path_new;

    }

    if (name) {
        product.name = name;
    }
    if (description) {
        product.description = description;
    }
    if (price) {
        product.price = price;
    }
    if (stock) {
        product.stock = stock;
    }
    if (category_id) {
        product.category_id = category_id;
    }

    await product.save();

    res.status(200).json({
        "message": "success",
        "data": product
    });


});

exports.deleteProduct = asyncHandler(async (req, res) => {
    let id = req.params.id;

    const product = await Product.findByPk(id);
    if (!product) {
        throw new Error("product not found");
    }

    const name_image = product.image.replace(`${req.protocol}://${req.get('host')}/public/uploads/`, '')
    const path_file = `./public/uploads/${name_image}`;

    fs.unlink(path_file, (err) => {
        if (err) {
            throw new Error("failed to delete file");
        }
    });

    await product.destroy();

    res.status(200).json({
        "message": "success",
    });
});

