"use strict"
var ejs = require("ejs");
var logging = require('./logging');

function renderSignIn(req, res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	ejs.renderFile('./views/signin/eBaySignIn.ejs', function(err, result)
	{
		if (!err)
		{
			res.end(result);
		}
		else
		{
			res.end("An error occured.");
			console.log(err);
		}
	});
}

function renderRegister(req, res)
{
res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	ejs.renderFile('./views/signin/eBayRegister.ejs', function(err, result)
	{
		if (!err)
		{
			res.end(result);
		}
		else
		{
			res.end("An error occured.");
			console.log(err);
		}
	});
}
function renderProfile(req,res)
{
res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.session.username)
	{res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		ejs.renderFile('./views/profile.ejs', function(err, result)
		{
			if (!err)
			{
				res.end(result);
			}
			else
			{
				res.end("An error occured.");
				console.log(err);
			}
		});
	}
	else
	{
		res.redirect("/");
	}
}
function getHome(req,res)
{res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username)
	{
		ejs.renderFile('./views/home.ejs', function(err, result)
		{
			if (!err)
			{
				res.end(result);
			}
			else
			{
				res.end("An error occured.");
				console.log(err);
			}
		});
	}
	else
	{
		res.redirect("/");
	}
	
}

function sell(req,res)
{res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username)
	{
		ejs.renderFile('./views/sell.ejs', function(err, result)
		{
			if (!err)
			{
				res.end(result);
			}
			else
			{
				res.end("An error occured.");
				console.log(err);
			}
		});
	}
	else
	{
		res.redirect("/");
	}
	
}

function sell_info(req,res)
{res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username)
	{
		ejs.renderFile('./views/sell_info.ejs', function(err, result)
		{
			if (!err)
			{
				res.end(result);
			}
			else
			{
				res.end("An error occured.");
				console.log(err);
			}
		});
	}
	else
	{
		res.redirect("/");
	}
}

function sellReview(req,res)
{res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username)
	{
		ejs.renderFile('./views/sellReview.ejs',{"name": req.session.itemName ,"desc": req.session.itemDesc, "price": req.session.itemPrice, "quantity": req.session.itemQuantity },function(err, result)
		{
			if (!err)
			{
				res.send(result);
				res.end();
			}
			else
			{
				res.end("An error occured.");
				console.log(err);
			}
		});
	}
	else
	{
		res.redirect("/");
	}
}

function renderHandle(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username)
	{
		ejs.renderFile('./views/handler.ejs',{"name": req.session.itemName ,"desc": req.session.itemDesc, "price": req.session.itemPrice, "quantity": req.session.itemQuantity },function(err, result)
		{
			if (!err)
			{
				res.send(result);
				res.end();
			}
			else
			{
				res.end("An error occured.");
				console.log(err);
			}
		});
	}
	else
	{
		res.redirect("/");
	}
}

exports.sellReview = sellReview;
exports.sell_info = sell_info;
exports.sell = sell;
exports.renderProfile = renderProfile;
exports.renderSignIn = renderSignIn;
exports.renderRegister = renderRegister;
exports.getHome = getHome;
exports.renderHandle = renderHandle;