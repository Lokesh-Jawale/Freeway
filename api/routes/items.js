const router = require("express").Router();
const { verify } = require("../authValidation/authVerify");
const Item = require("../models/Item");
const User = require("../models/User");

// get all items
router.get("/all", async (req, res) => {
    try{
        const items = await Item.find().lean().exec();
        res.status(200).json(items);
    } catch(err) {
       res.status(404).end("Failed to get all items")
    }
})

// add an item
router.post("/add", verify, async (req, res) => {
    try{
        const data = JSON.parse(req.body.itemData)
        const newItem = new Item(data);
        const savedItem = await newItem.save();

        res.status(200).json(savedItem);
    }catch(err){
        res.status(500).json("Failed to add an item");
    }
})

// get an item
router.get("/:id", verify, async (req, res) => {
    try{
        const item = await Item.findById(req.params.id)
        res.status(200).json(item)
    }catch(err){
        res.status(500).json("Failed to get the requested item")
    }
})

// update item
router.put("/:id", verify, async (req, res) => {
    try{
        const item = await Item.findById(req.params.id);
        await item.updateOne({$set: req.body});
        res.status(200).json("Item updated successfully")
    }catch(err) {
        res.status(500).json("Failed to update the item");
    }
})

// delete an item
router.delete("/:id", verify, async (req, res) => {
    try{
        await Item.findByIdAndDelete(req.params.id)
        res.status(200).json("Item deleted successfully");
    }catch(err){
        res.status(500).json("Failed to delete the item");
    }
})


// request item

module.exports = router
