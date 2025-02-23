'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { Navbar } from '../Components/navbar';
import EventTab from '../Components/eventTab';
import { createTheme, ThemeProvider } from '@mui/material/styles';
export default function Events(){
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState("");
    const [eventList, setEventList] = useState<Record<string,string>[]>([]);
    useEffect(() => {
        setToken(localStorage.getItem("token") || "");
        setEventList(JSON.parse(localStorage.getItem("events") || "[]"));

    }, []);
  

    const handleButton = async () => {
        const response = await fetch("",{
            method: 'GET',
            headers: {
                
            }
        })
    }
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
    return(
        <div className='mb-15 h-screen w-screen'>
            <Navbar/>
            <div className = 'flex flex-col items-center mt-12 gap-8'>
                <h1 className = 'text-4xl'>Your Recommended Events</h1>
                <div className = 'flex flex-col items-center rounded-md gap-8 w-3/4'>
                {eventList.length === 0 ? <div>Try Adjusting your preferences to see more events.

                </div>:eventList.map((e:Record<string,string>) => <EventTab key={e.title} event={e}/>)}
                </div>
                <ThemeProvider theme={buttontheme}>
                    <Button variant = 'contained' onClick = {() => router.push('/questionPage')}>Didn't see anything you like?</Button>
                </ThemeProvider>
            </div>
        </div>
    )
}