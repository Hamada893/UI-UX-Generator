'use client'

import React, { useContext, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Save } from 'lucide-react'
import { SettingsContext } from '@/context/SettingsContext'
import axios from 'axios'
import { toast } from 'sonner'

function ProjectHeader() {
  const { projectId: urlProjectId } = useParams()
  const { settingsDetails } = useContext(SettingsContext)
  const [loading, setLoading] = useState(false)

  const onSave = async () => {
    const resolvedProjectId =
      settingsDetails?.projectId ??
      (Array.isArray(urlProjectId) ? urlProjectId[0] : urlProjectId)
    try {
      setLoading(true)
      await axios.put('/api/project', {
        theme: settingsDetails?.theme,
        projectId: resolvedProjectId,
        projectName: settingsDetails?.projectName,
      })
      toast.success('Project saved successfully!')
    } catch {
      toast.error('Failed to save project')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex items-center justify-between p-3 shadow gap-2">
      <div className="flex items-center gap-2">
        <Link href="/"><Image src="/logo.png" alt="logo" width={40} height={40} /></Link>
        <h2 className="text-xl font-semibold">
        <span className="text-primary">UI/UX</span> Generator</h2>
      </div>
        <Button onClick={onSave} disabled={loading} className="cursor-pointer">{loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</Button>
    </div>
  )
}

export default ProjectHeader
