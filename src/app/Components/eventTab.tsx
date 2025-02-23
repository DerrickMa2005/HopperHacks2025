import Image from 'next/image'
import { useState } from 'react';
import EventPopUp from './eventPopUp';
import DancingRoach from '../Assets/dancingroach.gif';

export default function EventTab({event} : {event: Record<string,string>}) {
    const [isOpen, setIsOpen] = useState(false);
    const getTime = (date : string) => {
        var d = new Date(Number(date) * 1000);
        return (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) + ":" + 
        d.getMinutes() + (d.getMinutes() < 10 ? "0" : "") + " " + (d.getHours() > 12 ? "PM" : "AM");
    }
    const getDate = (date : string) => {
        var d = new Date(Number(date) * 1000);
        return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    }
    return (
            <div className = 'flex flex-col items-center rounded-md gap-8 w-[100%]'>
                <button onClick={() => setIsOpen(true)} className = 'flex flex-row justify-between border-2 border-black rounded-md p-2 border-solid gap-4 w-[80%]'>
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
                        src= {!event.image ? DancingRoach : event.image}
                        unoptimized
                        width={300}
                        height={200}
                        alt={event.title}
                        />
                </button>
            <EventPopUp event={event} open={isOpen} handleOpen={setIsOpen}/>
            </div>
    );
}