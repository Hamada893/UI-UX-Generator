import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sparkle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function SettingsSection() {
  return (
    <div className='w-[300px] h-[90vh] p-5 border-r'>
      <h2 className='font-medium text-lg'>
        Settings
      </h2>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Project Name</h2>
        <Input placeholder='Project Name' />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Generate New Screen</h2>
        <Textarea placeholder='Enter prompt to generate using AI' />
        <Button size={'sm'} className='cursor-pointer mt-3 w-full'><Sparkle/>Generate With AI</Button>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Themes</h2>
      </div>
    </div>
  )
}

export default SettingsSection
