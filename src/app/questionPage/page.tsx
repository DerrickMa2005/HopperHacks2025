'use client'
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createTheme } from '@mui/material/styles';
import { Navbar } from '../Components/navbar';
import MenuIcon from '@mui/icons-material/Menu';
import DropdownForm from '../Components/dropdownForm';
export default function QuestionPage() {
    const [openPref, setPref] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const chatgptInput = formData.get("chatgptInput") as string;
        setIsLoading(true);
        if (!chatgptInput) return;
        try{
            const response = await fetch('/api/search', {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({"theme": chatgptInput, 
                    "category": localStorage.getItem("category") || "", "perk": localStorage.getItem("perk") || "", 
                    "time": localStorage.getItem("time") || ""})
            },   
            )
            const payload = await response.json();
            const data = JSON.stringify(payload.data);
            localStorage.setItem("events", data);
            router.push('/events');
            setIsLoading(false);
        }
        catch(error){
            setIsLoading(false);
            console.log(error);
        }
    };
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
        <div className='flex flex-col w-screen gap-0'>
            <Navbar />
            <div className='flex flex-row flex-start ml-2 mt-2 text-5xl mb:0'>
                <div className='rounded-xl bg-green-200 p-2 border-black border-4'>
                    <button onClick={() => setPref(true)}>
                        <MenuIcon fontSize='inherit'/>
                    </button>
                </div>
            </div>
                <form method="post" className="mt-32 w-screen h-screen flex flex-col items-center gap-8" onSubmit={handleSubmit}>
                    <p className="text-xl font-bold">How would you describe yourself?</p>
                    <input className="w-[80%] border-black border-4 p-2 rounded-lg" name="chatgptInput" 
                    placeholder="I am a computer science student who enjoys playing badminton..."/>
                    <button type="submit" className="border-black border-4 p-2 rounded-lg"
                    disabled={isLoading}>{isLoading ? "Searching. . ." : "Find Events for Me"}</button>
                </form>
            <DropdownForm open={openPref} handleOpen={setPref}/>
        </div>
    )
}