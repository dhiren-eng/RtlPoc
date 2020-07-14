const express = require("express");
const router = express.Router();
const db = require("../modules/dbConnect");
const midWare = require("../modules/middlewareAdm");

router.get("/api/category/all", (req, res, next) => {
  db.getDB()
    .collection("category")
    .find()
    .sort({ title: 1 })
    .toArray((err, doc) => {
      if (err) {
        res.status(410).jsonp(err);
        next(err);
      } else {
        if (doc.length == 0) res.status(404).jsonp("No category added yet!");
        else res.status(200).jsonp(doc);
      }
    });
});

router.get("/api/category/search/:keyword", (req, res, next) => {
  db.getDB().collection("story").createIndex({ cateName: "text" });
  db.getDB()
    .collection("category")
    .find({ $text: { $search: req.params.keyword } })
    .sort({ cateName: 1 })
    .toArray((err, doc) => {
      if (err) {
        res.status(410).jsonp(err);
        next(err);
      } else {
        if (doc.length == 0) res.status(404).jsonp("No category found!");
        else res.status(200).jsonp(doc);
      }
    });
});

router.get("/api/category/:id", (req, res, next) => {
  const collection = db.getDB().collection("category");
  collection.countDocuments({}, (cErr, cDoc) => {
    if (cErr) {
      res.status(410).jsonp(cErr);
      next(cErr);
    } else {
      if (cDoc == 0) {
        res.status(404).jsonp("Category not found!");
      } else {
        collection.findOne(
          { _id: db.getPrimaryKey(req.params.id) },
          (err, doc) => {
            if (err) {
              console.log(err);

              res.status(410).jsonp(err);
              next(err);
            } else {
              if (doc.length == 0) res.status(404).jsonp("Category not found!");
              else res.status(200).jsonp(doc);
            }
          }
        );
      }
    }
  });
});

router.post("/api/category", (req, res, next) => {
  if (!req.body.title) {
    res.status(400).jsonp("Incomplete information");
  } else {
    url = req.body.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    let cateInfo = {
      title: req.body.title,
      description: req.body.description,
      cateUrl: url,
    };
    let dataCollect = db.getDB().collection("category");
    dataCollect.countDocuments({ cateUrl: url }, (err, doc) => {
      if (err) {
        res.status(410).jsonp(err);
        next(err);
      } else {
        if (!doc || doc.length == 0) {
          dataCollect.insertOne(cateInfo, (iErr, result) => {
            if (iErr) {
              res.status(410).jsonp(iErr);
              next(iErr);
            } else {
              res.status(201).jsonp("Category added successfully!");
            }
          });
        } else res.status(200).jsonp("Category already exist... Try new name!");
      }
    });
  }
});

router.put("/api/category/:id", (req, res, next) => {
  if (!req.body.title) {
    res.status(400).jsonp("Incomplete information");
  } else {
    let cateInfo = {
      $set: {
        title: req.body.title,
        description: req.body.description,
      },
    };
    let dataCollect = db.getDB().collection("category");
    dataCollect.updateOne(
      { _id: db.getPrimaryKey(req.params.id) },
      cateInfo,
      (iErr, result) => {
        if (iErr) {
          res.status(410).jsonp(iErr);
          next(iErr);
        } else res.status(201).jsonp("Category updated successfully!");
      }
    );
  }
});

router.delete("/api/category/:id", (req, res, next) => {
  db.getDB()
    .collection("category")
    .deleteOne({ _id: db.getPrimaryKey(req.params.id) }, (err, doc) => {
      if (err) {
        res.status(410).jsonp(err);
        next();
      } else res.status(200).jsonp("Category delete successfully!");
    });
});

module.exports = router;
