'use client'
import { Button } from '@mui/material';
import Font from 'react-font';
export default function HomePage(){
    return(
        <Font family="Funnel Sans">
        <div className = 'flex flex-col items-center mt-24 gap-8'>
            <h1 className = 'text-4xl'>Your Events</h1>
            <Button variant = "contained">Get new events</Button>
        </div>
        </Font>
    )

}