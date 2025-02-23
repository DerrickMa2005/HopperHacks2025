import {useEffect, useState} from 'react';
import { createClient } from '@supabase/supabase-js';
import {motion, useScroll, useTransform} from 'framer-motion';
import { useRef } from 'react';
import { section } from 'framer-motion/client';


const supabaseUrl = 'https://cvgvsplspmhoomurnsmy.supabase.co/';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3ZzcGxzcG1ob29tdXJuc215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNTQ1NzQsImV4cCI6MjA1NTgzMDU3NH0.CtuUnPiQqQNXP97LVwHDdf21cCfzaPdQ5kWQvLHY4Rc";
const supabase = createClient(supabaseUrl, supabaseKey);
async function getData() {
  const { data, error } = await supabase.from('SampleEventsS').select();
  if (error) {
    console.error(error);
    return [];
  }
  let events = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * data.length);
    events.push(data[randomIndex]);
  }
  return events;
}

export default function SampleEventWheel() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    getData().then(event => setEvents(event));
  },[]);
  return (
  <div  className = 'flex flex-direction-row gap-8'>
  {events.map((event, index) => ( event ?
    (<div className = 'h-40 w-72 border-solid border-black border-2 p-4 rounded-md flex flex-col gap-4 max-w-lg bg-red-200' key={index}>
      <p className = 'underline text-sm'>{event.title.split(" ").length < 10 ? event.title
      : event.title.split(" ").slice(0, 10).join(" ") + ". . ."}</p>
      <p className = 'text-xs'>{event.description.split(" ").length < 25 ? event.description 
      : event.description.split(" ").slice(0, 25).join(" ") + ". . ."}</p>
    </div>)
    : <div>
      <p className = 'underline text-sm'>No events available</p>
    </div>
  ))}
  </div>);
}