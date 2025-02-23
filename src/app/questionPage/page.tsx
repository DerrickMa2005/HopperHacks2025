'use client'
import { useState } from 'react';
import { Button, FormControl, MenuItem, Select, InputLabel, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import Font from 'react-font';
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
        const response = await fetch('/api/search', {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({"theme": theme, "category": category, "perk": perk, "Time Period": timePeriod})
        },   
        )
        router.push('/events');
    };

    return (
        <Font family="Funnel Sans">
            <div className='flex flex-col mt-24 items-center gap-8'>
                <h1 className='text-3xl mb-12'>Please select your event preferences.</h1>
                <FormControl className='w-1/12'>
                    <InputLabel>Theme</InputLabel>
                    <Select value={theme} onChange={(event: SelectChangeEvent) => setTheme(event.target.value)}>{themes.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <FormControl className='w-1/12'>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} MenuProps={{PaperProps:{style:{maxHeight: 200, overflowY:"auto"}}}} onChange={(event: SelectChangeEvent) => setCategory(event.target.value)}>{categories.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <FormControl className='w-1/12'>
                    <InputLabel>Perks</InputLabel>
                    <Select value={perk} onChange={(event: SelectChangeEvent) => setPerk(event.target.value)}>{perks.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <FormControl className='w-1/12'>
                <InputLabel>Event Time</InputLabel>
                <Select value = {timePeriod} onChange={(event: SelectChangeEvent) => setTimePeriod(event.target.value)}>{timePeriods.map((e) => <MenuItem key = {e} value = {e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <Button variant='contained' size='medium' onClick={handleSubmit}>Recommend Events</Button>
            </div>
        </Font>

    )
}