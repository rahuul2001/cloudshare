import { AlertCircle } from 'lucide-react'
import React from 'react'

function AlertMessage({msg}) {
  return (
    <div className='p-4 bg-red-700 mt-5 text-white rounded-md flex gap-5 items-center'>
        <AlertCircle size={24} /> {msg}
    </div>
  )
}

export default AlertMessage