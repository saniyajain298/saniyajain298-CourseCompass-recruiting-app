const Product = require('../models/product');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Category = require('../models/category');
const HomeProduct = require('../models/homeProduct');
const AboutUs = require('../models/aboutUs');
const OfferCode = require('../models/offerCode');
module.exports = {
  getAllProductDetails: async () => {
    const products = await Product.find({});
    return products;
  },

  addProduct: async (productname, price, images, categoryName, city, categoryId, cityId) => {
    try {
      // console.log(
      //   productname,
      //   price,
      //   images,
      //   categoryName,
      //   categoryId,
      // );
      const newProduct = new Product({
        productname,
        price,
        images,
        categoryName,
        city,
        categoryId: categoryId,
        cityId: cityId
      });
      return await newProduct.save();
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    return await Product.findByIdAndUpdate(productId, {
      $set: { isActive: false },
    });
  },

  updateProduct: async function (productId, updatedData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  },

  //User Services
  signup: async (userName, emailId, hashedPassword, contactNo) => {
    try {
      // Check if user with the given email already exists
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create a new user
      const newUser = new User({
        userName,
        emailId,
        password: hashedPassword,
        contactNo,
      });

      // Generate access token
      const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Save the new user to the database
      await newUser.save();

      return { newUser, accessToken };
    } catch (error) {
      throw error;
    }
  },
  login: async (user) => {
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    return accessToken;
  },

  getAllUsers: async () => {
    const users = await User.find({});
    return users;
  },
  getUser: async (userId) => {
    const user = await User.findById(userId);
    return user;
  },

  addCategory: async (categoryData) => {
    try {
      const newCategory = new Category(categoryData);
      return await newCategory.save();
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    await Product.updateMany(
      { categoryId: categoryId, isActive: true },
      { $set: { isActive: false } }
    );
    // Now, you can return the Category document after setting isActive to false for all related products
    return await Category.findByIdAndUpdate(
      categoryId,
      { isActive: false },
      { new: true }
    );
  },

  getAllCategories: async () => {
    const categories = await Category.find({});
    return categories;
  },

  addHomeProductData: async (homeProductData) => {
    try {
      const newProductData = new HomeProduct(homeProductData);
      return await newProductData.save();
    } catch (error) {
      throw error;
    }
  },
  getHomeProductData: async () => {
    const homeProducts = await HomeProduct.find({});
    return homeProducts;
  },

  deleteHomeProductData: async (homeDataId) => {
    return await HomeProduct.findByIdAndDelete(homeDataId);
  },

  addAboutUs: async (aboutUsData) => {
    try {
      const newAboutUsData = new AboutUs(aboutUsData);
      return await newAboutUsData.save();
    } catch (error) {
      throw error;
    }
  },
  updateAboutData: async function (aboutDataId, updatedData) {
    try {
      const updatedAboutData = await AboutUs.findByIdAndUpdate(
        aboutDataId,
        updatedData,
        { new: true }
      );

      return updatedAboutData;
    } catch (error) {
      throw error;
    }
  },

  getAboutUs: async () => {
    const aboutUsData = await AboutUs.find({});
    return aboutUsData;
  },

  deleteAbouUs: async (aboutDataId) => {
    return await AboutUs.findByIdAndDelete(aboutDataId);
  },
  addOfferCode: async (offerCodeData) => {
    try {
      const newOfferCode = new OfferCode(offerCodeData);
      return await newOfferCode.save();
    } catch (error) {
      throw error;
    }
  },
  updateOfferCode: async function (offerCodeId, updatedData) {
    try {
      const updatedOfferCode = await OfferCode.findByIdAndUpdate(
        offerCodeId,
        updatedData,
        { new: true }
      );

      return updatedOfferCode;
    } catch (error) {
      throw error;
    }
  },
  getOfferCodes: async () => {
    const offerCodes = await OfferCode.find({});
    return offerCodes;
  },
  deleteOfferCode: async (offerCodeId) => {
    return await OfferCode.findByIdAndDelete(offerCodeId);
  },
};