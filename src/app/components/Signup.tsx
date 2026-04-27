import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();

  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !gender || !city) {
      alert("Fill all fields");
      return;
    }

    if (!agree) {
      alert("You must agree to terms");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        email,
        gender,
        city,
        bio: "New traveler ✈️",
        createdAt: new Date(),
      });

      alert("Account created ");

      // ✅ FIXED ROUTE
      navigate("/dashboard");

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-violet-500 text-white">
      <h1 className="text-center text-3xl mt-10">Create account</h1>

      <div className="flex justify-center mt-10">
        <div className="bg-white text-black p-8 rounded w-[500px]">

          <input
            placeholder="Email *"
            className="border p-2 w-full mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password *"
            className="border p-2 w-full mb-4"
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="border p-2 w-full mb-4"
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Gender *</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            placeholder="City *"
            className="border p-2 w-full mb-4"
            onChange={(e) => setCity(e.target.value)}
          />

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>I agree</span>
          </div>

          <button
            onClick={handleSignup}
            className="bg-green-500 text-white w-full py-3 rounded"
          >
            Create account
          </button>

          <p className="text-center mt-4">
            Already a member? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

console.log("Signup clicked");