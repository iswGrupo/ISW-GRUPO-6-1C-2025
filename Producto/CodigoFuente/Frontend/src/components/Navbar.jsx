import React from 'react';
 import logo from '../imgs/LOGO.png';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faCircleUser } from '@fortawesome/free-solid-svg-icons'; // <- este es el correcto
 
 const NavBar = () => {
   return (
     <nav className="navbar">
       <div className="navbar-brand flex items-center gap-2">
         <img
           src={logo}
           alt="Logo EcoHarmony"
           className="w-10 h-10 object-contain"
         />
         <h1>EcoHarmony Park</h1>
       </div>
       <ul className="navbar-links">
         <li><a href="/">Comprar Entrada</a></li>
         <li className="pl-2 pr-2">
           <a href="#profile">
             <FontAwesomeIcon icon={faCircleUser} size="lg" />
           </a>
         </li>
       </ul>
     </nav>
   );
 };
 
 export default NavBar;
