import Inquiry from "../models/Inquiry.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendFcmNotification } from "../utils/sendFcm.js";

export const createInquiryService = async (payload) => {
  const inquiry = await Inquiry.create(payload);

  // Notify Admins
  try {
      const admins = await User.find({ role: "admin", status: "active" });
      
      for (const admin of admins) {
          // Send Email
          if (admin.email) {
              const subject = `New Inquiry from ${payload.name}`;
              const html = `
                  <h3>New Website Inquiry</h3>
                  <p><strong>Name:</strong> ${payload.name}</p>
                  <p><strong>Mobile:</strong> ${payload.mobile}</p>
                  <p><strong>Email:</strong> ${payload.email || "N/A"}</p>
                  <p><strong>Message:</strong> ${payload.message || "N/A"}</p>
                  <p><strong>Source:</strong> ${payload.source || "Website"}</p>
              `;
              await sendEmail(admin.email, subject, html);
          }

          // Send Push Notification
          if (admin.fcmToken) {
              await sendFcmNotification({
                  token: admin.fcmToken,
                  title: "New Inquiry Received 📩",
                  body: `${payload.name} has sent an inquiry.`,
                  data: { type: "INQUIRY", inquiryId: inquiry._id.toString() }
              });
          }
      }
  } catch (err) {
      console.error("Failed to send notifications for inquiry:", err);
      // Don't fail the request if notification fails
  }

  return {
    statusCode: 201,
    message: "Inquiry submitted successfully",
    data: inquiry,
  };
};

export const listInquiriesService = async () => {
    // Sort by newest first
  const inquiries = await Inquiry.find()
      .populate('project', 'projectName')
      .sort({ createdAt: -1 });
  return inquiries;
};

export const updateInquiryService = async (id, payload) => {
    const inquiry = await Inquiry.findByIdAndUpdate(id, payload, { new: true });
    if (!inquiry) {
        return {
            statusCode: 404,
            message: "Inquiry not found"
        }
    }
    return {
        statusCode: 200,
        message: "Inquiry updated successfully",
        data: inquiry
    }
}

export const deleteInquiryService = async(id) => {
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if(!inquiry) {
        return {
            statusCode: 404,
            message: "Inquiry not found"
        }
    }
    return {
        statusCode: 200,
        message: "Inquiry deleted successfully"
    }
}
