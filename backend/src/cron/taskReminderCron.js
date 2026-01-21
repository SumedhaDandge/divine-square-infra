// cron/taskReminder.cron.js
import cron from "node-cron";
import { LeadTask } from "../models/LeadTask.js";
import User from "../models/User.js";
import { sendFcmNotification } from "../utils/sendFcm.js";
import { combineDateAndTime } from "../utils/dateTime.js";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 15 * 60 * 1000); // +15 mins

    const start = new Date(reminderTime);
    start.setSeconds(0, 0);

    const end = new Date(start);
    end.setSeconds(59, 999);

    const tasks = await LeadTask.find({
      status: "pending",
      reminderSent: false,
      taskDate: {
        $gte: new Date(start.setHours(0,0,0,0)),
        $lte: new Date(end.setHours(23,59,59,999)),
      },
    }).populate("assignedTo lead");

    for (const task of tasks) {
      const taskDateTime = combineDateAndTime(task.taskDate, task.taskTime);

      if (taskDateTime >= start && taskDateTime <= end) {
        const user = task.assignedTo;

        await sendFcmNotification({
          token: user.fcmToken,
          title: "⏰ Task Reminder",
          body: `You have a ${task.taskType.replace("_", " ")} in 15 minutes`,
          data: {
            taskId: task._id.toString(),
            type: "TASK_REMINDER",
          },
        });

        task.reminderSent = true;
        await task.save();
      }
    }
  } catch (error) {
    console.error("Task Reminder Cron Error:", error);
  }
});
