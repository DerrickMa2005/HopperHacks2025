'use client'
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
export default function HomePage(){
    const router = useRouter();
    return(
        <div className = 'flex flex-col items-center text-4xl'>
            <h1>Transfer Successful!</h1>
            <Button variant = 'contained' onClick = {() => router.push('/questionPage')}>Transfer More Events</Button>
        </div>
    )

}