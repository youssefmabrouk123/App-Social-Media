import { Route, Routes } from 'react-router-dom';
import './globals.css';
import { Home } from './_root/pages';
import SignupForm from './_auth/forms/SignupForm';
import SigninForm from './_auth/forms/SigninForm';
import RootLayout from './_root/RootLayout';
import AuthLayout from './_auth/AuthLayout';
import { Toaster } from "@/components/ui/toaster"


const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>
            <Route element={<AuthLayout/>}>
            {/* public routes */}
            <Route path="/sign-in" element={<SigninForm/>} />
            <Route path="/sign-up" element={<SignupForm/>} />
            </Route> 
            {/* private routes */}
            <Route element={<RootLayout/>}>

            <Route index element={<Home/>} />
            </Route> 

        </Routes>
        <Toaster/>
    </main>
  )
}

export default App
