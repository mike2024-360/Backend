import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

/*
  IMPORTANT:
  Replace the placeholders below with your project's values.
  You can create a local .env and serve this page locally, OR replace values directly for quick testing.
*/
const SUPABASE_URL = 'https://bjfiowuectwtvnyfrsgz.supabase.co' // e.g. https://abc123.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZmlvd3VlY3R3dHZueWZyc2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjM0MTUsImV4cCI6MjA3NjAzOTQxNX0.7WFutjOPcSlgPAu-LqpJ-s7lWjjL5HtQ0y6zlz-1s3o' // public anon key, not service role

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Elements
const sender = document.getElementById('sender')
const receiver = document.getElementById('receiver')
const origin = document.getElementById('origin')
const destination = document.getElementById('destination')
const amount = document.getElementById('amount')
const createBtn = document.getElementById('createBtn')
const createResult = document.getElementById('createResult')
const refreshBtn = document.getElementById('refreshBtn')
const parcelsList = document.getElementById('parcelsList')
const chatMsg = document.getElementById('chatMsg')
const chatBtn = document.getElementById('chatBtn')
const chatResult = document.getElementById('chatResult')

async function loadParcels() {
  parcelsList.innerHTML = 'Loading...'
  const { data, error } = await supabase
    .from('parcels')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    parcelsList.innerText = 'Error: ' + error.message
    console.error(error)
    return
  }
  if (!data || data.length === 0) {
    parcelsList.innerText = 'No parcels yet.'
    return
  }
  parcelsList.innerHTML = ''
  data.forEach(p => {
    const el = document.createElement('div')
    el.innerHTML = `<strong>${p.tracking_code}</strong> — ${p.sender_name} → ${p.receiver_name} | ${p.origin} → ${p.destination} | ₦${p.amount ?? ''} | ${p.status}`
    parcelsList.appendChild(el)
  })
}

refreshBtn.addEventListener('click', loadParcels)

createBtn.addEventListener('click', async () => {
  createResult.innerText = 'Creating...'
  const payload = {
    sender_name: sender.value,
    receiver_name: receiver.value,
    origin: origin.value,
    destination: destination.value,
    amount: amount.value ? parseFloat(amount.value) : null
  }
  const { data, error } = await supabase
    .from('parcels')
    .insert([payload])
    .select()
  if (error) {
    createResult.innerText = 'Error: ' + error.message
    console.error(error)
  } else {
    createResult.innerText = 'Created parcel: ' + JSON.stringify(data[0])
    // clear fields
    sender.value=''; receiver.value=''; origin.value=''; destination.value=''; amount.value=''
    loadParcels()
  }
})

// Chat via Edge Function (optional)
// This expects your Supabase Edge Function name to be 'chat' and accessible at
// `${SUPABASE_URL}/functions/v1/chat`
// The function should accept JSON { "message": "..." } and return JSON { "reply": "..." }
chatBtn.addEventListener('click', async () => {
  chatResult.innerText = 'Sending...'
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ message: chatMsg.value })
    })
    const json = await res.json()
    chatResult.innerText = JSON.stringify(json, null, 2)
  } catch (err) {
    chatResult.innerText = 'Error: ' + err.message
  }
})

// initial load
loadParcels()
