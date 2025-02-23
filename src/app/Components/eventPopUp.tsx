import Image from 'next/image'
import Link from 'next/link';
import { Modal } from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LinkIcon from '@mui/icons-material/Link';

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
    return (
            <Modal
                open={open}
                onClose={() => handleOpen(false)}>
                    <div className = 'bg-green-200 w-[90%] h-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-8 items-start rounded-md p-4'>
                        <div className='flex flex-row justify-end w-[100%]'>
                            <button  onClick={() => handleOpen(false)}>
                                <HighlightOffOutlinedIcon fontSize='large' /></button>
                        </div>
                        <div className='flex flex-row justify-between gap-4 w-[100%]'>
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
                                    src= {event.image}
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
