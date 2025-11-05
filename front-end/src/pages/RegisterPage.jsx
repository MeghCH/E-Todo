export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Créer un compte
        </h1>
        <p className="text-gray-600 mb-6">
          Bienvenue ! Remplis le formulaire ci-dessous.
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="name"
            placeholder="Name"
            className="border border-gray-300 rounded-lg p-2"
          />

          <input
            type="firsname"
            placeholder="firstname"
            className="border border-gray-300 rounded-lg p-2"
          />

          <input
            type="email"
            placeholder="Adresse email"
            className="border border-gray-300 rounded-lg p-2"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="border border-gray-300 rounded-lg p-2"
          />

          <input
            type="date"
            placeholder="date"
            className="border border-gray-300 rounded-lg p-2"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
