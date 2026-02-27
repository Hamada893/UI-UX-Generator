import React from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { cn } from '@/lib/utils'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { ChevronRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Send } from 'lucide-react'

function Hero() {
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
        />
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-sm font-medium">
          Generate UI/UX Designs
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>
    </div>
      <h2
        className='text-5xl font-bold text-center'
      >Design High quality <span className='text-primary'>Websites</span> and <span className='text-primary'>Mobile</span> App Designs</h2>
      <p className='text-center text-gray-600 mt-3 text-lg'>Imagine your idea and turn it into reality.</p>
      
      
      <div className="flex w-full gap-6 items-center justify-center mt-10">
      <InputGroup className='w-full max-w-xl bg-white z-10'>
        <InputGroupTextarea
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-24 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Describe your design"
        />
        <InputGroupAddon align="block-end">

        <Select defaultValue="website">
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

          <InputGroupButton className="ml-auto cursor-pointer" size="sm" variant="default">
            < Send />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
    </div>
  )
}

export default Hero
