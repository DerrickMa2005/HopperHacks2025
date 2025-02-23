'use client'
import { useState } from 'react';
import { Button} from '@mui/material';
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';


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
    return (
    <div className='bg-green-400 flex p-4 border-black border-b-4 items-center justify-between'>
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} 
                className='flex gap-4 items-center margin-100'>
                    {hover ? <HomeTwoToneIcon fontSize='large' onClick={() => router.push('/')}></HomeTwoToneIcon>
                    : <HomeOutlinedIcon fontSize='large' onClick={() => router.push('/')}></HomeOutlinedIcon>}
        </div>
        <ThemeProvider theme={buttontheme}>
            <div className='flex gap-4 justify-end items-center'>
                <Button variant='contained' size="medium" onClick={() => router.push("/signin")}>Sign In</Button>
                <Button variant='contained' size="medium" onClick={() => router.push('/signup')}>Sign Up</Button>
            </div>
        </ThemeProvider>
    </div>);
}