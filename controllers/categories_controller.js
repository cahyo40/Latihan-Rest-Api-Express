const { Category,Product } = require("../models");
const asyncHandler = require('../middleware/async_handle');

// GET ALL CATEGORIES
exports.findAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      "status": 200,
      "message": "success",
      "data": categories
    })
  } catch (error) {
    res.status(400).json({
      "status": 400,
      "message": "Failed to get categories",
      "error": error.errors[0].message,
    })
  }
};


exports.createCategory = asyncHandler(async (req, res) => {

  let { name, description } = req.body;
  const addCategory = await Category.create({ name, description });
  res.status(201).json({
    "message": "success",
    "data": addCategory
  })

  // console.log(error.ValidationErrorItem[0].message);

})


// GET CATEGORY BY ID

exports.findCategoryById = async (req, res) => {

  try {
    let id = req.params.id;
    const category = await Category.findByPk(id,{
      include:[{
        model:Product,
        as:'products',
        attributes:{exclude:['category_id']}
      }],
      attributes:{exclude:[]}, 
    });
    if (!category) {
      return res.status(404).json({
        "status": 404,
        "message": "Category not found"
      })
    }
    res.status(200).json({
      "status": 200,
      "message": "success",
      "data": category
    })
  } catch (error) {
    res.status(400).json({
      "status": 400,
      "message": "Failed to get category",
      "error": error.errors[0].message,
    })
  }
}


// DELETE CATEGORY BY ID


exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        "status": 404,
        "message": "Category not found"
      })
    }
    await category.destroy();
    res.status(200).json({
      "status": 200,
      "message": "success",
      "data": category
    })
  } catch (error) {
    res.status(400).json({
      "status": 400,
      "message": "Failed to delete category",
      "error": error.errors[0].message,
    })
  }
}

// UPDATE CATEGORY BY ID

exports.updateCategoryById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    throw new Error("Please provide id");
  }
  const id = req.params.id;

  await Category.update(req.body, { where: { id } });

  const updatedCategory = await Category.findByPk(id);

  if (!updatedCategory) {

    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    "status": 200,
    "message": "success",
    "data": updatedCategory
  })
})

