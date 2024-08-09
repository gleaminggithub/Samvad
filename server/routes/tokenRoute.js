const {getToken,bookedtoken,resetToken } = require('../controllers/TokenController');


const router = require("express").Router();

router.get("/gettoken", getToken);
router.post("/bookedtoken/:id", bookedtoken);
router.post("/resetToken",resetToken);
module.exports = router;
