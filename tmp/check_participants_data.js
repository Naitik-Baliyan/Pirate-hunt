import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkParticipants() {
    const { data } = await supabase.from('participants').select('*')
    console.table(data.map(p => ({
        id: p.id,
        name: p.name,
        current_quest: p.current_quest,
        letters: p.letters_collected
    })))
}

checkParticipants()
