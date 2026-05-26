import { Button } from '@/components/ui/button'
import { ScreenConfig } from '@/type/types'
import { Code2Icon, GripVertical } from 'lucide-react'
import React from 'react'

type Props = {
  screen: ScreenConfig | undefined,
}

function ScreenHandler({ screen }: Props) {
  return (
    <div className='flex justify-between items-center w-full'>
      <div className='flex items-center gap-2'>
        <GripVertical className='text-gray-500 h-4 w-4 '/>
        <h2>{screen?.screenName}</h2>
      </div>
      
      <div>
        <Button variant={'outline'}><Code2Icon /></Button>
      </div>
    </div>
  )
}

export default ScreenHandler