const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn, isListingOwner } = require('../middleware.js');

//INDEX ROUTE
router.get("/", async (req, res) => {
    const allListings=await Listing.find({});
    res.render('listings/index.ejs',{allListings});
});
//NEW ROUTE
router.get("/new", isLoggedIn,async (req, res) => {
res.render('listings/new.ejs');
});
//SHOW ROUTE
router.get("/:id", async (req, res) => {
let {id}=req.params;
const listing=await Listing.findById(id).populate({path:'reviews',populate:{path:'author'},}).populate('owner');
console.log(listing);

res.render('listings/show.ejs',{listing});

});

//CREATE ROUTE
router.post("/", async (req, res) => {

    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    // console.log(req.user);
    
    await newListing.save();
    req.flash('success','New Listing Created');
    res.redirect('/listings');
});

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, async (req, res) => {
let {id}=req.params;
const listing=await Listing.findById(id);
res.render('listings/edit.ejs',{listing});

});
//UPDATE ROUTE
router.put("/:id",isLoggedIn, async (req, res) => {
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash('success','Listing Updated');

res.redirect(`/listings/${id}`);

});
//Delete Route
router.delete("/:id", isLoggedIn, isListingOwner, async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    req.flash('success', 'Listing Deleted');
    res.redirect("/listings");
});

res.redirect("/listings");
});

module.exports=router;
