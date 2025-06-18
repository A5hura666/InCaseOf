const { LockerManager } = require("../manager/LockerManager");
const Locker = require("../models/Locker");
const Booking = require("../models/Booking");

exports.postIntentPayment = async (req, res) => {
    const lockerSelected = await Locker.findById(req.body.lockerId);
    const stripe = require('stripe')(process.env.PRIVATE_STRIPE_API_KEY);

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'casier n°' + lockerSelected.lockerNumber,
                        },
                        unit_amount: lockerSelected.lockerPrice * 100,
                    },
                    quantity: parseInt(req.body.duration) || 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/users/${req.body.userId}/bookings?lockerId=${req.body.lockerId}&duration=${req.body.duration}`,
            cancel_url: `${process.env.BASE_URL}/lockers/list`,
        });
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Error creating payment session or booking:", error);
        res.status(500).json({ error: "Failed to create payment session or booking." });
    }
};