import React, { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Rnd } from 'react-rnd';
import { GripVertical, ZoomInIcon, ZoomOutIcon, Maximize } from 'lucide-react';
import DotGrid from '@/components/DotGrid';
import ScreenFrame from './ScreenFrame';
import { ProjectDetail, ScreenConfig } from '@/type/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import axios from 'axios';

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

const waitForIframeDocument = async (
  iframe: HTMLIFrameElement,
  timeoutMs = 15000
): Promise<Document> => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const doc = iframe.contentDocument;
    if (
      iframe.isConnected &&
      doc?.defaultView &&
      doc.body &&
      doc.readyState === "complete"
    ) {
      return doc;
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  throw new Error("iframe document not ready");
};

type Props = {
  projectDetail: ProjectDetail,
  screenConfig: ScreenConfig[],
  loading?: boolean,
  takeScreenshot: any,
}

function Canvas({ projectDetail, screenConfig, loading, takeScreenshot }: Props) {
  const [panningEnabled, setPanningEnabled] = useState(true)
  const isMobile = projectDetail?.deviceType === 'mobile'
  const SCREEN_WIDTH = isMobile ? 500 : 1200
  const SCREEN_HEIGHT = isMobile ? 1000 : 1000
  const GAP = isMobile ? 10 : 70
  const innerSkeletonCount = Math.min(Math.max(screenConfig?.length ?? 1, 1), 12)
  const iframeRefs = useRef<(HTMLIFrameElement)[]>([]);

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
  
    return (
      <div className="tools fixed p-3 px-5 bg-white shadow flex gap-3 rounded-4xl bottom-5 left-1/2 -translate-x-1/2 z-30
      text-gray-500">
        <Button className='cursor-pointer' onClick={() => zoomIn()}><ZoomInIcon /></Button>
        <Button className='cursor-pointer' onClick={() => zoomOut()}><ZoomOutIcon /></Button>
        <Button className='cursor-pointer' onClick={() => resetTransform()}><Maximize/></Button>
      </div>
    );
  };

  useEffect(() => {
    if (!takeScreenshot) return
    onTakeScreenshot(takeScreenshot.saveOnly === true)
  }, [takeScreenshot])
  
const captureOneIframe = async (iframe: HTMLIFrameElement) => {
    let doc = await waitForIframeDocument(iframe);

    // wait fonts if possible
    // @ts-ignore
    if (doc.fonts?.ready) await doc.fonts.ready;

    // let iconify/tailwind apply
    await new Promise((r) => setTimeout(r, 250));

    doc = await waitForIframeDocument(iframe);

    await Promise.all(
      (Array.from(doc.querySelectorAll("img")) as HTMLImageElement[]).map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
      )
    );

    doc = await waitForIframeDocument(iframe);
    const target = doc.body;
    const w = doc.documentElement.scrollWidth;
    const h = doc.documentElement.scrollHeight;

    const canvas = await html2canvas(target, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        width: w,
        height: h,
        windowWidth: w,
        windowHeight: h,
        scale: window.devicePixelRatio || 1,
    });

    return canvas;
};

const onTakeScreenshot = async (saveOnly = false) => {
    try {
        const iframes = iframeRefs.current.filter(Boolean) as HTMLIFrameElement[];
        if (!iframes.length) {
            toast.error("No iframes found to capture");
            return;
        }

        // 1) capture each iframe to its own canvas
        const shotCanvases: HTMLCanvasElement[] = [];
        for (let i = 0; i < iframes.length; i++) {
            const c = await captureOneIframe(iframes[i]);
            shotCanvases.push(c);
        }

        // 2) stitch into one final canvas (side-by-side)
        const scale = window.devicePixelRatio || 1;
        const headerH = 40; // same as your header
        const outW =
            Math.max(iframes.length * (SCREEN_WIDTH + GAP), SCREEN_WIDTH) * scale;
        const outH = SCREEN_HEIGHT * scale;

        const out = document.createElement("canvas");
        out.width = outW;
        out.height = outH;

        const ctx = out.getContext("2d");
        if (!ctx) throw new Error("No 2D context");

        // optional transparent background
        ctx.clearRect(0, 0, outW, outH);

        // draw each screen capture
        for (let i = 0; i < shotCanvases.length; i++) {
            const x = i * (SCREEN_WIDTH + GAP) * scale;
            const y = headerH * scale; // because iframe capture is body only
            ctx.drawImage(shotCanvases[i], x, y);
        }

        // 3) download
        const url = out.toDataURL("image/png");
        await updateProjectWithScreenshot(url);
        if (!saveOnly) {
          const a = document.createElement("a");
          a.href = url;
          a.download = "canvas.png";
          a.click();
        }
    } catch (e) {
        console.error(e);
        toast.error("Capture failed (iframe)");
    }
};

  const updateProjectWithScreenshot = async (base64Url: string) => {
    try {
      await axios.put('/api/project', {
        screenshot: base64Url,
        projectId: projectDetail.projectId,
        theme: projectDetail.theme,
        projectName: projectDetail.projectName,
      })
      toast.success("Screenshot saved successfully!");
    } catch (e) {
      toast.error("Failed to update project with screenshot: " + (e as Error)?.message);
    }
  }

  return (
    <div 
      className='w-full h-screen bg-gray-100 relative z-0 '
      
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
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
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
            screen={screen}
            iframeRef={(iframe:any) => {iframeRefs.current[index] = iframe}}
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
            <div className="drag-handle shadow-md cursor-move bg-white rounded-lg p-4 flex gap-2 items-center">
              <GripVertical className="text-gray-500 h-4 w-4" />
              Generating screen…
            </div>
            <div className="w-full h-[calc(100%-40px)] bg-white rounded-2xl mt-3 p-5 border border-gray-200  flex flex-row flex-wrap gap-4 content-start items-start">
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
        </>)}
      </TransformWrapper>
    </div>
  )
}

export default Canvas
