'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Camera, Share, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { THEME_NAME_LIST, ThemeKey, THEMES } from '@/data/themes'

function SettingsSection() {

  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(THEME_NAME_LIST[0])
  const [projectName, setProjectName] = useState<string>('')
  const [userPrompt, setUserPrompt] = useState<string>('')

  return (
    <div className='w-[300px] h-[90vh] p-5 border-r'>
      <h2 className='font-medium text-lg'>
        Settings
      </h2>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Project Name</h2>
          <Input placeholder='Project Name' 
          onChange={(e) => setProjectName(e.target?.value || '')}
        />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Generate New Screen</h2>
        <Textarea placeholder='Enter prompt to generate using AI' onChange={(e) => setUserPrompt(e.target?.value || '')} />
        <Button size={'sm'} className='cursor-pointer mt-3 w-full'><Sparkles/>Generate With AI</Button>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Themes</h2>
        <div className='h-[200px] overflow-y-auto'>
          {THEME_NAME_LIST.map((theme, index) => (
            <div 
              className={`p-3 border rounded-xl mb-2 cursor-pointer
                ${selectedTheme === theme ? 'border-primary bg-primary/10' : ''}
              `} 
              onClick={() => setSelectedTheme(theme)}
            >
              <h2>{theme}</h2>
              <div className='flex gap-2'>
                <div className={`h-4 w-4 rounded-full`}
                style={{ background: THEMES[theme]?.primary }}> 
                </div>
                <div className={`h-4 w-4 rounded-full`}
                style={{ background: THEMES[theme]?.secondary }}> 
                </div>
                <div className={`h-4 w-4 rounded-full`}
                style={{ background: THEMES[theme]?.accent }}> 
                </div>
                <div className={`h-4 w-4 rounded-full`}
                style={{ background: THEMES[theme]?.background }}> 
                </div>
                <div className={`h-4 w-4 rounded-full`}
                style={{ background: `linear-gradient(
                  135deg,
                  ${THEMES[theme]?.background || '#000000'},
                  ${THEMES[theme]?.primary || '#000000'},
                  ${THEMES[theme]?.secondary || '#000000'},
                  ${THEMES[theme]?.accent},
                )` }}> 
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Extras</h2>
        <div className='flex gap-3'>
          <Button size={'sm'} variant={'outline'} className='mt-2'><Camera/>Screenshot</Button>
          <Button size={'sm'} variant={'outline'} className='mt-2'><Share/>Share</Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsSection
