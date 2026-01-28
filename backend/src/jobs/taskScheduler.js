
import cron from "node-cron";
import { LeadTask } from "../models/LeadTask.js";
import User from "../models/User.js";
import { sendFcmNotification } from "../utils/sendFcm.js";

export const startTaskScheduler = () => {
    console.log("⏰ Task Scheduler Started...");

    // Run every minute
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const upcomingWindow = new Date(now.getTime() + 20 * 60000); // look ahead 20 mins max

            // Find pending tasks scheduled in the near future (today)
            // We optimize by looking at a narrow window
            const tasks = await LeadTask.find({
                status: "pending",
                scheduledAt: { $gte: now, $lte: upcomingWindow },
            }).populate("assignedTo");

            for (const task of tasks) {
                if (!task.assignedTo?.fcmToken) continue;

                const diffMs = task.scheduledAt - now;
                const diffMins = Math.floor(diffMs / 60000); // 15, 10, 5, etc.

                // Helper to send
                const send = async (type) => {
                    console.log(`Sending ${type} reminder for task ${task._id}`);
                    await sendFcmNotification({
                        token: task.assignedTo.fcmToken,
                        title: `🔔 Reminder: ${type} to go!`,
                        body: `${task.taskType.toUpperCase()} at ${task.taskTime} - ${task.remark}`,
                        data: { taskId: task._id.toString(), type: "TASK_REMINDER" }
                    });
                };

                // 15 Min Reminder (Check Range 14-16 to be safe or strictly check flags)
                // Using flags is safer to avoid double sending
                if (diffMins <= 15 && diffMins > 10 && !task.remindersSent.min15) {
                    await send("15 min");
                    task.remindersSent.min15 = true;
                    await task.save();
                }

                // 10 Min Reminder
                else if (diffMins <= 10 && diffMins > 5 && !task.remindersSent.min10) {
                    await send("10 min");
                    task.remindersSent.min10 = true;
                    await task.save();
                }

                // 5 Min Reminder
                else if (diffMins <= 5 && diffMins > 0 && !task.remindersSent.min5) {
                    await send("5 min");
                    task.remindersSent.min5 = true;
                    await task.save();
                }
            }
        } catch (error) {
            console.error("Task Scheduler Error:", error);
        }
    });
};
