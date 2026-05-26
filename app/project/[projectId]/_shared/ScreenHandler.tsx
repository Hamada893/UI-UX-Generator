import { ScreenConfig } from '@/type/types'
import { GripVertical } from 'lucide-react'
import React from 'react'

type Props = {
  screen: ScreenConfig | undefined,
}

function ScreenHandler({ screen }: Props) {
  return (
    <div className='flex'>
      <div className='flex items-center gap-2'>
        <GripVertical className='text-gray-500 h-4 w-4 '/>
        <h2>{screen?.screenName}</h2>
      </div>
    </div>
  )
}

export default ScreenHandler