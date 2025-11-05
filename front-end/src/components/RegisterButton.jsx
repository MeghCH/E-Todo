import { useNavigate } from "react-router-dom";

export default function RegisterButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200"
    >
      Register
    </button>
  );
}
