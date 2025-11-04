import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (email, password) => {
    console.log(email, password);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="text-white text-2xl font-bold mb-4">SIGN IN</div>
      </div>
      <div className="w-120 h-70 rounded-4xl shadow-lg flex flex-col gap-3 items-center justify-center bg-white/5">
        <input
          type="email"
          className="w-100 h-10 border-2 border-white/70 rounded-md text-white/90 focus:border-orange-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter email here"
        />
        <input
          type="password"
          className="w-100 h-10 border-2 border-white/70 rounded-md text-white/90 focus:border-orange-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter password here"
        />
        <button
          onClick={() => handleSubmit(email, password)}
          className="font-bold text-white/80 w-100 h-10 bg-orange-400 rounded-sm"
        >
          LOGIN
        </button>
      </div>
    </>
  );
}
