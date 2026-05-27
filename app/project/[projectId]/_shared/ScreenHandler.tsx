import { Button } from '@/components/ui/button'
import { ScreenConfig } from '@/type/types'
import { Code2Icon, Copy, GripVertical } from 'lucide-react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { toast } from 'sonner'
import { HtmlWrapper } from '@/data/constant';

type Props = {
  screen: ScreenConfig | undefined,
  theme: any,
}

function ScreenHandler({ screen, theme }: Props) {
  const htmlCode = HtmlWrapper(theme, screen?.code as string);
  return (
    <div className='flex justify-between items-center w-full'>
      <div className='flex items-center gap-2'>
        <GripVertical className='text-gray-500 h-4 w-4 '/>
        <h2>{screen?.screenName}</h2>
      </div>
      
      <div>
        <Dialog>
          <DialogTrigger>
            <Button variant={'outline'}><Code2Icon /></Button>
          </DialogTrigger>
          <DialogContent className='max-w-5xl w-full h-[70vh] flex flex-col'>
            <DialogHeader>
              <DialogTitle> HTML + Tailwind CSS Code for {screen?.screenName}</DialogTitle>
              <DialogDescription>
                <div className='flex-1 overflow-y-auto rounded-md border bg-muted p-4'>
                  <SyntaxHighlighter
                  language="html" 
                  style={docco}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowX: 'hidden',
                    height: '50vh'
                  }}
                  codeTagProps={{
                    style: {
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowX: 'hidden',
                      wordWrap: 'break-word',
                      textAlign: 'left',
                      textOverflow: 'ellipsis',
                    }
                  }}
                  >
                    {htmlCode ?? 'No code available'}
                  </SyntaxHighlighter>
                </div>
                  <Button className='mt-5 cursor-pointer' onClick={() => {navigator.clipboard.writeText(htmlCode ?? '' as string)
                    toast.success('Code copied!')
                  }}><Copy/>Copy</Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ScreenHandler