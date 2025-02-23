'use client'
import Image from 'next/image';
import { Modal, Button } from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LinkIcon from '@mui/icons-material/Link';
import Placeholder from '../Assets/placeholder.png';
import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Declare gapi as a global variable
declare const gapi: {
  load: (api: string, callback: () => void) => void;
  client: {
    init: (args: { apiKey: string; discoveryDocs: string[] }) => Promise<void>;
  };
};
/*
export default function EventPopUp({event, open, handleOpen} : {event: Record<string,string>, 
    open: boolean, handleOpen: (open: boolean) => void}) {
    const getTime = (date : string) => {
        var d = new Date(Number(date) * 1000);
        return (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) + ":" + 
        d.getMinutes() + (d.getMinutes() < 10 ? "0" : "") + " " + (d.getHours() > 12 ? "PM" : "AM");
    }
    const getDate = (date : string) => {
        var d = new Date(Number(date) * 1000);
        return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
    }
*/
export default function EventPopUp({
    event,
    open,
    handleOpen
  }: {
    event: Record<string, string>;
    open: boolean;
    handleOpen: (open: boolean) => void;
  }) {
    // A helper to format the date in your UI
    function getDate(timestamp: string) {
      const d = new Date(Number(timestamp) * 1000);
      return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    }
  
    // A helper to format the time in your UI
    function getTime(timestamp: string) {
      const d = new Date(Number(timestamp) * 1000);
      const hours = d.getHours();
      const mins = d.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const h = hours % 12 || 12;
      const m = mins < 10 ? `0${mins}` : mins;
      return `${h}:${m} ${ampm}`;
    }
  
    // Initialize the Google API client
    useEffect(() => {
      const script = document.createElement('script');
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        gapi.load('client', async () => {
          await gapi.client.init({
            apiKey: process.env.API_KEY as string,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          });
        });
      };
      document.body.appendChild(script);
    }, []);
  
    // Called when user clicks the calendar button
    async function handleCalendarIntegration() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in with Google first.");
        return;
      }
      try {
        // 1. Check existing events to see if this already exists
        const eventsResp = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const eventsData = await eventsResp.json();
  
        const userEmail = localStorage.getItem("email") || "sbywyd@gmail.com";
        const userAlreadyHasEvent = eventsData.items?.some((ev: any) => ev.summary === event.title);
  
        if (userAlreadyHasEvent) {
          // If event is found, pretend we are "updating invites"
          alert(`The Event "${event.title}" already exists in your Calendar. Sending invites...`);
          // Send an email or update event attendees here if you'd like
        } else {
          // If not found, create it
          const startIso = new Date(Number(event.start) * 1000).toISOString();
          const endIso = new Date(Number(event.end) * 1000).toISOString();
          const newEvent = {
            summary: event.title,
            description: event.description || "",
            start: { dateTime: startIso },
            end: { dateTime: endIso },
            attendees: [
              { email: userEmail }
            ],
            location: event.location || ""
          };
          const createResp = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newEvent)
          });
          if (!createResp.ok) {
            const errorData = await createResp.json();
            throw new Error(`Failed to create calendar event: ${errorData.error.message}`);
          }
          alert(`Created event "${event.title}". Invitation sent to ${userEmail}`);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to integrate with Google Calendar. Check the console for details.");
      }
    }
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
      <Modal
        open={open}
        onClose={() => handleOpen(false)}
        className='mb-10'
      >
        <div className='bg-green-200 w-[90%] h-[80%] absolute top-1/2 left-1/2 
          transform -translate-x-1/2 -translate-y-1/2 
          flex flex-col gap-8 items-start rounded-md p-4 mb-10'
        >
          {/* Close button */}
          <div className='flex flex-row justify-end w-full mb-2'>
            <button onClick={() => handleOpen(false)}>
              <HighlightOffOutlinedIcon fontSize='large' />
            </button>
          </div>
  
          {/* Title, date, and time */}
          <div className='flex flex-row justify-between gap-4 w-full h-[35%]'>
            <div className='flex flex-col flex-start items-start overflow-hidden'>
                <h2 className='underline'>{event.title}</h2>
                <p>Date: {getDate(event.start)}</p>
                <p>Time: {getTime(event.start)} - {getTime(event.end)}</p>
                <p>Location: {event.location}</p>
            </div>
            <Image
              src={!event.image ? Placeholder : event.image}
              unoptimized
              width={350}
              height={300}
              alt={event.title}/>
          </div>
          <p>{event.description}</p>
          {/* Buttons row */}
          <ThemeProvider theme={buttontheme}>
          <div className="flex flex-row gap-4 justify-around w-full mt-4">
            <Button variant="contained" onClick={handleCalendarIntegration}>
              <CalendarMonthOutlinedIcon fontSize="inherit" />
            </Button>
            <Button variant="contained" href={event.link || "#"} target="_blank">
              <LinkIcon fontSize="inherit" />
            </Button>
          </div>
          </ThemeProvider>
        </div>
      </Modal>
    );
  }
  /*
    return (
            <Modal
                open={open}
                onClose={() => handleOpen(false)}>
                    <div className = 'bg-green-200 w-[90%] h-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-8 items-start rounded-md p-4'>
                        <div className='flex flex-row justify-end w-[100%]'>
                            <button  onClick={() => handleOpen(false)}>
                                <HighlightOffOutlinedIcon fontSize='large' /></button>
                        </div>
                        <div className='flex flex-row justify-between gap-4 w-[100%] h-[50%]'>
                            <div className = 'flex flex-col flex-start items-start overflow-hidden'>
                                <h1 className="underline">{event.title}</h1>
                                <p>Hosted by: {event.main_host}</p>
                                <p>Date: </p>
                                <p>{getDate(event.start)}</p>
                                <p>Time: </p>
                                <p>{getTime(event.start)} - {getTime(event.end)}</p>
                                <p>Location: </p>
                                <p>{event.location}</p>
                            </div>
                            <Image
                                    src= {!event.image ? Placeholder : event.image}
                                    unoptimized
                                    width={300}
                                    height={200}
                                    alt="Picture of the author"
                                />
                        </div>
                        <p>{event.description}</p>
                        <div className='flex flex-row gap-4 justify-around w-[100%]'>
                            <div className='text-5xl'><CalendarMonthOutlinedIcon fontSize='inherit' /></div>
                            <Link href={event.link} target="_blank" className='text-5xl'><LinkIcon fontSize='inherit'/></Link>
                        </div>
                    </div>
            </Modal>
    );
}
*/