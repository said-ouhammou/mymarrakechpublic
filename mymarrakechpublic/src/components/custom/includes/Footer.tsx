import { LocationEditIcon, MailIcon, PhoneIcon } from "lucide-react";

export default function Footer() {
  const travelFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'; // A safe sans-serif fallback



  return (
    <div className="" style={{ fontFamily: travelFont }}>
      {/* Main Footer */}
      <footer className="flex flex-col md:flex-row justify-between px-8 py-12 bg-[#f8f3ef]">
        {/* Logo & Brief Description */}
        <div className="md:w-1/4 flex flex-col items-center justify-center  md:justify-start mb-8 md:mb-0">
          <div className="w-64 mb-4">
            <img
              src="/logo.png"
              alt="Marrakech Agency Logo"
              className="w-full"
            />
          </div>
          <p className="text-sm text-gray-600 text-center md:text-left">
            Votre partenaire de confiance pour des expériences inoubliables à Marrakech.
            Découvrez la magie de la ville rouge avec nos services sur mesure.
          </p>
        </div>


        <div className="w-full md:w-1/4 text-center md:text-left">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2 inline-block">
              CONTACTEZ-NOUS
            </h2>
            <div className="space-y-3 mt-3">
              <p className="flex items-center justify-center md:justify-start">
                <PhoneIcon className="w-5 h-5 mr-2 text-[#cb947e]" />
                +212 626 851596 / +212 710 987189
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <MailIcon className="w-5 h-5 mr-2 text-[#cb947e]" />
                contact@mymarrakechagency.com
              </p>
              <div className="flex items-start justify-center md:justify-start">
                <LocationEditIcon className="w-5 h-5 mr-2 text-[#cb947e] mt-1" />
                <div>
                  <p className="font-medium text-sm">RÉSIDENCE LE NOYER A</p>
                  <p className="text-sm">RUE IBN SINA</p>
                  <p className="text-sm">MARRAKECH</p>
                </div>
              </div>
            </div>
          </div>

        {/* Services Column Group */}
        <div className="w-full md:w-1/4 text-center mt-6 md:mt-1 md:text-left">
          <div>
            <h2 className="font-bold text-sm mb-4 tracking-wide">NOS SERVICES</h2>
            <ul className="space-y-2 text-xs"><li>
              <a href="https://mymarrakechagency.com/activites/" className="hover:underline">ACTIVITÉS</a></li>
              <li><a href="https://mymarrakechagency.com/categorie-produit/day-pass/" target="_blank" className="hover:underline">DAY PASS</a></li>
              <li><a href="https://mymarrakechagency.com/kids/" target="_blank" className="hover:underline">KIDS</a></li>
              <li><a href="https://mymarrakechagency.com/spas-et-salons-de-beaute/" target="_blank" className="hover:underline">SPAS ET SALONS DE BEAUTÉ</a></li>
              <li><a href="https://mymarrakechagency.com/hebergements/" target="_blank" className="hover:underline">HÉBERGEMENTS</a></li>
              <li><a href="https://mymarrakechagency.com/evenements/" target="_blank" className="hover:underline">ÉVÈNEMENTS</a></li>
              <li><a href="https://mymarrakechagency.com/vehicules/transferts/" target="_blank" className="hover:underline">TRANSFERTS</a></li>
              <li><a href="https://mymarrakechagency.com/vehicules/" target="_blank" className="hover:underline">VÉHICULES</a></li>
              <li><a href="https://mymarrakechagency.com/contact/" target="_blank" className="hover:underline">CONTACT</a></li>
            </ul>
          </div>
        </div>

      </footer>

      {/* Copyright Bar */}
      <div className="bg-gray-100 py-4 px-8 text-center">
        <p className="text-sm" style={{ fontFamily: travelFont }}>
          © 2024 MY MARRAKECH | Tous droits réservés 
          {/* <a href="#" className="text-blue-500 hover:underline ml-1">Mentions légales</a> |
          <a href="#" className="text-blue-500 hover:underline ml-1">Politique de confidentialité</a> */}
        </p>
      </div>
    </div>
  );
}





// import React from "react";

// const Footer: React.FC = () => {
//   const services = [
//     "ACTIVITÉS",
//     "DAY PASS",
//     "KIDS",
//     "SPAS ET SALONS DE BEAUTÉ",
//     "HÉBERGEMENTS",
//     "ÉVÉNEMENTS",
//     "TRANSFERTS",
//     "VÉHICULES",
//     "CONTACT",
//   ];

//   return (
//     <footer className="bg-white border-t border-gray-200 pt-12 pb-6 text-gray-700 text-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-wrap justify-between gap-8">
//           {/* Logo */}
//           <div className="w-full md:w-1/3 flex justify-center md:justify-start">
//             <img
//               src="/logo.png"
//               alt="My Marrakech Logo"
//               className="h-20 object-contain"
//             />
//           </div>

//           {/* Contact */}
//           <div className="w-full md:w-1/3 text-center md:text-left">
//             <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2 inline-block">
//               CONTACTEZ-NOUS
//             </h2>
//             <div className="space-y-3 mt-3">
//               <p className="flex items-center justify-center md:justify-start">
//                 <PhoneIcon className="w-5 h-5 mr-2 text-[#cb947e]" />
//                 +212 626 851596 / +212 710 987189
//               </p>
//               <p className="flex items-center justify-center md:justify-start">
//                 <MailIcon className="w-5 h-5 mr-2 text-[#cb947e]" />
//                 contact@mymarrakechagency.com
//               </p>
//               <div className="flex items-start justify-center md:justify-start">
//                 <LocationIcon className="w-5 h-5 mr-2 text-[#cb947e] mt-1" />
//                 <div>
//                   <p className="font-medium">RÉSIDENCE LE NOYER A</p>
//                   <p>RUE IBN SINA</p>
//                   <p>MARRAKECH</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Services */}
//           <div className="w-full md:w-1/3 text-center md:text-right">
//             <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2 inline-block">
//               NOS SERVICES
//             </h2>
//             <ul className="space-y-2 mt-3">
//               {services.map((service) => (
//                 <li key={service}>
//                   <a
//                     href="#"
//                     className="hover:text-[#cb947e] transition-colors duration-200"
//                   >
//                     {service}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-6 flex justify-center md:justify-end">
//               <img
//                 src="https://placeholder.pics/svg/30x20/DEDEDE/555555/FR"
//                 alt="French flag"
//                 className="h-5 w-auto"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t mt-10 pt-4 flex flex-wrap items-center justify-between text-center text-gray-500">
//           <p className="w-full md:w-auto mb-2 md:mb-0">
//             © 2024 MY MARRAKECH | Tous droits réservés
//           </p>
//           <div className="w-full md:w-auto flex justify-center md:justify-end space-x-4">
//             <a href="#" className="hover:underline">
//               Mentions légales
//             </a>
//             <span>|</span>
//             <a href="#" className="hover:underline">
//               Politique de confidentialité
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// type IconProps = React.SVGProps<SVGSVGElement>;

// const PhoneIcon: React.FC<IconProps> = (props) => (
//   <svg
//     {...props}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//     />
//   </svg>
// );

// const MailIcon: React.FC<IconProps> = (props) => (
//   <svg
//     {...props}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//     />
//   </svg>
// );

// const LocationIcon: React.FC<IconProps> = (props) => (
//   <svg
//     {...props}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>
// );

// export default Footer;

