import { Inngest } from "inngest";
import User from "./../models/User.js";
import Booking from "../models/Booking.js";
import Show from "./../models/Show.js";
import senndEmail from "../configs/nodeMailer.js";

// create a client to send and recive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest funnction to create user for  database

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  },
);

// Inngest Function to delete user from database

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  },
);

// Inngest function to update the user database

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  },
);

// inngest Function to cancel booking and release setasof show after 10 minutes of booking created if payment is not made

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  {
    id: "release-seats-delete-booking",
    triggers: [{ event: "app/checkpayment" }],
  },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);

    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;

      const booking = await Booking.findById(bookingId);
      if (!booking) return;

      if (booking.isPaid) return;

      const show = await Show.findById(booking.show);
      if (!show) return;

      booking.bookedSeats.forEach((seat) => {
        delete show.occupiedSeats[seat];
      });

      show.markModified("occupiedSeats");
      await show.save();

      await Booking.findByIdAndDelete(booking._id);
    });
  },
);

// Inngest Function to send email when user books a show

const sendbookingConfirmationemail = inngest.createFunction(
  {
    id: "send-booking-confirmation-email",
    triggers: [{ event: "app/show.booked" }],
  },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: { path: "movie", model: "Movie" },
      })
      .populate("user");

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
      body: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      
      <h2>Hi ${booking.user.name},</h2>

      <p>
        Your booking for 
        <strong style="color: #F84565;">
          ${booking.show.movie.title}
        </strong> 
        is confirmed.
      </p>

      <p>
        <strong>Date:</strong> 
        ${new Date(booking.show.showDateTime).toLocaleDateString("en-US", {
          timeZone: "Asia/Kolkata",
        })}
        <br/>

        <strong>Time:</strong> 
        ${new Date(booking.show.showDateTime).toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
        })}
      </p>

      <p>
        <strong>Seats:</strong> ${booking.bookedSeats.join(", ")}
      </p>

      <p>
        <strong>Amount:</strong> ₹${booking.amount}
      </p>

      <p>Enjoy the show! 🍿</p>

      <p>
        Thanks for booking with us!<br/>
        — QuickShow Team
      </p>

    </div>
  `,
    });
  },
);

// create an empty array where w'll export future Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendbookingConfirmationemail
];
