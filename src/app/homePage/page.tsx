'use client'
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Navbar } from '../Components/navbar';
export default function HomePage(){
    const router = useRouter();
    return(
        <div className = 'flex flex-col items-center'>
            <Navbar />
                <div className = 'flex flex-col items-center mt-24 gap-8'>
                    <h1 className = 'text-4xl'>Your Events</h1>
                    <Button variant = "contained" onClick={() => router.push('/questionPage')}>Get new events</Button>
                </div>
        </div>
    )

}