'use client'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
export default function SignUp() {
    const supabase = createClient('https://cvgvsplspmhoomurnsmy.supabase.co/', '<INSERT PROJECT ANON API KEY>')
    const App = () => <Auth supabaseClient={supabase} providers={['google']} appearance={{ theme: ThemeSupa }} view="sign_up" />
    return (
        <div className='mt-40 m-auto max-w-lg'>
            <App></App>
        </div>
    )
}