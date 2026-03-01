'use client'

import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { cn } from '@/lib/utils'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { ChevronRight, Loader } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Send } from 'lucide-react'
import { suggestions } from '@/data/constant'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import crypto from 'crypto'
import  Typewriter  from '@/components/fancy/text/typewriter'

function Hero() {

  const [selectedSuggestion, setSelectedSuggestion] = useState<string>()
  const [deviceType, setDeviceType] = useState<string>('website')
  const {user} = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onCreateProject = async () => {
    if (!user) {
      router.push('/sign-in')
      return
    }
    
    if (!selectedSuggestion) {
      return
    }
    setLoading(true)

    try {
      const result = await axios.post('/api/project', {
        userInput: selectedSuggestion,
        deviceType: deviceType,
        projectId: crypto.randomBytes(16).toString('hex'),
      })
      setLoading(false)
      // Navigate to the project page
      
    } catch (error) {
      console.error('Error creating project', error)
    } finally {
      setLoading(false)
    }  
}

  return (
    <div className='p-10 md:px-24 lg:px-48 xl:px-60 mt-20'>
      <div className='flex items-center justify-center w-full mb-5'>
        <div className="group relative max-w-sm mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
        <span
          className={cn(
            "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
          )}
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
          suppressHydrationWarning
        />
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-sm font-medium">
          Generate UI/UX Designs
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>
    </div>
      <h2 className='text-5xl font-bold text-center'>
          Create <Typewriter
                  text={[
                    "High Quality",
                    "Beautiful",
                    "Responsive",
                    "Fast",
                    "Stunning",
                    "Polished",
                  ]}
                  speed={70}
                  waitTime={1500}
                  deleteSpeed={40}
                  cursorChar={"_"}
                />
        <span className='text-primary'>Websites</span> and <span className='text-primary'>Mobile</span> App Designs</h2>
      <p className='text-center text-gray-600 mt-3 text-lg'>Imagine your idea and turn it into reality.</p>
      
      
      <div className="flex w-full gap-6 items-center justify-center mt-10">
        <InputGroup className='w-full max-w-xl bg-white z-10'>
          <InputGroupTextarea
            data-slot="input-group-control"
            className="flex field-sizing-content min-h-24 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
            placeholder="Describe your design"
            value={selectedSuggestion}
            onChange={(e) => setSelectedSuggestion(e.target?.value || '')}
          />
          <InputGroupAddon align="block-end">

          <div suppressHydrationWarning>
            <Select defaultValue="website" onValueChange={(value) => setDeviceType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

            <InputGroupButton 
              className="ml-auto cursor-pointer" 
              size="sm" 
              variant="default"
              disabled={loading || !selectedSuggestion?.trim()}
              onClick={() => onCreateProject()}
            >
              {loading ? <Loader className='animate-spin' /> : <Send />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className='flex gap-5 mt-8 justify-center'>
        {suggestions.map((suggestion, index) => {
          return (
            <div 
              key={index} 
              role="button"
              tabIndex={0}
              className='p-3 border rounded-2xl flex flex-col items-center bg-white z-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary'
              onClick={() => setSelectedSuggestion(suggestion?.description)}
              onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedSuggestion(suggestion.description)
              }
            }}
           >
              <h2 className='text-lg'>{suggestion?.icon}</h2>
              <h2 className='text-center line-clamp-2 text-sm'>{suggestion?.name}</h2>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Hero
