const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateAuthor, validateCampground } = require("../middleware");
const controller = require("../controllers/campgrounds");
// For image uploading form
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router
    .route("/")
    .get(catchAsync(controller.index))
    // .post(isLoggedIn, validateCampground, catchAsync(controller.createCampground));
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.json({
            body: req.body,
            file: req.files
        });
    })

router.get("/new", isLoggedIn, controller.renderNewForm);

router
    .route("/:id")
    .get(catchAsync(controller.showCampground))
    // Edit PUT route
    .put(isLoggedIn, validateAuthor, validateCampground, catchAsync(controller.updateCampground))
    .delete(isLoggedIn, validateAuthor, catchAsync(controller.deleteCampgroud));

// Edit GET route
router.get("/:id/edit", isLoggedIn, validateAuthor, catchAsync(controller.renderEditForm));

module.exports = router;
