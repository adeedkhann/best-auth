import React from "react";

   export const Email = ({ placeholder = "Enter email" }: { placeholder?: string }) => {
     return (
       <input 
         type="email" 
         placeholder={placeholder} 
         className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
       />
     );
   };