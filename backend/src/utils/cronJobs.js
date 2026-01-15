// src/utils/cronJobs.js
const cron = require("node-cron");
const Job = require("../models/jobPost");
const Event = require("../models/event");
const transporter = require("./mailer");

module.exports = function () {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const result = await Job.updateMany(
          { status: "Active", endDate: { $lt: new Date() } },
          { $set: { status: "Inactive" } }
        );

        if (result.modifiedCount > 0) {
          console.log(
            `✅ ${result.modifiedCount} expired jobs marked as Inactive`
          );
        } else {
          console.log("ℹ️ No expired jobs to update today");
        }
      } catch (err) {
        console.error("❌ Error while running cron job:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  // cron.schedule("*/1 * * * *", async () => {
  //   // console.log("⏳ Running 15-min interview reminder cron...");

  //   try {
  //     const now = new Date();
  //     const after15 = new Date(now.getTime() + 15 * 60 * 1000);

  //     const events = await Event.find({
  //       interviewDate: { $gte: now, $lte: after15 },
  //       reminderSent: { $ne: true },
  //     }).lean();

  //     if (!events.length) return;

  //     // 2) PROCESS ALL EVENTS IN PARALLEL
  //     await Promise.all(
  //       events.map(async (ev) => {
  //         try {
  //           const candidate = ev.candidate || {};
  //           const interviewer = ev.interviewer || {};

  //           // Skip if missing emails
  //           if (!candidate.email || !interviewer.email) return;

  //           // Prepare emails
  //           const candidateMail = {
  //             from: `"Andgate HR Team" <${process.env.SMTP_USER}>`,
  //             to: candidate.email,
  //             subject: `Reminder: Your interview starts soon - ${ev.eventName}`,
  //             html: `
  //             <p>Hi ${candidate.name},</p>
  //             <p>Your interview for <b>${
  //               ev.eventName
  //             }</b> starts at <b>${new Date(
  //               ev.interviewDate
  //             ).toLocaleString()}</b>.</p>
  //             ${
  //               ev.meetingLink
  //                 ? `<p>Meeting Link: <a href="${ev.meetingLink}">${ev.meetingLink}</a></p>`
  //                 : ""
  //             }
  //             <p>Good luck!</p>
  //           `,
  //           };

  //           const interviewerMail = {
  //             from: `"Andgate HR Team" <${process.env.SMTP_USER}>`,
  //             to: interviewer.email,
  //             subject: `Reminder: Interview scheduled in 15 minutes - ${candidate.name}`,
  //             html: `
  //             <p>Hi ${interviewer.name},</p>
  //             <p>Your interview with <b>${
  //               candidate.name
  //             }</b> starts at <b>${new Date(
  //               ev.interviewDate
  //             ).toLocaleString()}</b>.</p>
  //             ${
  //               ev.meetingLink
  //                 ? `<p>Meeting Link: <a href="${ev.meetingLink}">${ev.meetingLink}</a></p>`
  //                 : ""
  //             }
  //           `,
  //           };

  //           // Send BOTH emails in parallel
  //           await Promise.all([
  //             transporter.sendMail(candidateMail),
  //             transporter.sendMail(interviewerMail),
  //           ]);

  //           // Update event (use updateOne = FASTER & NON-BLOCKING)
  //           await Event.updateOne(
  //             { _id: ev._id },
  //             { $set: { reminderSent: true } }
  //           );

  //           // console.log(`✅ Reminder sent for event: ${ev._id}`);
  //         } catch (innerErr) {
  //           console.error(`❌ Error processing event ${ev._id}:`, innerErr);
  //         }
  //       })
  //     );

  //     console.log("🎉 All reminders processed successfully!");
  //   } catch (err) {
  //     console.error("❌ Global Cron Error:", err);
  //   }
  // });
};
