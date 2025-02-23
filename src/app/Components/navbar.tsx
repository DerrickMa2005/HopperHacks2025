'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { auto } from 'openai/_shims/registry.mjs';


export function Navbar() {
    const [hover, setHover] = useState(false);
    const [user, setUser] = useState("");
    const [userPicture, setUserPicture] = useState("");
    const router = useRouter();
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
  // Google OAuth login flow
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      localStorage.setItem("token", token);          // Save token
      try {
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data.email);
        localStorage.setItem("email", data.email);   // Save email
        setUserPicture(data.picture);
      } catch (error) {
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
    <div className='bg-green-400 flex p-4 border-black border-b-4 items-center justify-between'>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className='flex gap-4 items-center'
      >
        {hover ? (
          <HomeTwoToneIcon fontSize='large' onClick={() => router.push('/')} />
        ) : (
          <HomeOutlinedIcon fontSize='large' onClick={() => router.push('/')} />
        )}
      </div>

      <ThemeProvider theme={buttontheme}>
        <div className='flex gap-4 justify-end items-center'>
          {user ? (
            <Image
              onClick={logout}
              src={userPicture || "/placeholder.png"}
              alt=''
              width="50"
              height="50"
            />
          ) : (
            <Button variant='contained' size="medium" onClick={() => login()}>
              Sign In
            </Button>
          )}
        </div>
      </ThemeProvider>
    </div>
  );
}