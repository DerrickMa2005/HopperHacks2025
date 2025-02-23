'use client'
import { useState } from 'react';
import { Button, FormControl, MenuItem, Select, InputLabel, SelectChangeEvent, TextField} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Modal } from '@mui/material';
import { time } from 'console';

export default function DropdownForm({open, handleOpen} : {open : boolean, 
    handleOpen : (open: boolean) => void}){
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
        const [category, setCategory] = useState("");
        const [startTime, setStartTime] = useState("12:00");
        const [endTime, setEndTime] = useState("12:00");
        const [perk, setPerk] = useState("");
        const [startWrong, setStartError] = useState(false);
        const [endWrong, setEndError] = useState(false);
        const categories = ["Arts and Crafts", "Asian, Pacific Islander, Desi American Heritage Month", "Beyond the Brook - Off Campus Trips", "Black History Month",
            "Career/Networking", "Civic Engagement", "Community Service", "Disability/Ability Awareness", "Earthstock", "Health and Wellness", "Hispanic Heritage Month",
            "Movies and Games", "New Student Programs", "Performance", "Pride Month", "Professional Development/Leadership", "Religious Service / Celebration",
            "SBU Weeks of Welcome", "Social Action", "Sporting/Athletic Program", "Veterans", "Virtual Event", "Women's History Month"];
        const perks = ["Credit", "Free Food", "Free Stuff"];
    const handleSubmit = () => {
        if (Number(startTime.slice(0, 2)) > Number(endTime.slice(0, 2)) ||
        Number(endTime.slice(0, 2)) < Number(startTime.slice(0, 2)) || startWrong || endWrong){
            setStartError(true);
            setEndError(true);
            return;
        }
        handleOpen(false);
        localStorage.setItem("category", category);
        localStorage.setItem("perk", perk);
        localStorage.setItem("time", startTime + "-" + endTime);
    }
    const startError = (time: string) => {
        if (endTime.length !== 0 && Number(time.slice(0, 2)) > Number(endTime.slice(0, 2))){
            console.log("Start time cannot be after end time");
            setStartError(true);
            return;
        }
        setEndError(false);
        setStartError(false);
        setStartTime(time);
    }
    const endError = (time: string) => {
        if (startTime.length !== 0 && Number(time.slice(0, 2)) < Number(startTime.slice(0, 2))){
            console.log("End time cannot be before start time");
            setEndError(true);
            return;
        }
        setStartError(false);
        setEndError(false);
        setEndTime(time);
    }
    return (
    <Modal
        open={open}
        onClose={() => handleOpen(false)}>
    <div className = 'bg-green-200 w-[90%] h-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-8 items-center rounded-md p-4'>
        <div className='flex flex-col mt-6 items-center gap-8'>
                <h1 className='text-3xl mb-6'>Please select your event preferences.</h1>
                <FormControl className='w-2/3'>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category" value={category} MenuProps={{PaperProps:{style:{maxHeight: 200, overflowY:"auto"}}}} onChange={(event: SelectChangeEvent) => setCategory(event.target.value)}>{categories.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <FormControl className='w-2/3'>
                    <InputLabel>Perks</InputLabel>
                    <Select label="Perks" value={perk} onChange={(event: SelectChangeEvent) => setPerk(event.target.value)}>{perks.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select>
                </FormControl>
                <FormControl className='w-2/3'>
                    {/* <Select label="Event Time" value = {timePeriod} onChange={(event: SelectChangeEvent) => setTimePeriod(event.target.value)}>{timePeriods.map((e) => <MenuItem key = {e} value = {e}>{e}</MenuItem>)}</Select> */}
                    <div className='flex flex-row gap-8 justify-center align-center'>
                        {startWrong ? 
                        <TextField
                        id = "start-time"
                        error
                        label = "Start Time"
                        defaultValue = "12:00"
                        type = "time"
                        onChange={(event) => startError(event.target.value)}/>
                        : <TextField
                        id = "start-time"
                        label = "Start Time"
                        defaultValue = "12:00"
                        type = "time"
                        onChange={(event) => startError(event.target.value)}/>}
                        <p className='text-2xl font-bold'>-</p>
                        {endWrong ? <TextField
                        id = "end-time"
                        label = "End Time"
                        error
                        defaultValue = "12:00"
                        type = "time"
                        onChange={(event) => endError(event.target.value)}/> :
                        <TextField
                        id = "end-time"
                        label = "End Time"
                        defaultValue = "12:00"
                        type = "time"
                        onChange={(event) => endError(event.target.value)}/>}
                    </div>
                </FormControl>
                <ThemeProvider theme={buttontheme}>
                    <Button variant='contained' size='medium' onClick={handleSubmit}>Save Changes</Button>
                </ThemeProvider>
        </div>
    </div>
    </Modal>
    );
}