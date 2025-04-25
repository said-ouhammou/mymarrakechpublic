import { Frown } from 'lucide-react'; // You can use any other icon

export default function NoListingFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full 
    py-12 px-4 bg-[#f8f3ef] border border-gray-200 rounded-md">
      <Frown size={48} className="text-gray-400 mb-4" />
      <h2 className="text-lg font-semibold text-gray-600">Aucune activité trouvée</h2>
      <p className="text-sm text-gray-500 mt-2">Il n'y a pas d'activités disponibles pour le moment. Veuillez réessayer plus tard.</p>
    </div>
  );
}
