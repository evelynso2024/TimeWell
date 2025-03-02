import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hlrfjbgeezyoixwyosxj.supabase.co'  // Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscmZqYmdlZXp5b2l4d3lvc3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzgwMDgsImV4cCI6MjA1NjUxNDAwOH0.NIrwtDfK1K4-dbdVMl_vJobwsSV532La4zqnM5aw3YY' // Replace with your Supabase anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
