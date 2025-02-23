'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { Navbar } from '../Components/navbar';
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
    return(
        <div>
        <Navbar/>
        <div className = 'flex flex-col items-center mt-12 gap-8'>
            <h1 className = 'text-4xl'>Your Recommended Events</h1>
            <div className = 'flex flex-col items-center rounded-md gap-8 w-4/12'>
            {eventList.map((e:Record<string,string>) => <div key = {e.title} className = 'flex flex-col border-2 border-black rounded-md p-4 border-solid items-center gap-4'>
                <a className = 'text-sky-600' href={e.link} target="_blank">{e.title}</a>
                <h1>{e.date}</h1>
                <h1>{e.description}</h1>
                <h1>{e.location}</h1>
                {e.organizer === 'N/A' ? null: <h1>{e.organizer}</h1>}
            </div>)}
            </div>
            <Button variant = 'contained' onClick = {() => token ? router.push('/completionPage'): null}>{token ? "Transfer Events": "Log in or register"}</Button>
        </div>
        </div>
    )
}