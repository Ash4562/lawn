const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking"); // Import the Booking model

// Define thali prices
const thaliPrices = {
    Normal: 200,
    Supreme: 500,
    Deluxe: 800,
};

// Create a new booking
// Create a new booking
exports.createBooking = asyncHandler(async (req, res) => {
    const {
        customerName,
        customerNumber,
        startDate,
        endDate,
        eventType,
        hallCharges = 0,
        items = [],
        selectedThali,
        numberOfPeople = 0,
        discount = 0,
        paymentStatus,
        eventTiming,
    } = req.body;

    // Parse dates to ensure they are valid Date objects
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Validate the dates
    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        return res.status(400).json({ message: "Invalid start or end date format" });
    }

    // Check if endDate is before startDate
    if (parsedEndDate < parsedStartDate) {
        return res.status(400).json({ message: "End date must be after or equal to the start date." });
    }

    // Check for existing bookings with the same date and event timing
    const existingBooking = await Booking.findOne({
        eventDate: { $elemMatch: { $gte: parsedStartDate, $lte: parsedEndDate } },
        eventTiming,
    });

    if (existingBooking) {
        return res.status(400).json({
            message: "A booking already exists for the selected ${eventTiming} slot on this date.",
        });
    }

    // Calculate totals
    const thaliPrice = thaliPrices[selectedThali];
    if (!thaliPrice) {
        return res.status(400).json({ message: "Invalid thali type selected." });
    }
    const cateringTotal = thaliPrice * numberOfPeople;
    const itemTotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const initialTotal = Number(hallCharges) + itemTotal + cateringTotal;
    const discountAmount = (discount / 100) * initialTotal;
    const finalPrice = initialTotal - discountAmount;

    // Create booking document
    const newBooking = new Booking({
        customerName,
        customerNumber,
        eventDate: [parsedStartDate, parsedEndDate],
        eventType,
        hallCharges: Number(hallCharges),
        selectedThali,
        thaliPrice,
        numberOfPeople,
        items,
        totalPrice: initialTotal,
        discount,
        finalPrice,
        eventTiming,
        paymentStatus,
    });

    // Save booking to database
    try {
        const savedBooking = await newBooking.save();
        res.status(201).json({ message: "Booking successfully created!", booking: savedBooking });
    } catch (error) {
        res.status(500).json({ message: "Failed to create booking.", error: error.message });
    }
});





// Get all bookings
exports.getBookings = asyncHandler(async (req, res) => {
    try {
        const bookings = await Booking.find();
        console.log(bookings);

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings.", error: error.message });
    }
});

// Get a specific booking by ID
exports.getBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch booking.", error: error.message });
    }
});

// Update an existing booking
// Update an existing booking (Only paymentStatus is allowed to be updated)
exports.updateBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { paymentStatus } = req.body; // Only expect paymentStatus for updates

    if (!["Pending", "Successful"].includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status. It must be 'Pending' or 'Successful'." });
    }

    try {
        // Find booking by ID
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        // Update only the paymentStatus field, leave others unchanged
        booking.paymentStatus = paymentStatus;

        const updatedBooking = await booking.save();
        res.status(200).json({ message: "Payment status updated successfully!", booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking.", error: error.message });
    }
});



// Delete a booking by ID
// Delete a booking by ID
exports.deleteBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        await booking.remove();
        res.status(200).json({ message: "Booking deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete booking.", error: error.message });
    }
});