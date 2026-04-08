import React from 'react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DotGrid from '@/components/DotGrid';

function Canvas() {
  return (
    <div 
      className='w-full h-screen bg-grey-100 relative z-10'
      
    >
      <DotGrid 
        dotSize={5}
        gap={15}
        baseColor="#ece9f2"
        activeColor="#f2858d"
        proximity={120}
        shockRadius={120}
        shockStrength={5}
        resistance={2000}
        returnDuration={1.5}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
      <TransformWrapper
        initialScale={1}
        initialPositionX={200}
        initialPositionY={100}
        limitToBounds={false}
        wheel={{ step: 0.8 }}
        doubleClick={{disabled: false}}
      >
        <TransformComponent 
          wrapperStyle={{ width: '100%', height: '100%' }}
        >
          <h2>Hello</h2>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default Canvas
