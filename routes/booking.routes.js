const router = require("express").Router()
const { createBooking, getBookings, updateBooking } = require("../controller/bookingController")

router
    .get("/", getBookings)
    .post("/create-booking", createBooking)
    .put("/update/:id", updateBooking)


module.exports = router