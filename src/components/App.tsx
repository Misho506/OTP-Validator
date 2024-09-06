import { useState } from "react";
import FormOTP from "./FormOTP/FormOTP";
import SendCode from "./SendCode/SendCode";
import "./App.css";

const App = () => {
  const [isCodeGenerated, setIsCodeGenerated] = useState<boolean>(false);
  const [secret, setSecret] = useState<string>('');

  return (
    <div className="container">
      {isCodeGenerated ?
        <FormOTP secret={secret} />
        :
        <SendCode setIsCodeGenerated={setIsCodeGenerated} setSecret={setSecret} />
      }
    </div>
  );
}

export default App;