import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function investigate() {
    const testInsert = async (payload) => {
        const { error } = await supabase.from('clues').insert(payload)
        return error ? error.message : "Success"
    }

    console.log("Check 1: phase, quest_number")
    console.log(await testInsert({ phase: 1, quest_number: 1 }))

    console.log("Check 2: phase, quest_number, location")
    console.log(await testInsert({ phase: 1, quest_number: 2, location: 'test' }))

    console.log("Check 3: phase, quest_number, clue")
    console.log(await testInsert({ phase: 1, quest_number: 3, clue: 'test' }))

    console.log("Check 4: phase, quest_number, clue_text")
    console.log(await testInsert({ phase: 1, quest_number: 4, clue_text: 'test' }))

    console.log("Check 5: phase, quest_number, answer")
    console.log(await testInsert({ phase: 1, quest_number: 5, answer: 'test' }))

    // Cleanup
    console.log("\nCleanup...")
    const { error: delError } = await supabase.from('clues').delete().in('quest_number', [1, 2, 3, 4, 5])
    console.log(delError ? delError.message : "Deleted test rows.")

    // Final check - actually read the data we just inserted (to see what keys are returned)
    const { data: testData } = await supabase.from('clues').select('*').limit(5)
    if (testData && testData.length > 0) {
        console.log("\nActual columns returned from DB:", Object.keys(testData[0]))
    }
}

investigate()
