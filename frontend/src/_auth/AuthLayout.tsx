import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    const isAuthenticated =false;
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
              src="/assets/images/side-img.svg"
              alt="logo"
              className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            />
          </>
        )}
      </>
    );
  }
export default AuthLayout
