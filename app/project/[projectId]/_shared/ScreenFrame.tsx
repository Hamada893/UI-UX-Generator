import { GripVertical } from 'lucide-react';
import React from 'react'
import { Rnd } from 'react-rnd';

type Props = {
  x: number,
  y: number
  setPanningEnabled: (enabled: boolean) => void
}
function ScreenFrame({ x, y, setPanningEnabled }: Props) {
  return (
    <Rnd
      default={{
        x: x,
        y: y,
        width: 320,
        height: 200,

      }}
      dragHandleClassName='drag-handle'
      enableResizing={{
        bottom: true,
        bottomLeft: true,
      }}
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResize={() => setPanningEnabled(false)}
      onResizeStop={() => setPanningEnabled(true)}
    >
      <div className='drag-handle cursor-move bg-gray-100 p-2 flex gap-2 items-center ring-1 ring-gray-100 rounded-md rounded-b-none'>
        <GripVertical className='text-gray-500 h-6 w-6 '/> Drag here
      </div>
      <div className='w-full h-full bg-white rounded-lg rounded-t-none shadow-xl p-5'>
        <h2>Example</h2>
      </div>
    </Rnd>
  )
}

export default ScreenFrame
