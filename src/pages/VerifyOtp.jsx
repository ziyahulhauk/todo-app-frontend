import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    await axios.post("https://todo-hqdd.onrender.com/api/auth/verify-otp", {
      email,
      otp,
    });

    alert("Verified ✅");
    navigate("/");
  };

  return (
    <div>
      <h2>OTP Verify</h2>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />

      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default VerifyOtp;