import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";

export default function RegisterPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-950">
      <div className="bg-neutral-200 dark:bg-neutral-900 rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          Créer un compte
        </h1>

        <form className="flex flex-col gap-4">
          <TextInput
            type="name"
            placeholder="Name"
            className="rounded-lg p-2"
          />

          <TextInput
            type="firsname"
            placeholder="firstname"
            className="rounded-lg p-2"
          />

          <TextInput
            type="email"
            placeholder="Adresse email"
            className="rounded-lg p-2"
          />

          <TextInput
            type="password"
            placeholder="Mot de passe"
            className="rounded-lg p-2"
          />

          <TextInput
            type="date"
            placeholder="date"
            className="rounded-lg p-2"
          />

          <Button
            type="submit"
            className="text-neutral-900 dark:text-white mb-4 rounded-lg p-2 transition"
          >
            S'inscrire
          </Button>
        </form>
      </div>
    </div>
  );
}
