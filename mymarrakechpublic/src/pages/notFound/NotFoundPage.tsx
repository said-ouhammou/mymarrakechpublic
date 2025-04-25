import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="h-96 flex flex-col items-center justify-center px-4 text-center bg-[#f8f3ef]">
      <h1 className="text-7xl font-bold text-gray-900">404</h1>
      <h2 className="text-2xl font-semibold mt-4 text-gray-800">Page non trouvée</h2>
      <p className="mt-2 text-gray-500">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-2 bg-[#cb947e] text-gray-900 rounded-full cursor-pointer hover:bg-[#cb947e]/90 transition"
      >
        Retour à la page précédente
      </button>
    </div>
  )
}
