'use client'
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SampleEventWheel from './Components/sampleEvents';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import { googleLogout } from '@react-oauth/google';
import HomeIcon from '@mui/icons-material/Home';
import Chatbot from './Components/chatbot';

export default function Home() {
  const buttontheme = createTheme({
    palette: {
      primary: {
        main: '#686868',
      },
      secondary: {
        main: '#00ff00',
      },
    },
  });
  const [user, setUser] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const router = useRouter();
  useEffect(() => {
    autoLogin();
  }, []);
  const autoLogin = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        try{
            const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`}
        });
        const data = await response.json();
        setUser(data.email);
        setUserPicture(data.picture);

        }
        catch(error){
            console.log(error);
        }
    }
  }
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      localStorage.setItem("token", token);
      try {
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          method: "GET",
          headers: {"Authorization": `Bearer ${token}`}
      });
      const data = await response.json();
      setUser(data.email);
      setUserPicture(data.picture);
      localStorage.setItem("email", data.email);
      }
      catch (error) {
        console.log(error);
      }

  },
scope: "https://www.googleapis.com/auth/calendar.events"
});
  const logout = () => {
    googleLogout();
    localStorage.clear();
    setUser("");
    setUserPicture("");
  }
  return (

    <div className="mb-15 w-screen h-screen">
        <div className='text-4xl flex flex-col items-center'>
        <div className='bg-green-400 flex flex-row gap-10 items-center justify-between border-black border-b-2 w-screen p-4'>
        <div className='flex gap-4 items-center'>
          <HomeIcon fontSize='large'></HomeIcon>
        </div>
        <ThemeProvider theme={buttontheme}>
            <div className='flex flex-row gap-4 justify-end items-center'>
          {user ? <Image className="rounded-xl border-black border-4" onClick = {() =>{
            logout();
          } } src = {userPicture} alt='' width = "50" height = "50"></Image>:<Button variant='contained' size="medium" onClick={() => login()}>Sign In</Button>}
            </div>
          </ThemeProvider>
        </div>
      <div className='flex p-4 items-center justify-between'>
        <div className='text-4xl flex flex-col gap-16 items-center mt-10'>
          <div className='flex flex-col gap-10 items-center'>
            <h1>Looking to get out of your dorm but keep missing club events?</h1>
            <h1>Not sure what events campus has to offer?</h1>
          </div>
          <h1>{user}</h1>
          <div className='flex flex-row gap-4 items-center justify-center'>
            <p className='text-5xl'>Introducing</p>
            <div className='flex flex-row flex-start items-center gap-2'> 
            <p className='text-5xl underline hover:text-7xl ease-out duration-300 font-bold'>SBU~GOMO</p> 
            <p>🚀</p></div>
          </div>
          <div className='flex gap-8'>
            <div className='border-solid border-black border-2 p-4 rounded-md flex flex-col gap-4 max-w-lg bg-red-200'>
              <h1>Google Calendar Integration</h1>
              <div className='border-black border-2 w-full flex flex-col'></div>
              <p className='text-[1.5rem]'>Import events into Google Calendar to more easily track events of interest and make sure you don't miss any</p>
            </div>
            <div className='border-solid border-black border-2 p-4 rounded-md flex flex-col gap-4 max-w-lg bg-red-200'>
              <h1>Event Recommendation</h1>
              <div className='border-black border-2 w-full flex flex-col'></div>
              <p className='text-[1.5rem]'>Comprehensive recommender system to inform you of events based on your preferences and interests</p>
            </div>
          </div>
          <div className='flex-col gap-8 items-center flex'>
            <h1>Current Events:</h1>
            <div className='w-screen'>
              <SampleEventWheel />
            </div>
          </div>
          <ThemeProvider theme={buttontheme}>
            <Button className={"hover:drop-shadow-lg ease-in duration-300"} variant='contained' size="large" onClick={() => router.push('/questionPage') }>
              Find Tailored Events</Button>
        </ThemeProvider>
        </div>
      </div >
    </div>
    {/* <Chatbot /> */}
    </div>
  );
}
