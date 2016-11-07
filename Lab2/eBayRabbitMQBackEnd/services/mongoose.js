"use strict";

var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
var mongoDbUrl = "mongodb://localhost:27017/eBay";
var bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;
var connection = mongoose.connect(mongoDbUrl);
var SALT_WORK_FACTOR = 10;
autoIncrement.initialize(connection);
var schema = mongoose.Schema;

var userInfoSchema = new schema({
	"birthday":{type:String, required: true},
	"adrLine1":{type:String, required: true},
	"adrLine2":{type:String, required: true},
	"city":{type:String, required: true},
	"contact":{type:String, required: true},
	"state":{type:String, required: true},
	"zipcode":{type:String, required: true},
	"country":{type:String, required: true}
});

var usersSchema = new schema({
	"firstName": {type:String, required: true},
	"lastName": {type:String, required: true},
	"username": {type:String, required: true, unique: true, index: true},
	"password": {type:String, required: true},
	"email": {type:String, required: true},
	"lastLoggedIn" : {type:Date, required: true},
	"userInfo": userInfoSchema
});

usersSchema.pre('save', function(next) {
    var user = this;
    console.log("in pre save");
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        console.error(user.password);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            console.error("5");
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

usersSchema.methods.comparePassword = function(candidatePassword, cb) {
	console.log(candidatePassword);
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        
        cb(null, isMatch);
    });
};

var itemsSchema = new schema({
	"itemName": {type:String, required: true},
	"description" :{type:String, required: true},
	"quantity" : {type:Number, required:true},
	"price" : {type:Number, required:true},
	"isBidding" : {type:Boolean, required:true},
	"owner" : {type:String, required:true}
});
itemsSchema.plugin(autoIncrement.plugin,{model:'items',field:'itemRefId',startAt:1,
	incrementBy:1});

var cartSchema = new schema({
	"itemId" : {type: schema.Types.ObjectId, ref : 'items' , required:true},
	"orderedQuantity" : {type:Number, required:true, default: 1},
	"username" : {type:String, required:true}
});

var ordersSchema = new schema({
	"transactionId" : {type:Number, required:true},
	"orderedQuantity" : {type:Number, required: true},
	"itemId" : {type:Number, required:true},
	"seller" : {type:String, required:true}
});

var transactionSchema = new schema({
	"transactionDate" : {type:Date, required: true},
	"total" : {type:Number, required:true},
	"buyer" : {type:String, required:true}
});
transactionSchema.plugin(autoIncrement.plugin,{model:'transaction',field:'transactionId',startAt:1,incrementBy:1});



var bidsSchema = new schema({
	"auctionId" :  {type:Number, required:true},
	"bidDate" : {type:Date, required: true},
	"bidPrice" : {type:Number, required:true},
	"bidder"  :  {type:String, required:true}
});



var auctionSchema = new schema({
	"itemId" : {type:Number, required:true},
	"basePrice" : {type:Number, required:true},
	"startTime" : {type:Date, required: true},
	"endTime" : {type:Date, required: true}
});

var items = mongoose.model('items',itemsSchema,'items');
var users = mongoose.model('users',usersSchema,'users');
var userInfo = mongoose.model('userInfo',userInfoSchema,'userInfo');
var cart = mongoose.model('cart',cartSchema,'cart');
var auction = mongoose.model('auction',auctionSchema,'auction');
var bids = mongoose.model('bids',bidsSchema,'bids');
var transaction = mongoose.model('transaction',transactionSchema,'transaction');
var orders = mongoose.model('orders',ordersSchema,'orders');

exports.userInfo = userInfo;
exports.users = users;
exports.items = items;
exports.transaction = transaction;
exports.bids = bids;
exports.auction = auction;
exports.cart = cart;
exports.orders = orders;