'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { Navbar } from '../Components/navbar';
import EventTab from '../Components/eventTab';
export default function Events(){
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [eventList, setEventList] = useState<Record<string,string>[]>([]);
    useEffect(() => {
        setEventList(JSON.parse(localStorage.getItem("events") || "[]"));

    }, []);
    return(
        <div className = 'mb-10'>
            <Navbar />
            <div className = 'flex flex-col items-center mt-12 gap-8'>
                
                <h1 className = 'text-4xl'>Your Recommended Events</h1>
                <div className = 'flex flex-col items-center rounded-md gap-8 w-3/4'>
                    {eventList.map((e:Record<string,string>) => <EventTab key={e.title} event={e}/>)}
                </div>
                <Button variant = 'contained' onClick = {() => isLoggedIn ? null: router.push('/signin') }>{isLoggedIn ? "Transfer Events": "Log in or register"}</Button>
            </div>
        </div>
    )
}