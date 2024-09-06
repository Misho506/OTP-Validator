import { useState } from "react";
import axios from "axios";
import { authenticator } from 'otplib';
import "./SendCode.css";

type SendCodeProps = {
  setIsCodeGenerated: (isCodeGenerated: boolean) => void;
  setSecret: (secret: string) => void;
}

const SendCode = ({ setIsCodeGenerated, setSecret }: SendCodeProps) => {
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');

  const sendSms = async () => {// Generate a secret
    const secret = authenticator.generateSecret();
    authenticator.options = { digits: 4 }
    // Generate an OTP using the secret
    const token = authenticator.generate(secret);
    setSecret(secret);
    console.log(`Generated OTP: ${token}`);

    if (token) {
      // logs if you don't have your cellphone near
      try {
        const result = await axios.post('http://localhost:5000/send-sms', { to: userPhoneNumber, body: token });
        setIsCodeGenerated(true);
        console.log(`Message sent with SID: ${result.data.messageSid}`);
      } catch (error: any) {
        console.log(`Error: ${error.response.data.error}`);
      }
    }
  };

  return (
    <>
      <p>Insert your phone number with the countre code please (eg: +506)</p>
      <div className="code-inputs">
        <input
          className="phone-number"
          type="text"
          value={userPhoneNumber}
          onChange={(e) => setUserPhoneNumber(e.target.value)}
        />
      </div>
      <button onClick={sendSms}>
        Generate Code
      </button>
    </>
  )
};

export default SendCode;
