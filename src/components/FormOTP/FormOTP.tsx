import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { authenticator } from 'otplib';
import "./FormOTP.css";

type FormOTPProps = {
  secret: string;
};

const FormOTP = ({ secret }: FormOTPProps) => {
  const [otps, setOtps] = useState<Array<string>>(new Array(4).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (value.length > 1 || isNaN(Number(value))) return;
    const newOtps = [...otps];
    newOtps[index] = value;
    setOtps(newOtps);
    // Move to the next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // handle key events (navegacion, borrado)
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if ((event.key === "Backspace" || event.key === "ArrowLeft") && !otps[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight") {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasteData = event.clipboardData.getData('text');
    // regex to check the length of the paste code
    if (/^\d{4}$/.test(pasteData)) {
      const codes = pasteData.split('');
      setOtps(codes);
      codes.forEach((code, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = code;
        }
      });
      inputRefs.current[codes.length - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otps.join('');
    const isValid = authenticator.check(otpCode, secret);

    alert(`OTP Entered: ${otpCode}, is valid: ${isValid}`);
    setOtps(new Array(4).fill(''));
  };

  return (
    <>
      <h1>We send you a Message</h1>
      <p>Please enter the 4 digits code that you receive in your phone</p>
      <div className='code-inputs'>
        {otps.map((otp, index) => (
          <input
            className='code-input'
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            id={`otp-input-${index}`}
            type="text"
            inputMode="numeric"
            value={otp}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e)}
          />
        ))}
      </div>
      <button onClick={handleSubmit}>
        Confirm Code
      </button>
    </>
  );
};

export default FormOTP;