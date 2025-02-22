'use client'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
export default function SignIn() {
    const supabase = createClient('https://cvgvsplspmhoomurnsmy.supabase.co/', '<INSERT PROJECT ANON API KEY>')
    const App = () => <Auth supabaseClient={supabase} providers={['google']} appearance={{
        theme: ThemeSupa,

    }} />
    return (
        <div className='mt-40 max-w-lg m-auto'>
            <App></App>
        </div>
    )
}