'use client'

import { useContext, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Camera, Share, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { THEME_NAME_LIST, ThemeKey, THEMES, normalizeThemeKey } from '@/data/themes'
import { ProjectDetail, ScreenConfig } from '@/type/types'
import { useEffect } from 'react'
import { SettingsContext } from '@/context/SettingsContext'
import axios from 'axios'
import { toast } from 'sonner'
import { RefreshDataContext } from '@/context/RefreshDataContext'
import { Loader2Icon } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'

type Props = {
  projectDetail: ProjectDetail | undefined,
  screenConfig?: ScreenConfig[],
  takeScreenshot: any,
}

function SettingsSection({ projectDetail, screenConfig, takeScreenshot }: Props) {

  const { settingsDetails, setSettingsDetails } = useContext(SettingsContext)
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(THEME_NAME_LIST[0])
  const [projectName, setProjectName] = useState<string>(projectDetail?.projectName || '')
  const [userPrompt, setUserPrompt] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);
  const {has} = useAuth()
  const hasPremiumAccess = has?.({ plan: 'unlimited' })

  useEffect(() => {
    if (!projectDetail?.projectId) {
      setProjectName('')
      return
    }
    setProjectName(projectDetail.projectName ?? '')
    const themeKey = normalizeThemeKey(projectDetail.theme)
    setSelectedTheme(themeKey)
    setSettingsDetails({
      theme: themeKey,
      projectId: projectDetail.projectId,
      projectName: projectDetail.projectName ?? '',
    })
  }, [projectDetail?.projectId, projectDetail?.projectName, projectDetail?.theme, setSettingsDetails])

  const onThemeSelect = (theme: ThemeKey) => {
    setSelectedTheme(theme)
    setSettingsDetails((prev:any) => ({
      ...prev,
      theme: theme
    }))
  }

  const generateNewScreen = async () => {
    if(!hasPremiumAccess) {
      toast.error('Limited feature to paid user only.')
      return
    }
    const userInput = userPrompt.trim()
    if (!userInput) {
      toast.error('Enter a prompt to generate a new screen')
      return
    }
    if (!projectDetail?.projectId || !projectDetail?.deviceType) {
      toast.error('Project details are still loading. Try again in a moment.')
      return
    }

    setLoading(true)
    toast.info('Generating new screen...')
    setUserPrompt('')
    const existingScreens = (screenConfig ?? []).map((screen) => ({
      id: screen.screenId,
      name: screen.screenName,
      purpose: screen.purpose,
      layoutDescription: screen.screenDescription,
    }))
    const payload = {
      projectId: projectDetail.projectId,
      projectName: projectDetail.projectName,
      deviceType: projectDetail.deviceType,
      theme: projectDetail.theme,
      projectVisualDescription: projectDetail.projectVisualDescription,
      userInput,
      oldScreenDescription: screenConfig?.[0]?.screenDescription ?? null,
      existingScreens,
    }
    try {
      const result = await axios.post('/api/generate-config', payload)
      setRefreshData({ method: 'screenConfig', date: Date.now() });
      toast.success('New screen generation started!')
      console.log(result?.data);
    } catch (error) {
      console.error('Failed to generate new screen', error)
      toast.error('Failed to generate new screen');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-[300px] h-[90vh] p-5 border-r'>
      <h2 className='font-medium text-lg'>
        Settings
      </h2>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Project Name</h2>
          <Input placeholder='Project Name' 
          value={projectName}
          onChange={(e) => {
            const name = e.target?.value || ''
            setProjectName(name)
            setSettingsDetails((prev: Record<string, unknown> | null) => ({
              ...prev,
              projectName: name,
            }))
          }}
        />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Generate New Screen</h2>
        <Textarea
          placeholder='Enter prompt to generate using AI'
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target?.value || '')}
          
        />
        <Button 
          size={'sm'} 
          className='cursor-pointer mt-3 w-full' 
          disabled={loading}
          onClick={generateNewScreen}
        >{loading ? <Loader2Icon className='animate-spin' /> : <Sparkles/>} Generate With AI</Button>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Themes</h2>
        <div className='h-[200px] overflow-y-auto'>
          {THEME_NAME_LIST.map((theme) => (
            <button 
              key={theme}
              type='button'
              className={`w-full p-3 border rounded-xl mb-2 cursor-pointer
                ${selectedTheme === theme ? 'border-primary bg-primary/10' : ''}
              `} 
              onClick={() => onThemeSelect(theme)}
            >
              <h2>{theme}</h2>
              <div className='flex gap-2 justify-center items-center'>
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
                  ${THEMES[theme]?.accent || '#000000'}
                )` }}> 
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm mb-2'>Extras</h2>
        <div className='flex gap-3'>
          <Button size={'sm'} variant={'outline'} className='mt-2 cursor-pointer' onClick={takeScreenshot}><Camera/>Screenshot</Button>
          <Button size={'sm'} variant={'outline'} className='mt-2 cursor-pointer'><Share/>Share</Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsSection
