require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };
    res.render("index", { title: "cooking blog - home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 6;
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", {
      title: "cooking blog - categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 6;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );

    res.render("categories", {
      title: "cooking blog - categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render("recipe", {
      title: "cooking blog - Recipies",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", {
      title: "cooking blog - Search",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

    res.render("exploreLatest", {
      title: "cooking blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find({}).countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();

    res.render("exploreRandom", {
      title: "cooking blog - Explore Random ",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "cooking blog - submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imgUploadFile;
    let uploadPath;
    let newImageName;
    if (req.files || Object.keys(req.files).length === 0) {
      console.Consolelog("No file was uploaded");
    } else {
      imgUploadFile = req.files.image;
      newImageName = Data.now() = imgUploadFile.name;
      uploadPath = require('path').resolve('./') +'/public/upload'+ newImageName;
      imgUploadFile.mv(uploadPath, function(err) {
        if(err) return res.status(500).send(err)
        
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: "chocolate-banoffe-whoopie-pies.jpg",
    });
    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoSubmit", error);
    res.redirect("/submit-recipe");
  }
};
