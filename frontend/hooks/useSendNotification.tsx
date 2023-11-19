import { notifications } from '@mantine/notifications';
import { useCallback, useState } from "react";
import { useW3iAccount } from "@web3inbox/widget-react";
import { INotification } from "./types";
import { sendNotification } from "./fetchNotify";

function useSendNotification() {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { account: my_acc } = useW3iAccount();

  const handleSendNotification = async (notification: INotification) => {
      if (!my_acc) {
        return;
      }
      setIsSending(true);
      try {
        const { success, message } = await sendNotification({
          accounts: [ 
            "eip155:11155111:0x3847a460EB81De72E88dAf4614DfF72604e96907",
            "eip155:11155111:0xBaa37770a6486f8070E3B6e0ebbCEe5dd1320894",
            "eip155:1:0xBaa37770a6486f8070E3B6e0ebbCEe5dd1320894"
        ],
          notification,
        });
        setIsSending(false);

        notifications.show({
          title: success ? "Message sent." : "Message failed.",
          message: success ? message : "Please try again.",
          color: success ? "yellow" : "red",
        });
      } catch (error: any) {
        setIsSending(false);
        console.error({ sendNotificationError: error });
        notifications.show({
            color: "red",
            title: "Message failed.",
            message: "Please try again.",
        });
      }
    }

  return {
    handleSendNotification,
    isSending,
  };
}

export default useSendNotification;