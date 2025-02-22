'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Font from 'react-font';
import { Button } from '@mui/material';
export default function Events(){
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return(
        <Font family="Funnel Sans">
        <div className = 'flex flex-col items-center mt-24 gap-8'>
            <h1 className = 'text-4xl'>Your Recommended Events</h1>
            <Button variant = 'contained' onClick = {() => isLoggedIn ? null: router.push('signin') }>{isLoggedIn ? "Transfer Events": "Log in or register"}</Button>
        </div>
        </Font>
    )
}