'use client'
import { Button } from '@mui/material';
import Font, { Text } from 'react-font';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <div className='flex justify-end mt-6 mr-4 gap-4'>
        <Button variant='outlined' size="medium" onClick ={() => router.push("/signin")}>Sign In</Button>
        <Button variant='outlined'size="medium" onClick = {() => router.push('/signup')}>Sign Up</Button>
      </div>
      <Font family="Funnel Sans">
        <div className='text-4xl flex flex-col gap-16 items-center mt-24'>
          <div className='flex flex-col gap-10 items-center'>
            <h1>Looking to get out of your dorm but keep missing club events?</h1>
            <h1>Not sure what events campus has to offer?</h1>
          </div>
          <h1 className = 'text-5xl'>Introducing SBUWYD</h1>
          <div className = 'flex gap-8'>
            <div className = 'border-solid border-black border-2 p-4 rounded-md flex flex-col gap-4 max-w-lg'>
              <h1>Google Calendar Integration</h1>
              <div className = 'border-black border-2 w-full flex flex-col'></div>
              <h2>Import events into Google Calendar to more easily track events of interest and make sure you don't miss any</h2>
            </div>
            <div className = 'border-solid border-black border-2 p-4 rounded-md flex flex-col gap-4 max-w-lg'>
              <h1>Event Recommendation</h1>
              <div className = 'border-black border-2 w-full flex flex-col'></div>
              <h2>Comprehensive recommender system to inform you of events based on your preferences and interests</h2>
            </div>
          </div>
          <Button variant='contained' size="large">Get Started</Button>
        </div>
      </Font>
    </div>
  );
}
