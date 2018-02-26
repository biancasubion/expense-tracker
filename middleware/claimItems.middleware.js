var ClaimItem = require('../models/ClaimItem');
var multer  = require('multer')
var upload = multer({ dest: './uploads/' })

const findAllWithClaim = async (req,res,next) => {
  let claimItems;
  try {
    claimItems = await ClaimItem.findAllWithClaim(parseInt(req.query.claim_id));
    req.claimItems = claimItems;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

const addNewItem = async (req,res,next) => {
  let items;
  // add item locally

  try {
    req.body['image_url'] = req.files[0]["filename"];
    items = await ClaimItem.addOne(req.body);
    var claim_item_id = items.insertId;
    var item = await ClaimItem.findOne(claim_item_id);
    req.item =  item;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

module.exports = {
  findAllWithClaim: findAllWithClaim,
  addNewItem: addNewItem
}