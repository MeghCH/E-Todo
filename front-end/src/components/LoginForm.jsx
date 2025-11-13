import { useState } from "react";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

export function LoginForm({ headline, onSubmit, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-full max-w-sm bg-neutral-200 dark:bg-neutral-900 rounded-2xl p-6 gap-4 shadow-md"
    >
      <h1 className="text-2xl font-bold mb-2">{headline}</h1>

      <TextInput
        type="email"
        className="w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <TextInput
        type="password"
        className="w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full hover text-white font-semibold py-2 rounded-lg transition"
      >
        {loading ? "Connexion..." : "LOGIN"}
      </Button>
    </form>
  );
}
