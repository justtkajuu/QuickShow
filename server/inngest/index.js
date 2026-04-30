import { Inngest } from "inngest";
import User from "./../models/User.js";
import Booking from "../models/Booking.js";
import Show from "./../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

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

    if (!booking) {
      return { success: false, message: "Booking not found" };
    }

    console.log("Sending email to:", booking.user.email);

    const emailRes = await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
      body: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Hi ${booking.user.name},</h2>
          <p>Your booking for <strong style="color: #F84565;">${booking.show.movie.title}</strong> is confirmed.</p>
          <p>
            <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })}<br/>
            <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}
          </p>
          <p><strong>Seats:</strong> ${booking.bookedSeats.join(", ")}</p>
          <p><strong>Amount:</strong> ₹${booking.amount}</p>
          <p>Enjoy the show! 🍿</p>
          <p>Thanks for booking with us!<br/>— QuickShow Team</p>
        </div>
      `,
    });

    console.log("EMAIL RESPONSE:", emailRes);

    return {
      success: true,
      emailResponse: emailRes,
    };
  },
);

// inngest Function to send reminders

const sendshowReminders = inngest.createFunction(
  {
    id: "send-show-reminders",
    triggers: [{ cron: "0 */8 * * *" }], // har 8 ghante me run
  },
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    // Prepare remainder tasks
    const reminderTaks = await step.run("prepare-reminder-tasks", async () => {
      const shows = await Show.find({
        showTime: { $gte: windowStart, $lte: in8Hours },
      }).populate("movie");

      const tasks = [];

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;

        const userIds = [...new Set(Object.values(show.occupiedSeats))];
        if (userIds.length === 0) continue;

        const users = await User.find({ _id: { $in: userIds } }).select(
          "name email",
        );

        for (const user of users) {
          tasks.push({
            userEmial: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime,
          });
        }
      }
      return tasks;
    });

    if (reminderTaks.length === 0) {
      return { sent: 0, message: "No reminders to send." };
    }

    // Send reminder emails
    const results = await step.run("send-all-reminders", async () => {
      return await Promise.allSettled(
        reminderTaks.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
            body: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello ${task.userName},</h2>

      <p>This is a quick reminder that your movie:</p>

      <h3 style="color: #F84565;">
        "${task.movieTitle}"
      </h3>

      <p>
        is scheduled for 
        <strong>
          ${new Date(task.showTime).toLocaleDateString("en-US", {
            timeZone: "Asia/Kolkata",
          })}
        </strong>
        at
        <strong>
          ${new Date(task.showTime).toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
          })}
        </strong>.
      </p>

      <p>
        It starts in approximately <strong>8 hours</strong> — make sure you're ready!
      </p>

      <br />

      <p>
        Enjoy the show!<br />
        QuickShow Team
      </p>
    </div>
  `,
          }),
        ),
      );
    });

    const sent = results.filter((r) => r.status === "fulfiled").length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} failed.`,
    };
  },
);

// Inngest function to send notification when a new show is added

const sendNewShowNotification = inngest.createFunction(
  {
    id: "send-new-show-notification",
    triggers: [{ event: "app/show.added" }],
  },
  async ({ event }) => {
    const { movieTitle, movieId } = event.data;

    const users = await User.find({});

    for (const user of users) {
      const userEmail = user.email;
      const userName = user.name;

      const subject = `New show Added: ${movieTitle}`;

      const body = `
<div style="margin:0; padding:0; background-color:#0f0f0f; font-family:Arial, sans-serif; color:#ffffff;">
  
  <div style="max-width:600px; margin:auto; background:#1a1a1a; border-radius:12px; overflow:hidden; border:1px solid #2a2a2a;">
    
    <!-- Header -->
    <div style="background:#F84565; padding:16px; text-align:center;">
      <h1 style="margin:0; font-size:22px;">🎬 QuickShow</h1>
    </div>

    <!-- Content -->
    <div style="padding:24px;">
      <h2 style="margin-top:0;">Hi ${userName}, 👋</h2>

      <p style="color:#cccccc; line-height:1.6;">
        A new show has just been added to our platform!
      </p>

      <h2 style="color:#F84565; margin:16px 0;">
        ${movieTitle}
      </h2>

      <p style="color:#cccccc;">
        Book your tickets now and enjoy the experience 🎟
      </p>

      <!-- Button -->
      <div style="text-align:center; margin:24px 0;">
        <a href="https://quickshow-web.vercel.app/movies/${movieId}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#F84565;
            color:white;
            text-decoration:none;
            border-radius:30px;
            font-weight:bold;
          ">
          🎟 Book Now
        </a>
      </div>

      <p style="color:#888888; font-size:12px;">
        If you didn't expect this email, you can safely ignore it.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:16px; text-align:center; font-size:12px; color:#777;">
      © ${new Date().getFullYear()} QuickShow. All rights reserved.
    </div>

  </div>
</div>
`;

      await sendEmail({
        to: userEmail,
        subject,
        body,
      });
    }
    return { message: "Notification sent." };
  },
);

// create an empty array where w'll export future Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendbookingConfirmationemail,
  sendshowReminders,
  sendNewShowNotification,
];
