import Message from "../models/messageModel.js";
import PlannedMessage from "../models/plannedMessageModel.js";

export const movePlannedMessagesToMessages = async () => {
  try {
    console.log(`movePlannedMessagesToMessages triggered`)

    const now = new Date();

    // Find all planned messages where the scheduled time has passed
    const plannedMessages = await PlannedMessage.find({
      datetime: {
        $lt: now
      }
    });


    for (const plannedMessage of plannedMessages) {

      const message = new Message({ message: plannedMessage.message });

      await message.save();
      // Remove the plannedMessage from database
      await PlannedMessage.findByIdAndDelete(plannedMessage._id);

      console.log(`Deleted planned message: ${plannedMessage.message}`);

    }
  } catch (error) {
    throw new error;
  }
};
