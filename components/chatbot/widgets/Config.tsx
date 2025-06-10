import { createChatBotMessage } from "react-chatbot-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import logo_img from "../../../app/assests/images/nandu tours and travels logo png.png";

import headerImage from "../../../app/assests/images/picsvg_download.png";
import Options from "./comp/Options";
import BusSearch from "./comp/BusSearch";
import BookingDetails from "./comp/BookingDetails";
import LoyaltyPointsForm from "./comp/LoyaltyPointsForm";
import CustomerSupport from "./comp/CustomerSupport";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "@/app/Redux/authSlice";
import { useMemo, useState } from "react";

interface MessageOptions {
  widget?: string;
  delay?: number;
  payload?: any;
}

interface Config {
  botName: string;
  initialMessages: any[];
  customComponents: {
    header: () => React.ReactElement;
    userAvatar: React.FC<any> | null;
  };
  widgets: {
    widgetName: string;
    widgetFunc: (props: any) => React.ReactElement;
    mapStateToProps?: string[];
  }[];
  state: Record<string, unknown>;
  messageParser: any;
  actionProvider: ActionProvider;
}

const config = (): Config => {
  const botName = "Nandhu Bus";
  const authData = useSelector(selectAuth); 
  const dispatch=useDispatch();
  const [setStateFunc, setSetStateFunc] = useState<(stateFunc: (prevState: any) => any) => void>();



  const initialMessages = [
    createChatBotMessage("Welcome to Nandhu Bus! How can I assist you today?", {
      widget: "options",
    }),
  ];

  const widgets = [
    {
      widgetName: "busSearch",
      widgetFunc: (props: any) => <BusSearch {...props} />,
    },
    {
      widgetName: "bookingDetails",
      widgetFunc: (props: any) => <BookingDetails {...props} />,
    },
    {
      widgetName: "loyaltyPoints",
      widgetFunc: (props: any) => <LoyaltyPointsForm {...props} />,
    },
    {
      widgetName: "customerSupport",
      widgetFunc: (props: any) => <CustomerSupport {...props} />,
    },
    {
      widgetName: "options",
      widgetFunc: (props: any) => <Options {...props} />,
    },
  ];
  const actionProvider = new ActionProvider(
    createChatBotMessage,
    setStateFunc || ((stateFunc) => {})
  );
  

  return {
    botName,
    initialMessages,
    customComponents: {
      header: () => (
        <div className="bg-[#0f2454] p-2 rounded-none flex items-center text-white font-bold">
          <img
            src={logo_img.src}
            alt="Header"
            className="w-10 h-10 mr-2"
          />
          <div>
            <p className="text-sm font-semibold">{botName}</p>
            <p className="text-[10px] -mt-1 text-gray-300">Online</p>
          </div>
        </div>
      ),
      userAvatar: null,
    },
    widgets,
    state: {},
    actionProvider,
    messageParser: new MessageParser(actionProvider, {}),
  };
};

export default config;
