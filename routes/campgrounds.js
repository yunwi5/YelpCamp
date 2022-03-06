const express = require("express");
const router = express.Router();
// For image uploading form
const multer = require("multer");
const { storage } = require("../cloudinary/index"); // Cloudinary
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateAuthor, validateCampground } = require("../middleware");
const controller = require("../controllers/campgrounds");

router
    .route("/")
    .get(catchAsync(controller.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(controller.createCampground));

router.get("/new", isLoggedIn, controller.renderNewForm);

router
    .route("/:id")
    .get(catchAsync(controller.showCampground))
    // Edit PUT route
    .put(isLoggedIn, validateAuthor, upload.array('image'), validateCampground, catchAsync(controller.updateCampground))
    .delete(isLoggedIn, validateAuthor, catchAsync(controller.deleteCampgroud));

// Edit GET route
router.get("/:id/edit", isLoggedIn, validateAuthor, catchAsync(controller.renderEditForm));

module.exports = router;
