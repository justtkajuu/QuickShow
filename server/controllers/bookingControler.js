import Booking from "../models/Booking.js"
import Show from "../models/Show.js"

// Function to check avilability of selected seats for a movie

const checkSeatsAvailability = async (showId, selectedSeats) => {
    try{
        const showData = await Show.findById(showId)
        if(!showData) return false

        const occupiedSeats = showData.occupiedSeats

        const isAnySeaTaken = selectedSeats.some(seat => occupiedSeats[seat])

        return !isAnySeaTaken
    }catch (error){
        console.log(error);
        return false   
    }
}

export const createBooking = async (req, res ) => {
    try{
        const {userId} = req.auth()
        const {showId, selectedSeats} = req.body
        const {origin} = req.headers

        // check if the seat is available for the seleceted show
        
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if(!isAvailable){
            return res.json({
                success : false,
                message: "Selected seats are not available."
            })
        }
        // get the show details
            const showData = await Show.findById(showId).populate('movie')

            const booking = await Booking.create({
                user : userId,
                show: showId,
                amount : showData.showPrice * selectedSeats.length,
                bookedSeats : selectedSeats
            })

            selectedSeats.map((seat) => {
                showData.occupiedSeats[seat] = userId
            })

            showData.markModified('occupiedSeats')

            await showData.save()

            // stripe gateway Inittialize

            res.json({
                success:true,
                message: "Booked successfully"
            })

    }catch (error){
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
        
    }
}

export const getOcuupiedSeats = async (req, res) => {
    try{
       const {showId} = req.params
       const showData = await Show.findById(showId)
       
       const ocuupiedSeats = Object.keys(showData.ocuupiedSeats)

       res.json({
        success: true,
        occupiedSeats
        
       })
    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message: error.message
        })
        
    }
}