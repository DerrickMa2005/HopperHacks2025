'use client'
import { Button } from '@mui/material';
import Font from 'react-font';
import { useRouter } from 'next/navigation';
import SampleEventWheel from './Components/sampleEvents';
import { createTheme, ThemeProvider } from '@mui/material/styles';




export default function Home() {
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
  const router = useRouter();
  return (

    <div className="mb-12">
      <ThemeProvider theme={buttontheme}>
        <div className='bg-green-400 flex justify-end p-4 gap-4 border-black border-b-4'>
          <Button variant='contained' size="medium" onClick={() => router.push("/signin")}>Sign In</Button>
          <Button variant='contained' size="medium" onClick={() => router.push('/signup')}>Sign Up</Button>
        </div>
      </ThemeProvider>
      <Font family="Funnel Sans">
        <div className='text-4xl flex flex-col gap-16 items-center mt-24'>
          <div className='flex flex-col gap-10 items-center'>
            <h1>Looking to get out of your dorm but keep missing club events?</h1>
            <h1>Not sure what events campus has to offer?</h1>
          </div>
          <div className='flex flex-row gap-4 items-center justify-center'>
            <p className='text-5xl'>Introducing</p>
            <p className='text-5xl underline hover:text-7xl ease-out duration-300'>SBUWYD</p>
          </div>
          <div className='flex gap-8'>
            <div className='border-solid border-black border-2 p-4 rounded-md flex flex-col gap-4 max-w-lg bg-red-200'>
              <h1>Google Calendar Integration</h1>
              <div className='border-black border-2 w-full flex flex-col'></div>
              <p className='text-[1.5rem]'>Import events into Google Calendar to more easily track events of interest and make sure you don't miss any</p>
            </div>
            <div className='border-solid border-black border-2 p-4 rounded-md flex flex-col gap-4 max-w-lg bg-red-200'>
              <h1>Event Recommendation</h1>
              <div className='border-black border-2 w-full flex flex-col'></div>
              <p className='text-[1.5rem]'>Comprehensive recommender system to inform you of events based on your preferences and interests</p>
            </div>
          </div>
          <div className='flex-col gap-8 items-center flex'>
            <h1>Current Events:</h1>
            <div className='w-screen'>
              <SampleEventWheel />
            </div>
          </div>
          <ThemeProvider theme={buttontheme}>
            <Button className={"hover:drop-shadow-lg ease-in duration-300"} variant='contained' size="large" onClick={() => router.push('/questionPage') }>Find Tailored Events</Button>
        </ThemeProvider>
        </div>
      </Font >
    </div >
  );
}
