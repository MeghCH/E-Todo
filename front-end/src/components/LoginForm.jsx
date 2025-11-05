import { useState } from "react";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

export function LoginForm({ headline }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (email, password) => {
    console.log(email, password);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl font-bold mb-4">{headline}</div>
      </div>
      <div className="w-full max-w-120 rounded-2xl flex flex-col gap-3 items-center justify-center bg-neutral-200 dark:bg-neutral-900 p-4">
        <TextInput
          type="email"
          className="w-full"
          value={email}
          onChange={setEmail}
          placeholder="Email"
        />
        <TextInput
          type="password"
          className="w-full"
          value={password}
          onChange={setPassword}
          placeholder="Password"
        />
        <Button
          onClick={() => handleSubmit(email, password)}
          className="w-full"
        >
          LOGIN
        </Button>
      </div>
    </>
  );
}
