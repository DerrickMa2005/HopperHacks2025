'use client'
import { use, useState, useEffect } from 'react';
import { Button} from '@mui/material';
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import Image from 'next/image';
import { auto } from 'openai/_shims/registry.mjs';


export function Navbar() {
    const [hover, setHover] = useState(false);
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
    const [user, setUser] = useState("");
  const [userPicture, setUserPicture] = useState("");
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
      try{
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{
          method: "GET",
          headers: {"Authorization": `Bearer ${token}`}
      });
      const data = await response.json();
      setUser(data.email);
      localStorage.setItem("email", data.email);
      setUserPicture(data.picture);

      }
      catch(error){
        console.log(error);
      }
      
  }});
  const logout = () => {
    googleLogout();
    localStorage.clear();
    setUser("");
    setUserPicture("");
  }
    return (
    <div className='bg-green-400 flex p-4 border-black border-b-4 items-center justify-between'>
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} 
                className='flex gap-4 items-center margin-100'>
                    {hover ? <HomeTwoToneIcon fontSize='large' onClick={() => router.push('/')}></HomeTwoToneIcon>
                    : <HomeOutlinedIcon fontSize='large' onClick={() => router.push('/')}></HomeOutlinedIcon>}
        </div>
        <ThemeProvider theme={buttontheme}>
            <div className='flex gap-4 justify-end items-center'>
                            <div className='flex flex-row gap-4 justify-end items-center'>
                          {user ? <Image onClick = {() =>{
                            logout();
                          } } src = {userPicture} alt='' width = "50" height = "50"></Image>:<Button variant='contained' size="medium" onClick={() => login()}>Sign In</Button>}
                            </div>
            </div>
        </ThemeProvider>
    </div>);
}