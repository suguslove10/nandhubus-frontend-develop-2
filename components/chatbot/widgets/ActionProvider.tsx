import { useLogin } from "@/app/hooks/login/useLogin";
import { createChatBotMessage } from "react-chatbot-kit";
import { AppDispatch } from "@/app/Redux/store";
import { logout, selectAuth } from "@/app/Redux/authSlice";
import { logoutUser } from "@/app/services/data.service";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

class ActionProvider {
   dispatchs = useDispatch();
   router=useRouter();
   auth = useSelector(selectAuth);
  private createChatBotMessage: (message: string, options?: any) => any;
  private setState: (stateFunc: (prevState: any) => any) => void;
  
  private handleSendOTP: (mobile: string) => Promise<boolean>;
  private handleVerifyOtp: (mobile: string, otp: string, onClose: () => void) => Promise<boolean>;

  constructor(
    createChatBotMessage: (message: string, options?: any) => any,
    setStateFunc: (stateFunc: (prevState: any) => any) => void,
   
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  

    // Initialize methods from useLogin hook
    const { handleSendOTP, handleVerifyOtp } = useLogin();
    this.handleSendOTP = handleSendOTP;
    this.handleVerifyOtp = handleVerifyOtp;
  }

  handleBusSearch = () => {
    const message = this.createChatBotMessage("Sure! Please enter your departure and destination cities.");
    this.updateChatbotState(message);
  };
  handleBookingDetails = async (state: any) => {
    
    // First check if user is authenticated
    if (this.auth.isAuthenticated) {
      const message = this.createChatBotMessage("Here are your Booking Details", { 
        widget: "bookingDetails" 
      });
      this.updateChatbotState(message);
      return; // Add this return to exit the function
    }
  
    
    if (!state.phoneNumber) {
      const message = this.createChatBotMessage("Please enter your phone number to continue.");
      this.updateChatbotState(message);
      state.awaitingPhoneNumber = true;
      return;
    }
  
    await this.handlePhoneNumber(state.phoneNumber);
  
    if (!state.otp) {
      const message = this.createChatBotMessage("Please enter the OTP sent to your phone.");
      this.updateChatbotState(message);
      state.awaitingOtp = true;
      return;
    }
  
    await this.handleOtp(state.otp);
  
    const message = this.createChatBotMessage("Here are your Booking Details", { 
      widget: "bookingDetails" 
    });
    this.updateChatbotState(message);
  };

  handleLoyaltyPoints = () => {
    const message = this.createChatBotMessage("You can redeem your loyalty points for discounts on tickets!");
    this.updateChatbotState(message);
  };

  handleCustomerSupport = () => {
    const message = this.createChatBotMessage("Customer Support", { widget: "customerSupport" });
    this.updateChatbotState(message);
  };

  handlePhoneNumber = async (phoneNumber: string) => {
    localStorage.setItem("mobileNumber", phoneNumber);
    const otpSent = await this.handleSendOTP(phoneNumber);

    const otpMessage = otpSent
      ? this.createChatBotMessage("Otp sent successfully,Please enter.")
      : this.createChatBotMessage("Failed to send OTP. Please try again.");
      
    this.updateChatbotState(otpMessage);
  };

  handleOtp = async (otp: string) => {
    const mobileNumber = localStorage.getItem("mobileNumber");
  
    if (!mobileNumber) {
      const errorMessage = this.createChatBotMessage("No phone number found. Please try again.");
      this.updateChatbotState(errorMessage);
      return;
    }
  
    const otpVerified = await this.handleVerifyOtp(mobileNumber, otp, () => {
      // This callback will only run on successful verification
      const loginMessage = this.createChatBotMessage("You are now logged in! 🎉");
      this.updateChatbotState(loginMessage);
  
      const bookingDetailsMessage = this.createChatBotMessage("Here are your Booking Details", {
        widget: "bookingDetails",
      });
      this.updateChatbotState(bookingDetailsMessage);
    });
  
    // Show error message if verification failed
    if (!otpVerified) {
      const errorMessage = this.createChatBotMessage("Invalid OTP. Please try again.");
      this.updateChatbotState(errorMessage);
    }
  };
  

  handleGreet = () => {
    const message = this.createChatBotMessage("Hello! 😍 How can I assist you today?", { widget: "options" });
    this.updateChatbotState(message);
  };

    handleLogout = async () => {
     try {
       await logoutUser(this.dispatchs);
       sessionStorage.clear();
       this.dispatchs(logout());
       this.router.push("/");
     } catch (error) {
       console.error("Logout failed:", error);
     }
   };
  handleThanks = () => {
    const message = this.createChatBotMessage("You're welcome! 😊 If you need any assistance, I'm here.");
    this.updateChatbotState(message);
  };

  handleOk = () => {
    const message = this.createChatBotMessage("Alright! 👍 Let me know if you need anything else.");
    this.updateChatbotState(message);
  };

  handleOptions = () => {
    const message = this.createChatBotMessage("Here are some options I can help you with.", { widget: "options" });
    this.updateChatbotState(message);
  };

  handleUnknownInput = () => {
    const message = this.createChatBotMessage("I'm sorry, I didn't understand that. 😕 Can you please rephrase?");
    this.updateChatbotState(message);
  };

  updateChatbotState = (message: any) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;
