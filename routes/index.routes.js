const express = require('express');
const router = express.Router();
const Recipe = require("../models/Recipe.model");

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

/* GET about page */
router.get('/about', (req, res, next) => {
	res.render('about');
});

//fetch community recipes 
router.get("/community-recipes", async (req, res, next ) => {
	try {
	 
		const recipes = await Recipe.find(); 
		res.render('community-recipes', { recipes }); 
	  } catch (err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	  } 
	});

  
	


module.exports = router;
