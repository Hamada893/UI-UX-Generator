import { GripVertical } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Rnd } from 'react-rnd';
import { ThemeKey, resolveTheme, themeToCssVars } from '@/data/themes';
import { ProjectDetail } from '@/type/types';
import { SettingsContext } from '@/context/SettingsContext';

type Props = {
  x: number,
  y: number
  setPanningEnabled: (enabled: boolean) => void
  width: number,
  height: number,
  htmlCode: string | undefined,
  projectDetail: ProjectDetail | undefined,
}
function ScreenFrame({ x, y, setPanningEnabled, width, height, htmlCode, projectDetail }: Props) {
  const { settingsDetails } = useContext(SettingsContext)
  const themeKey = (settingsDetails?.theme ?? projectDetail?.theme) as ThemeKey | undefined
  const theme = resolveTheme(themeKey)
const iframeRef = useRef<HTMLIFrameElement | null>(null);
const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Google Font -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">


<!-- Tailwind + Iconify -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
  <style>
    ${themeToCssVars(theme)}
    *, *::before, *::after {
      scrollbar-width: none;        /* Firefox */
      -ms-overflow-style: none;     /* IE/Edge */
    }
    *::-webkit-scrollbar {
      display: none;                /* Chrome/Safari */
    }
  </style>
</head>
<body class="bg-[var(--background)] text-[var(--foreground)] w-full overflow-x-hidden">
  ${htmlCode ?? ""}
</body>
</html>
`;
const [iframeSize, setIframeSize] = useState({ width, height });

useEffect(() => {
  setIframeSize({ width, height });
}, [width, height]);
const measureIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        const headerH = 40; // drag bar height
        const htmlEl = doc.documentElement;
        const body = doc.body;

        // ✅ choose the largest plausible height
        const contentH = Math.max(
            htmlEl?.scrollHeight ?? 0,
            body?.scrollHeight ?? 0,
            htmlEl?.offsetHeight ?? 0,
            body?.offsetHeight ?? 0
        );

        // optional min/max clamps
        const next = Math.min(Math.max(contentH + headerH, 160), 2000);

        setIframeSize((s) => (Math.abs(s.height - next) > 2 ? { ...s, height: next } : s));
    } catch {
        // if sandbox/origin blocks access, we can't measure
    }
}, []);

useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
        measureIframeHeight();

        // ✅ observe DOM changes inside iframe
        const doc = iframe.contentDocument;
        if (!doc) return;

        const observer = new MutationObserver(() => measureIframeHeight());
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        });

        // ✅ re-check a few times for fonts/images/tailwind async layout
        const t1 = window.setTimeout(measureIframeHeight, 50);
        const t2 = window.setTimeout(measureIframeHeight, 200);
        const t3 = window.setTimeout(measureIframeHeight, 600);

        return () => {
            observer.disconnect();
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.clearTimeout(t3);
        };
    };

    iframe.addEventListener("load", onLoad);
    window.addEventListener("resize", measureIframeHeight);

    return () => {
        iframe.removeEventListener("load", onLoad);
        window.removeEventListener("resize", measureIframeHeight);
    };
}, [measureIframeHeight, htmlCode]);


  
  return (
    <Rnd
      default={{
        x: x,
        y: y,
        width: width,
        height: height,
      }}
      size={iframeSize}
      dragHandleClassName='drag-handle'
      enableResizing={{
        bottom: true,
        bottomLeft: true,
        top: true,
        topLeft: true,
        topRight: true,
        left: true,
        right: true, 
        bottomRight: true,
      }}
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResize={() => setPanningEnabled(false)}
      onResizeStop={(_,__,ref,___,position) => {setPanningEnabled(true);
        setIframeSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      }}
    >
      <div className='drag-handle cursor-move bg-gray-100 p-2 flex gap-2 items-center cursor-move bg-white rounded-lg p-4'>
        <GripVertical className='text-gray-500 h-4 w-4 '/> Drag here
      </div>
      <iframe 
        ref={iframeRef}
        className='w-full h-[calc(100%-40px)] bg-white rounded-2xl mt-3'
        sandbox='allow-scripts'
        srcDoc={html}
      />
    </Rnd>
  )
}

export default ScreenFrame
