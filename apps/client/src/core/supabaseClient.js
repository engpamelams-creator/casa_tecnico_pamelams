import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uqzkxtemxnwcoxswptaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxemt4dGVteG53Y294c3dwdGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDg3MzcsImV4cCI6MjA4MzM4NDczN30.0fErdKTQu2kvuQEBZw4UsAQpB2j0pSe58HppVw95oLw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
