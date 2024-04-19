import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from "@/context/AuthContext";


const AuthLayout = () => {
    const { isAuthenticated } = useUserContext();
    return (
      <>
        {isAuthenticated ? (
          <Navigate to="/" />
        ) : (
          <>
            <section className="flex flex-1 justify-center items-center flex-col py-10">
            <div style={{ zoom: '80%' }}>
                <Outlet />
             </div>           
            </section>
  
            <img
              src="/assets/images/IMG_2605.jpg"
              alt="logo"
              className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            />
          </>
        )}
      </>
    );
  }
export default AuthLayout

//////////////////////////////////////////////////////////////////
// import { Navigate, Outlet } from 'react-router-dom';
// import { useUserContext } from "@/context/AuthContext";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"

// const AuthLayout = () => {
//     const { isAuthenticated } = useUserContext();
//     return (
//       <>
//         {isAuthenticated ? (
//           <Navigate to="/" />
//         ) : (
//           <>
//             <section className="flex flex-1 justify-center items-center flex-col py-10">
//             <div style={{ zoom: '80%' }}>
//                 <Outlet />
//              </div>           
//             </section>

//           <div className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat mt-40 mr-2 ml-16" >

//            <Accordion type="single" collapsible className="width: 50%;">
//       <AccordionItem value="item-1">
//         <AccordionTrigger>Is it accessible?</AccordionTrigger>
//         <AccordionContent>
//           Yes. It adheres to the WAI-ARIA design pattern.
//         </AccordionContent>
//       </AccordionItem>
//       <AccordionItem value="item-2">
//         <AccordionTrigger>Is it styled?</AccordionTrigger>
//         <AccordionContent>
//           Yes. It comes with default styles that matches the other
//           components&apos; aesthetic.
//         </AccordionContent>
//       </AccordionItem>
//       <AccordionItem value="item-3">
//         <AccordionTrigger>Is it animated?</AccordionTrigger>
//         <AccordionContent>
//           Yes. It's animated by default, but you can disable it if you prefer.
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>

//          </div>

  
           
//           </>
//         )}
//       </>
//     );
//   }
// export default AuthLayout
