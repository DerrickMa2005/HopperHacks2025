'use client'
import { useState } from 'react';
import { Button, FormControl, MenuItem, Select, InputLabel, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import Font from 'react-font';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Navbar} from '../Components/navbar';
export default function QuestionPage() {
    const [category, setCategory] = useState("");
    const [theme, setTheme] = useState("");
    const [timePeriod, setTimePeriod] = useState("");
    const [perk, setPerk] = useState("");
    const router = useRouter();
    const themes = ["Arts and Music", "Athletics", "Service", "Cultural", "Fundraising", "Group Business", "Social", "Spirituality", "Learning"];
    const categories = ["Arts and Crafts", "Asian, Pacific Islander, Desi American Heritage Month", "Beyond the Brook - Off Campus Trips", "Black History Month",
        "Career/Networking", "Civic Engagement", "Community Service", "Disability/Ability Awareness", "Earthstock", "Health and Wellness", "Hispanic Heritage Month",
        "Movies and Games", "New Student Programs", "Performance", "Pride Month", "Professional Development/Leadership", "Religious Service / Celebration",
        "SBU Weeks of Welcome", "Social Action", "Sporting/Athletic Program", "Veterans", "Virtual Event", "Women's History Month"];
    const perks = ["Credit", "Free Food", "Free Stuff"];
    const timePeriods = ["12:00 - 2:00", "2:00 - 4:00", "4:00 - 6:00", "6:00 - 8:00", "8:00 - 10:00"];
    const handleSubmit = async () =>{
        try{
            const response = await fetch('/api/search', {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({"theme": theme, "category": category, "perk": perk, "Time Period": timePeriod})
            },   
            )
            const payload = await response.json();
            const data = JSON.stringify(payload.data);
            localStorage.setItem("events", data);
            router.push('/events');
        }
        catch(error){
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
    <div className="mb-8">
        <Navbar />
        <Font family="Funnel Sans">
            <div className='flex flex-col mt-24 items-center gap-8'>
                <h1 className='text-3xl mb-6'>Please select your event preferences.</h1>
                <FormControl className='w-1/6'>
                    <InputLabel>Theme</InputLabel>
                    <Select label="Theme" value={theme} onChange={(event: SelectChangeEvent) => setTheme(event.target.value)}>{themes.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <FormControl className='w-1/6'>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category" value={category} MenuProps={{PaperProps:{style:{maxHeight: 200, overflowY:"auto"}}}} onChange={(event: SelectChangeEvent) => setCategory(event.target.value)}>{categories.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <FormControl className='w-1/6'>
                    <InputLabel>Perks</InputLabel>
                    <Select label="Perks" value={perk} onChange={(event: SelectChangeEvent) => setPerk(event.target.value)}>{perks.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <FormControl className='w-1/6'>
                <InputLabel>Event Time</InputLabel>
                <Select label="Event Time" value = {timePeriod} onChange={(event: SelectChangeEvent) => setTimePeriod(event.target.value)}>{timePeriods.map((e) => <MenuItem key = {e} value = {e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <ThemeProvider theme={buttontheme}>
                    <Button variant='contained' size='medium' onClick={handleSubmit}>Show Me My Events</Button>
                </ThemeProvider>
            </div>
        </Font>
    </div>
    )
}