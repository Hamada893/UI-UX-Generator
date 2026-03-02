import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

function ProjectHeader() {
  return (
    <div className="flex items-center justify-between p-3 shadow gap-2">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <h2 className="text-xl font-semibold">
        <span className="text-primary">UI/UX</span> Generator</h2>
      </div>
        <Button className="cursor-pointer"><Save className="w-4 h-4" /> Save</Button>
    </div>
  )
}

export default ProjectHeader
