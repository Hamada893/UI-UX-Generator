import React, { useState } from 'react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Rnd } from 'react-rnd';
import { GripVertical } from 'lucide-react';
import DotGrid from '@/components/DotGrid';
import ScreenFrame from './ScreenFrame';
import { ProjectDetail, ScreenConfig } from '@/type/types';
import { Skeleton } from '@/components/ui/skeleton';

const rndResizeHandles = {
  bottom: true,
  bottomLeft: true,
  top: true,
  topLeft: true,
  topRight: true,
  left: true,
  right: true,
  bottomRight: true,
} as const

type Props = {
  projectDetail: ProjectDetail,
  screenConfig: ScreenConfig[],
  loading?: boolean,
}

function Canvas({ projectDetail, screenConfig, loading }: Props) {
  const [panningEnabled, setPanningEnabled] = useState(true)
  const isMobile = projectDetail?.deviceType === 'mobile'
  const SCREEN_WIDTH = isMobile ? 500 : 1200
  const SCREEN_HEIGHT = isMobile ? 1000 : 1000
  const GAP = isMobile ? 10 : 70
  const innerSkeletonCount = Math.min(Math.max(screenConfig?.length ?? 1, 1), 12)

  return (
    <div 
      className='w-full h-screen bg-gray-100 relative z-0'
      
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
        initialScale={0.7}
        minScale={0.7}
        maxScale={3}
        initialPositionX={50}
        initialPositionY={50}
        limitToBounds={false}
        wheel={{ step: 0.8 }}
        doubleClick={{disabled: false}}
        panning={{disabled: !panningEnabled}}
      >
        <TransformComponent 
          wrapperStyle={{ width: '100%', height: '100%' }}
        >
          {screenConfig?.map((screen, index) => (
            screen?.code ? <ScreenFrame 
            key={screen.screenId ?? index} 
            x={index * (SCREEN_WIDTH + GAP)} 
            y={0} 
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            setPanningEnabled={setPanningEnabled}
            htmlCode={screen?.code ?? ''}
            projectDetail={projectDetail}
          /> : <Rnd
            key={screen.screenId ?? `sk-${index}`}
            default={{
              x: index * (SCREEN_WIDTH + GAP),
              y: 0,
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
            }}
            enableResizing={rndResizeHandles}
            dragHandleClassName="drag-handle"
            onDragStart={() => setPanningEnabled(false)}
            onDragStop={() => setPanningEnabled(true)}
            onResize={() => setPanningEnabled(false)}
            onResizeStop={() => setPanningEnabled(true)}
          >
            <div className="drag-handle cursor-move bg-white rounded-lg p-4 flex gap-2 items-center">
              <GripVertical className="text-gray-500 h-4 w-4" />
              Generating screen…
            </div>
            <div className="w-full h-[calc(100%-40px)] bg-white rounded-2xl mt-3 p-5 flex flex-row flex-wrap gap-4 content-start items-start">
              {Array.from({ length: innerSkeletonCount }).map((_, si) => (
                <Skeleton
                  key={si}
                  className="h-24 min-w-[72px] flex-1 rounded-lg bg-gray-200"
                  style={{ flexBasis: `${100 / Math.min(innerSkeletonCount, 4)}%` }}
                />
              ))}
            </div>
          </Rnd>
          ))}
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default Canvas
