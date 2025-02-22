'use client'
import { useState } from 'react';
import { Button, FormControl, MenuItem, Select, InputLabel, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import Font from 'react-font';
export default function QuestionPage() {
    const [eventType, setEventType] = useState("");
    const [timePeriod, setTimePeriod] = useState("");
    const router = useRouter();
    const categories = ["Academic/Honor Society", "Activism/Advocacy", 
    "Community Awareness/Service", "Cultural Organizations", "Fraternities and Sororities",
     "Graduate Organizations", "Leisure Activities", "Media Organizations", "Performance Organizatons",
      "Religious/Spiritual", "Sport Clubs", "University Department"];
      const timePeriods = ["12:00 - 2:00", "2:00 - 4:00", "4:00 - 6:00", "6:00 - 8:00", "8:00 - 10:00"];
    return (
        <Font family="Funnel Sans">
            <div className='flex flex-col mt-24 items-center gap-8'>
                <h1 className = 'text-3xl mb-12'>Please select your event preferences.</h1>
                <FormControl  className = 'w-1/12'>
                    <InputLabel>Event Type</InputLabel>
                    <Select value = {eventType} onChange = {(event: SelectChangeEvent) => setEventType(event.target.value) }>{categories.map((e) => <MenuItem key = {e} value ={e}>{e}</MenuItem>)}</Select>
                </FormControl> 
                <FormControl  className = 'w-1/12'>
                <InputLabel>Time</InputLabel>
                    <Select value = {timePeriod} onChange = {(event: SelectChangeEvent) => setTimePeriod(event.target.value)}>{timePeriods.map((period) => <MenuItem key = {period} value = {period}>{period}</MenuItem> )}</Select>
                </FormControl>
                <Button variant='contained' size='medium' onClick={() => eventType && timePeriod ? router.push("/events"): null}>Recommend Events</Button>
            </div>
        </Font>

    )
}