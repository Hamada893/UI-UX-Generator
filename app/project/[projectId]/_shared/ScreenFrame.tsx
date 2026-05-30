import React, { useContext, useEffect, useRef, useState } from 'react'
import { Rnd } from 'react-rnd';
import { ThemeKey, resolveTheme } from '@/data/themes';
import { ProjectDetail, ScreenConfig } from '@/type/types';
import { SettingsContext } from '@/context/SettingsContext';
import ScreenHandler from './ScreenHandler';
import { HtmlWrapper } from '@/data/constant';

type Props = {
  x: number,
  y: number
  setPanningEnabled: (enabled: boolean) => void
  width: number,
  height: number,
  htmlCode: string | undefined,
  projectDetail: ProjectDetail | undefined,
  screen: ScreenConfig,
  iframeRef: any,
}
function ScreenFrame({ x, y, setPanningEnabled, width, height, htmlCode, projectDetail, screen, iframeRef }: Props) {
  const { settingsDetails } = useContext(SettingsContext)
  const themeKey = (settingsDetails?.theme ?? projectDetail?.theme) as ThemeKey | undefined
  const theme = resolveTheme(themeKey)
  const frameIdRef = useRef(`frame-${Math.random().toString(36).slice(2, 10)}`);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const html = HtmlWrapper(theme, htmlCode as string);
  //const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeSize, setIframeSize] = useState({ width, height });
  const instrumentedHtml = `
  ${html.replace(
    /<\/body>(?![\s\S]*<\/body>)/,
      `<script>
        (() => {
          const frameId = ${JSON.stringify(frameIdRef.current)};
          const sendHeight = () => {
            const htmlEl = document.documentElement;
            const body = document.body;
            if (!htmlEl || !body) return;
            htmlEl.style.overflowY = 'hidden';
            body.style.overflowY = 'hidden';
            const contentHeight = Math.max(
              htmlEl.scrollHeight || 0,
              body.scrollHeight || 0,
              htmlEl.offsetHeight || 0,
              body.offsetHeight || 0
            );
            parent.postMessage({
              source: 'uiux-frame-height',
              frameId,
              height: contentHeight
            }, '*');
          };
          window.addEventListener('load', sendHeight);
          window.addEventListener('resize', sendHeight);
          new MutationObserver(sendHeight).observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
          if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(sendHeight).catch(() => {});
          }
          sendHeight();
        })();
      <\/script></body>`
    )}
  `;

useEffect(() => {
  setIframeSize({ width, height });
}, [width, height]);
useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const payload = event.data as {
        source?: string
        frameId?: string
        height?: number
      } | null;
      if (!payload || payload.source !== 'uiux-frame-height' || payload.frameId !== frameIdRef.current) return;
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const next = Math.min(Math.max((payload.height ?? 0) + headerHeight + 12, 160), 4000);
      setIframeSize((s) => (Math.abs(s.height - next) > 2 ? { ...s, height: next } : s));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
}, []);


  
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
      onResizeStop={(_,__,ref) => {setPanningEnabled(true);
        setIframeSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      }}
    >
      <div className='h-full flex flex-col'>
        <div ref={headerRef} className='drag-handle cursor-move bg-gray-100 p-2 flex gap-2 items-center cursor-move bg-white rounded-lg p-4'>
          <ScreenHandler screen={screen} theme={theme} iframeRef={iframeRef} projectId={projectDetail?.projectId}/>
        </div>
        <iframe 
          ref={iframeRef}
          className='w-full flex-1 min-h-0 bg-white rounded-2xl mt-3'
          sandbox='allow-scripts allow-same-origin'
          srcDoc={instrumentedHtml}
        />
      </div>
    </Rnd>
  )
}

export default ScreenFrame
