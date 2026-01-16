const Event = require("../models/event");
const Candidate = require("../models/candidate");
const {
  interviewerHtml,
  candidateHtml,
  candidateHtmlWithoutLink,
  interviewerHtmlWithoutLink,
  eventRejectionHtml,
  eventApprovalHtml
} = require("../utils/emailTemplates");
const transporter = require("../utils/mailer");

exports.createEvent = async (req, res) => {
  const user = req.user;
  const {
    candidate,
    interviewer,
    scheduledBy,
    eventName,
    interviewDate,
    meetingLink,
    notes,
    organization,
  } = req.body;

  try {
    /* ------------------------------------
     * Validate Required Fields
     * ----------------------------------*/
    const requiredFields = {
      "candidate.name": candidate?.name,
      "candidate.email": candidate?.email,
      "candidate.mobile": candidate?.mobile,
      "candidate.resume": candidate?.resume,
      "interviewer.interviewerId": interviewer?.interviewerId,
      "interviewer.name": interviewer?.name,
      "interviewer.email": interviewer?.email,
      scheduledBy,
      eventName,
      interviewDate,
      "organization.companyId": organization?.companyId,
      "organization.name": organization?.name,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields.",
        missingFields,
      });
    }

    /* ------------------------------------
     * Create Event
     * ----------------------------------*/
    const newEvent = await Event.create({
      candidate,
      interviewer,
      scheduledBy,
      eventName,
      interviewDate,
      meetingLink,
      notes,
      organization,
    });

    /* ------------------------------------
     * Helpers
     * ----------------------------------*/
    const formatDate = (date) =>
      new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

    const resumeURL = `${process.env.BACKEND_URL}/${candidate.resume}`;
    const year = new Date().getFullYear();

    const buildEmailCandidate = (to, html, subject, cc, organization) => ({
      from: `Team ${organization?.name || process.env.COMPANY_NAME || "Company"} <${process.env.SMTP_USER || "no-reply@example.com"
        }>`,
      to,
      cc: cc || undefined,
      subject,
      text: `Dear - ${organization?.name || process.env.COMPANY_NAME || "Company"}`,
      html,
    });

    const buildEmailEnterviewer = (to, html, subject, cc, organization) => ({
      from: `Team ${organization?.name || process.env.COMPANY_NAME || "Company"} <${process.env.SMTP_USER || "no-reply@example.com"
        }>`,
      to,
      cc: cc || undefined,
      subject,
      text: `Dear - ${organization?.name || process.env.COMPANY_NAME || "Company"}`,
      html,
    });

    const technicalFeedbackLink =
      `${process.env.FRONTEND_URL}${process.env.TECHNICAL_URL}/${newEvent._id}`;

    const screeningFeedbackLink =
      `${process.env.FRONTEND_URL}${process.env.SCREENING_URL}/${newEvent._id}`;

    /* ------------------------------------
     * Generate HTML Templates
     * ----------------------------------*/
    const replaceCommonFields = (template) =>
      template
        .replace("{{candidate.name}}", candidate.name)
        .replace("{{interviewer.name}}", interviewer.name)
        .replace(/{{organization.name}}/g, organization.name)
        .replace("{{eventName}}", eventName)
        .replace("{{interviewDate}}", formatDate(interviewDate))
        .replace("{{currentYear}}", year);

    const personalizedCandidateHtml = meetingLink
      ? replaceCommonFields(candidateHtml)
        .replace("{{meetingLink}}", meetingLink)
      : replaceCommonFields(candidateHtmlWithoutLink)

    const personalizedInterviewerHtml = meetingLink
      ? replaceCommonFields(interviewerHtml)
        .replace("{{candidate.resume}}", resumeURL)
        .replace("{{feedbackLink}}", technicalFeedbackLink)
        .replace("{{meetingLink}}", meetingLink)
      : replaceCommonFields(interviewerHtmlWithoutLink)
        .replace("{{candidate.resume}}", resumeURL)
        .replace("{{candidate.email}}", candidate.email)
        .replace("{{candidate.mobile}}", candidate.mobile)
        .replace("{{feedbackLink}}", screeningFeedbackLink);

    /* ------------------------------------
     * Prepare Emails
     * ----------------------------------*/
    const candidateEmail = buildEmailCandidate(
      candidate.email,
      personalizedCandidateHtml,
      `${eventName} Round - for ${candidate.name}`
    );

    const interviewerEmail = buildEmailEnterviewer(
      interviewer.email,
      personalizedInterviewerHtml,
      `${eventName} round has been assigned to you for ${candidate.name}`,
      user.email
    );

    /* ------------------------------------
     * Send Emails
     * ----------------------------------*/
    await Promise.all([
      transporter.sendMail(candidateEmail),
      transporter.sendMail(interviewerEmail),
    ]);

    return res.status(201).json({
      status: true,
      message: "Event created and emails sent successfully.",
      data: newEvent,
    });

  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create event.",
      error: error.message,
    });
  }
};


exports.getEventsByCandidateId = async (req, res) => {
  const user = req.user;
  const { candidateId } = req.params;

  try {
    if (!candidateId) {
      return res.status(400).json({
        status: false,
        message: "Candidate ID is required.",
      });
    }

    const events = await Event.find({
      "candidate.candidateId": candidateId,
    }).sort({ createdAt: - 1 });

    return res.status(200).json({
      status: true,
      message: "Events fetched successfully.",
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch events.",
      error: error.message,
    });
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body;

  try {
    if (!eventId || !status) {
      return res.status(400).json({
        success: false,
        message: "Event ID and status are required.",
      });
    }
    const validStatuses = ['pending', 'submitted', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found for the given event ID.",
      });
    }

    if (status === 'rejected') {
      const rejectionEmail = {
        from: `Team ${event.organization.name || process.env.COMPANY_NAME || "Company"} <${process.env.SMTP_USER}>`,
        to: event.candidate.email,
        subject: `Interview Update for ${event.candidate.name} - ${event.eventName} Round`,
        text: `Dear - ${event.organization.name || process.env.COMPANY_NAME || "Company"}`,
        html: eventRejectionHtml
          .replace(/{{candidateName}}/g, event.candidate.name)
          .replace(/{{organization}}/g, event.organization.name)
          .replace(/{{eventName}}/g, event.eventName)
          .replace(/{{year}}/g, new Date().getFullYear()),
      };

      await transporter.sendMail(rejectionEmail);

      await Candidate.findByIdAndUpdate(event.candidate.candidateId, { status: 'rejected' });
    }

    if (status === 'approved') {
      const approvalEmail = {
        from: `Team ${event.organization.name || process.env.COMPANY_NAME || "Company"} <${process.env.SMTP_USER}>`,
        to: event.candidate.email,
        subject: `Interview Update for ${event.candidate.name} - ${event.eventName} Round`,
        text: `Dear - ${event.organization.name || process.env.COMPANY_NAME || "Company"}`,
        html: eventApprovalHtml
          .replace(/{{candidateName}}/g, event.candidate.name)
          .replace(/{{organization}}/g, event.organization.name)
          .replace(/{{eventName}}/g, event.eventName)
          .replace(/{{year}}/g, new Date().getFullYear()),
      };

      await transporter.sendMail(approvalEmail);
    }

    event.status = status;
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event status updated successfully",
      data: "updated",
    });
  } catch (error) {
    console.error("Failed to update event status:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating event status",
      error: error.message,
    });
  }
};


exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    if (!eventId) {
      return res.status(400).json({
        status: false,
        message: "Event ID is required.",
      });
    }
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({
        status: false,
        message: "Event not found.",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to delete event.",
      error: error.message,
    });
  }
};

exports.updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const updateData = req.body;

  try {
    if (!eventId) {
      return res.status(400).json({
        status: false,
        message: "Event ID is required.",
      });
    }

    // Remove meetingLink for these event types
    const blockedLinkEvents = ["Screening", "Orientation"];
    if (blockedLinkEvents.includes(updateData.eventName)) {
      delete updateData.meetingLink;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({
        status: false,
        message: "Event not found.",
      });
    }

    /* ------------------------------------
     * Helpers
     * ----------------------------------*/

    const formatDate = (date) => new Date(date).toLocaleString();
    const year = new Date().getFullYear();
    const meetingLink = updatedEvent.meetingLink || "";
    const resumeURL = `${process.env.BACKEND_URL}/${updateData.candidate.resume}`;

    const buildEmail = ({ to, html, subject, cc }) => ({
      from: `"HR Team Andgate" <${process.env.SMTP_USER}>`,
      to,
      cc,
      subject,
      text: "HR Team Andgate",
      html
    });

    const technicalFeedbackLink =
      `${process.env.FRONTEND_URL}${process.env.TECHNICAL_URL}/${updatedEvent._id}`;

    const screeningFeedbackLink =
      `${process.env.FRONTEND_URL}${process.env.SCREENING_URL}/${updatedEvent._id}`;

    const replaceCommonFields = (template) =>
      template
        .replace(/{{candidate.name}}/g, updatedEvent.candidate.name)
        .replace(/{{interviewer.name}}/g, updatedEvent.interviewer.name)
        .replace(/{{organization.name}}/g, updatedEvent.organization.name)
        .replace(/{{eventName}}/g, updatedEvent.eventName)
        .replace(/{{interviewDate}}/g, formatDate(updatedEvent.interviewDate))
        .replace(/{{currentYear}}/g, year)
        .replace(/{{meetingLink}}/g, meetingLink);

    /* ------------------------------------
     * Build HTML Templates
     * ----------------------------------*/
    const candidateHTML = replaceCommonFields(candidateHtml);

    const interviewerHTML = meetingLink
      ? replaceCommonFields(interviewerHtml)
        .replace(/{{candidate.title}}/g, "Rescheduled")
        .replace(/{{candidate.resume}}/g, resumeURL)
        .replace(/{{feedbackLink}}/g, technicalFeedbackLink)
      : replaceCommonFields(interviewerHtmlWithoutLink)
        .replace(/{{candidate.resume}}/g, resumeURL)
        .replace(/{{candidate.email}}/g, updatedEvent.candidate.email)
        .replace(/{{candidate.mobile}}/g, updatedEvent.candidate.mobile)
        .replace(/{{feedbackLink}}/g, screeningFeedbackLink);

    /* ------------------------------------
     * Build Emails
     * ----------------------------------*/
    const candidateEmail = updateData.meetingLink
      ? buildEmail({
        to: updatedEvent.candidate.email,
        html: candidateHTML,
        subject: `Rescheduled ${updatedEvent.eventName} Round for ${updatedEvent.candidate.name}`,
      })
      : null;

    const interviewerEmail = buildEmail({
      to: updatedEvent.interviewer.email,
      cc: req.user?.email, // safer
      html: interviewerHTML,
      subject: `${updatedEvent.eventName} round has been rescheduled for ${updatedEvent.candidate.name}`,
    });

    /* ------------------------------------
     * Send Emails
     * ----------------------------------*/
    const emailTasks = [transporter.sendMail(interviewerEmail)];
    if (candidateEmail) emailTasks.push(transporter.sendMail(candidateEmail));

    await Promise.all(emailTasks);

    return res.status(200).json({
      status: true,
      message: "Event updated successfully.",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update event.",
      error: error.message,
    });
  }
};
