const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Application Accepted</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 700px;
                margin: 30px auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            .header {
                text-align: center;
                margin-bottom: 20px;
            }

            .header h2 {
                color: #333;
            }

            .content {
                color: #444;
                font-size: 16px;
                line-height: 1.6;
            }

            .footer {
                margin-top: 30px;
                font-size: 13px;
                color: #999;
                text-align: center;
            }

            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff !important;
                text-decoration: none;
                border-radius: 5px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                <h2>Application Accepted - {{company}}.</h2>
            </div>

            <div class="content">
                <p>Dear {{candidateName}},</p>

                <p>
                We are pleased to inform you that your application for a position at
                <strong>{{company}}.</strong> has been successfully accepted.
                </p>

                <p>
                Our recruitment team was impressed with your qualifications and experience.
                We look forward to moving ahead with the next steps in the selection process.
                </p>

                <p>
                You will be contacted shortly with further instructions regarding the interview
                schedule and any additional requirements.
                </p>

                <p>
                If you have any questions, feel free to reply to this email or contact our HR
                department at <a href="mailto:{{companyEmail}}">{{companyEmail}}</a>.
                </p>

                <p>We appreciate your interest in joining our team!</p>

                <p>Best regards,<br /><strong>Andgate HR Team</strong></p>
            </div>

            <div class="footer">
                &copy; {{year}} {{company}}. All rights reserved.
            </div>
            </div>
        </body>
        </html>
`;

const candidateHtml = `
 <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Invitation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
      color: #333;
    }
    .container {
      width: 600px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .content {
      padding: 30px 40px;
    }
    h2 {
      margin-top: 0;
      font-size: 24px;
      color: #2c3e50;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    .footer {
      padding: 20px 40px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    a {
      color: #1a73e8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table class="container" cellpadding="0" cellspacing="0">
          <tr>
            <td class="content">
              <p>Dear <strong>{{candidate.name}}</strong>,</p>
              <p>
                Your profile has been shortlisted! Our team from <strong>{{organization.name}}</strong> will contact you soon regarding the <strong>{{eventName}}</strong> round with <strong>{{interviewer.name}}</strong>.
              </p>
              <p style="margin-top: 20px;">
                <strong>Interview Date:</strong> {{interviewDate}}<br/>
                <strong>Meeting Link:</strong>
                <a href="{{meetingLink}}" target="_blank">Click to Join</a>
              </p>
              <p style="margin-top: 40px;">
                Best regards,<br/>
                <strong>Andgate HR Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              &copy; {{currentYear}} Andgate Informatics Pvt. Ltd. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const candidateHtmlWithoutLink = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Interview Invitation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f5f7fa;
      font-family: Arial, Helvetica, sans-serif;
      color: #333333;
    }

    .container {
      width: 600px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .content {
      padding: 32px 40px;
    }

    h2 {
      margin: 0 0 10px 0;
      font-size: 22px;
      color: #2d3748;
      font-weight: 600;
    }

    p {
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 12px 0;
    }

    .footer {
      padding: 18px 40px;
      text-align: center;
      font-size: 12px;
      color: #777777;
      background: #fafafa;
    }

    a {
      color: #1a73e8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table class="container" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td class="content">
              <p>Dear Candidate,</p>

              <p>
                Thank you for submitting your profile.<br />
                Your application is currently under screening.<br />
                Once the screening is successfully completed, we will share the interview schedule and further communication.
              </p>

              <p style="margin-top: 32px;">
                Best regards,<br />
                HR Team<br />
                <strong>{{organization.name}}</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td class="footer">
              © {{currentYear}} {{organization.name}}. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const interviewerHtml = `
 <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Assessment</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
      color: #333;
    }
    .container {
      width: 600px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .content {
      padding: 30px 40px;
    }
    h2 {
      margin-top: 0;
      font-size: 24px;
      color: #2c3e50;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    .footer {
      padding: 20px 40px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    a {
      color: #1a73e8;
      text-decoration: none;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table class="container" cellpadding="0" cellspacing="0">
          <tr>
            <td class="content">
              <p>Dear <strong>{{interviewer.name}}</strong>,</p>
              <p>
                You have been assigned to conduct an interview with
                <strong>{{candidate.name}}</strong> for the
                <strong>{{eventName}}</strong> round.
              </p>
              <p style="margin-top: 20px;">
                <p> Resume <strong><a href="{{candidate.resume}}" target="_blank">View Resume</a></strong></p>
                <strong>Interview Date:</strong> {{interviewDate}}<br/>
                <strong>Meeting Link:</strong>
                <a href="{{meetingLink}}" target="_blank" style="color: #1a73e8; text-decoration: underline;">Click to Join</a>
              </p>

              <p>
                After the interview, please submit your feedback:<br />
                <a
                  href="{{feedbackLink}}"
                  target="_blank"
                  style="
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 10px;
                    background-color: #1a73e8;
                    color: #ffffff;
                    border-radius: 5px;
                    font-size: 14px;
                    text-align: center;
                    text-decoration: none;
                    font-weight: 500;
                  "
                >
                  Submit Feedback
                </a>
              </p>
              
              <p style="margin-top: 40px;">
                Best regards,<br/>
                <strong>Andgate HR Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              &copy; {{currentYear}} Andgate Informatics Pvt. Ltd. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const interviewerHtmlWithoutLink = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Interview Assignment</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333333;
    }

    .container {
      width: 100%;
      max-width: 600px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      margin: 0 auto;
    }

    .content {
      padding: 30px 40px;
    }

    h2 {
      margin-top: 0;
      font-size: 26px;
      color: #2c3e50;
      font-weight: 600;
    }

    p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .footer {
      padding: 20px 40px;
      text-align: center;
      font-size: 12px;
      color: #999999;
      background-color: #f9f9f9;
      border-top: 1px solid #eee;
      border-radius: 0 0 10px 10px;
    }

    a {
      color: #1a73e8;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .btn-link:hover {
      background-color: #1558b0;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table class="container" cellpadding="0" cellspacing="0">
          <tr>
            <td class="content">
              <p>Dear <strong>{{interviewer.name}}</strong>,</p>

              <p>
                You have been assigned to conduct the <strong>{{eventName}}</strong> round with
                <strong>{{candidate.name}}</strong>.
              </p>

              <p>
                <strong>Below Are the Candidate Details:</strong><br />
                Email: <strong>{{candidate.email}}</strong><br />
                Mobile <strong>{{candidate.mobile}}</strong><br />
                Resume <strong><a href="{{candidate.resume}}" target="_blank">View Resume</a></strong>
              </p>

              <p>
                After the interview, please submit your feedback:<br />
                <a
                  href="{{feedbackLink}}"
                  target="_blank"
                  style="
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 10px;
                    background-color: #1a73e8;
                    color: #ffffff;
                    border-radius: 5px;
                    font-size: 14px;
                    text-align: center;
                    text-decoration: none;
                    font-weight: 500;
                  "
                >
                  Submit Feedback
                </a>
              </p>

              <p style="margin-top: 40px;">
                Best regards,<br />
                <strong>Andgate HR Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              &copy; {{currentYear}} Andgate Informatics Pvt. Ltd. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const newUserTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Account Created - {{organization}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    h2 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .credentials {
      background-color: #f1f1f1;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      font-family: monospace;
    }
    .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome {{firstName}},</h2>
    <p>You have been successfully registered with <strong>{{organization}}</strong>.</p>
    
    <p>Here are your login credentials:</p>
    <div class="credentials">
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Password:</strong> {{password}}</p>
       <p>
               
                <a
                  href="{{loginLink}}"
                  target="_blank"
                  style="
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 10px;
                    background-color: #1a73e8;
                    color: #ffffff;
                    border-radius: 5px;
                    font-size: 14px;
                    text-align: center;
                    text-decoration: none;
                    font-weight: 500;
                  "
                >
                  Visit the page
                </a>
              </p>

    </div>

    <p>Please keep this information confidential. You can now log in to your account and start using our services.</p>

    <div class="footer">
      <p>&copy; {{organization}}, {{year}}</p>
    </div>
  </div>
</body>
</html>
`;

const ForgetPass = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset OTP - {{organization}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    h2 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .credentials {
      background-color: #f1f1f1;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      font-family: monospace;
    }
    .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome {{firstName}},</h2>
    <p>You have requested for password reset on HRMS MyPortal.</p>
    
    <p>Here is your OTP:</p>
    <div class="credentials">
      <p><strong>OTP:</strong> {{otp}}</p>

    </div>

    <p>Please keep this information confidential.</p>

    <div class="footer">
      <p>&copy; {{organization}}, {{year}}</p>
    </div>
  </div>
</body>
</html>`;

// Other templates (candidateHtml, interviewerHtml, etc.)

const eventRejectionHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Application Status - {{organization}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    h2 {
      color: #d9534f;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6; background: #f9f9f9; border-radius: 8px;">
    <h2 style="color: #333;">Dear {{candidateName}},</h2>
    
    <p>
      Thank you for taking the time to apply and attend the interview for
      <strong>{{eventName}}</strong> with us.
    </p>

    <p>
      After careful consideration, we regret to inform you that you have not been selected
      to move forward in the hiring process.
    </p>

    <p>
      We truly value your interest in joining our team and encourage you to reapply
      for future opportunities that match your skills and experience.
    </p>

    <p>We wish you success in your career journey ahead.</p>

    <p style="margin-top: 20px;">
      Best regards,<br />
      <strong>{{organization}} HR Team</strong>
    </p>

    <div class="footer" style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
      &copy; {{year}} {{organization}}. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const rejectCandidate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Application Status - {{organization}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    h2 {
      color: #d9534f;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #888888;
    }
  </style>
</head>
<body>
      <div class="container" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #333;">Dear {{candidateName}},</h2>
        
        <p>
          Thank you for taking the time to apply to <strong>{{organization}}</strong>.
        </p>

        <p>
          After a thorough review of your application, we regret to inform you that we will not be moving forward with your candidacy at this time.
        </p>

        <p>
          We truly appreciate your interest in joining our team and encourage you to apply for future openings that align with your skills and experience.
        </p>

        <p>
          We wish you every success in your future endeavors.
        </p>

        <p style="margin-top: 20px;">
          Best regards,<br />
          <strong>{{organization}} HR Team</strong>
        </p>

        <div class="footer" style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
          &copy; {{year}} {{organization}}. All rights reserved.
        </div>
      </div>
  </div>
</body>
</html>
`;

const eventApprovalHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Congratulations - {{organization}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    h2 {
      color: #28a745;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background-color: #28a745;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
      text-align: center;
    }
    .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Congratulations, {{candidateName}}!</h2>

    <p>
      We are pleased to inform you that you have been selected for
      <strong>{{eventName}}</strong> with our organization.
    </p>

    <p>
     Our team will share the next steps with you shortly, 
     including any documentation requirements and timelines, 
     if additional interview rounds are required.
    </p>

    <p style="margin-top: 20px;">
      Best regards,<br />
      <strong>{{organization}} HR Team</strong>
    </p>

    <div class="footer" style="text-align: center;">
      &copy; {{year}} {{organization}}. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const invoiceEmailHtml = (invoice, recipientEmail) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color:#4F46E5; margin-top:0;">
        Invoice #${invoice.invoiceNo} - ${invoice.seller?.name || "AndGate Informatics"
    }
      </h2>
      <p>Dear ${invoice.buyer?.name || "Customer"},</p>
      <p>Please find attached your invoice <strong>#${invoice.invoiceNo
    }</strong> 
      dated <strong>${invoice.invoiceDate?.toLocaleDateString() || "N/A"
    }</strong>.</p>
      
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border:1px solid #ddd; padding: 8px;">Description</th>
            <th style="border:1px solid #ddd; padding: 8px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
      ?.map(
        (item) => `
                <tr>
                  <td style="border:1px solid #ddd; padding: 8px;">${item.description
          }</td>
                  <td style="border:1px solid #ddd; padding: 8px;">₹${item.amount.toFixed(
            2
          )}</td>
                </tr>`
      )
      .join("") || "<tr><td colspan='2'>No items</td></tr>"
    }
        </tbody>
      </table>

      <p><strong>Total: ₹${invoice.totals?.total || 0}</strong></p>

      <p>Regards,<br>${invoice.seller?.name || "AndGate Informatics"}</p>
    </div>
  `;
};

const OnboardingEmailTemplate = (
  name,
  companyName,
  position,
  joiningDate,
  onboardingLink,
  email,
  year
) => {
  return `
<div style="width:100%; background-color:#f3f4f6; padding:40px 0; font-family:Arial, Helvetica, sans-serif;">
  <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:12px; box-shadow:0 6px 15px rgba(0,0,0,0.1); padding:40px; color:#111827; line-height:1.6;">

    <h2 style="text-align:center; font-size:28px; font-weight:700; color:#1d4ed8; margin-bottom:30px; border-bottom:2px solid #1d4ed8; padding-bottom:12px;">
      Offer Letter
    </h2>

    <p style="margin-bottom:20px; font-size:16px;">
      Dear <strong>${name}</strong>,
    </p>

    <p style="margin-bottom:20px; font-size:16px;">
      We are thrilled to extend an offer to join <strong>${companyName}</strong> as a <strong>${position}</strong>. 
      Your anticipated start date is <strong>${joiningDate}</strong>.
    </p>

    <p style="margin-top:30px; font-size:16px;">
      Please find your offer letter attached to this email. Kindly review and sign it, then complete your onboarding form by clicking the link below:
    </p>


    <div style="text-align:center; margin:20px 0;">
      <a href="${onboardingLink}" target="_blank"
        style="background-color:#10b981; color:#ffffff; text-decoration:none; padding:14px 30px; border-radius:8px; font-weight:600; display:inline-block; font-size:16px; transition: background-color 0.3s;">
        Complete Onboarding Form
      </a>
    </div>

    <p style="margin-top:35px; font-size:16px;">
      We are excited to have you join our team and look forward to your contributions.
    </p>

    <p style="margin-top:20px; font-size:16px;">
      Best regards,<br>
      <strong>${email}</strong>
    </p>

    <footer style="text-align:center; font-size:13px; color:#6b7280; margin-top:45px; border-top:1px solid #e5e7eb; padding-top:16px;">
      © ${year} ${companyName}. All rights reserved.
    </footer>

  </div>
</div>
`;
};

const ReviewRequestEmailTemplate = (
  name,
  reason,
  companyName,
  onboardingLink,
  email,
  year
) => {
  return `
<div style="width:100%; background-color:#f3f4f6; padding:40px 0; font-family:Arial, Helvetica, sans-serif;">
  <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:12px; box-shadow:0 6px 15px rgba(0,0,0,0.1); padding:40px; color:#111827; line-height:1.6;">

    <h2 style="text-align:center; font-size:28px; font-weight:700; color:#1d4ed8; margin-bottom:30px; border-bottom:2px solid #1d4ed8; padding-bottom:12px;">
      Action Required: Please Resubmit Your Onboarding Form
    </h2>

    <p style="margin-bottom:20px; font-size:16px;">
      Dear <strong>${name}</strong>,
    </p>

    <p style="margin-bottom:20px; font-size:16px;">
      Thank you for submitting your onboarding form. Upon review, we noticed that some details need to be updated or corrected.
      Please review your form and resubmit it using the link below at your earliest convenience.
    </p>

    <p style="margin-bottom:8px; font-size:16px; font-weight:600;">
      Reason for reinitiation:
    </p>

    <p style="margin-bottom:20px; font-size:16px; background-color:#f9fafb; border-left:4px solid #1d4ed8; padding:10px 15px; border-radius:6px;">
      ${reason}
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a href="${onboardingLink}" target="_blank"
        style="background-color:#10b981; color:#ffffff; text-decoration:none; padding:14px 30px; border-radius:8px; font-weight:600; display:inline-block; font-size:16px; transition:background-color 0.3s;">
        Resubmit Onboarding Form
      </a>
    </div>

    <p style="margin-top:35px; font-size:16px;">
      We appreciate your prompt attention to this matter and look forward to completing your onboarding process smoothly.
    </p>

    <p style="margin-top:20px; font-size:16px;">
      Warm regards,<br>
      <strong>${email}</strong>
    </p>

    <footer style="text-align:center; font-size:13px; color:#6b7280; margin-top:45px; border-top:1px solid #e5e7eb; padding-top:16px;">
      © ${year} ${companyName}. All rights reserved.
    </footer>

  </div>
</div>

`;
};

const jobRequirementEmailHtml = (job, user, publicSubmissionLink, company) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

      <h2 style="color:#2563EB; margin-top:0;">
        Job Requirement – ${job?.title || "Open Position"}
      </h2>

      <p>
        Greetings from <strong>${company || "AndGate Informatics"}</strong>,
      </p>

      <p>
        We are currently hiring for the below position and request you to share
        <strong>relevant and matching candidate profiles</strong>.
      </p>

      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tbody>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>Job ID</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">${job?.jobId || "N/A"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>Annual CTC (in LPA)</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">${job?.annualCTC || "N/A"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>Position</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">${job?.title || "N/A"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>Location</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">${job?.location || "N/A"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>Work Type</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">${job?.workType || "N/A"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>Employment Type</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">${job?.jobType || "N/A"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>Experience</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">
              ${job?.experienceMin ?? "N/A"} – ${job?.experienceMax ?? "N/A"} Years
            </td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>No. of Openings</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">${job?.noOfPositions || 0}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding: 8px;"><strong>Priority</strong></td>
            <td style="border:1px solid #ddd; padding: 8px;">${job?.priority || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-bottom: 8px;">Key Skills Required</h3>
      <p>
        ${job?.skills?.length
      ? job.skills.map(skill => `
                <span style="
                  display:inline-block;
                  background:#DBEAFE;
                  color:#1D4ED8;
                  padding:4px 10px;
                  border-radius:12px;
                  font-size:12px;
                  margin:4px 4px 0 0;">
                  ${skill}
                </span>
              `).join("")
      : "N/A"
    }
      </p>

      <h3 style="margin-top: 20px;">Job Description</h3>
      <p>${job?.description || "N/A"}</p>

      <h3 style="margin-top: 20px;">Candidate Submission</h3>
      <p>Please submit candidate profiles using the link below:</p>

      <p>
        <a href="${publicSubmissionLink}"
           style="
            background:#2563EB;
            color:#fff;
            padding:10px 16px;
            text-decoration:none;
            border-radius:4px;
            display:inline-block;">
          Submit Candidate Profiles
        </a>
      </p>

      <p style="font-size:12px; color:#6B7280;">
        • Only relevant profiles will be considered<br/>
        • Duplicate profiles may be rejected<br/>
        • Profiles must be submitted via the above link
      </p>

      <p style="margin-top: 30px;">
        Regards,<br/>
        <strong>${user?.firstName || ""} ${user?.lastName || ""}</strong><br/>
        Talent Acquisition Team<br/>
        ${company || "AndGate Informatics"}<br/>
        📧 ${user?.email || ""}
      </p>

      <p style="font-size:11px; color:#9CA3AF;">
        This is a system-generated email. Please do not reply.
      </p>

    </div>
  `;
};


module.exports = {
  htmlTemplate,
  candidateHtml,
  interviewerHtml,
  candidateHtmlWithoutLink,
  interviewerHtmlWithoutLink,
  newUserTemplate,
  ForgetPass,
  eventRejectionHtml,
  eventApprovalHtml,
  invoiceEmailHtml,
  rejectCandidate,
  OnboardingEmailTemplate,
  ReviewRequestEmailTemplate,
  jobRequirementEmailHtml
};
