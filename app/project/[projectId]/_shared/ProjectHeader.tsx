'use client'

import React, { useContext, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Save } from 'lucide-react'
import { SettingsContext } from '@/context/SettingsContext'
import axios from 'axios'
import { toast } from 'sonner'

function ProjectHeader() {
  const { settingsDetails, setSettingsDetails } = useContext(SettingsContext)
  const [loading, setLoading] = useState(false)

  const onSave = async () => {
    const payload = {
      theme: settingsDetails?.theme,
      projectId: settingsDetails?.projectId,
      projectName: settingsDetails?.projectName,
    }
    // #region agent log
    fetch('http://127.0.0.1:7629/ingest/ef469cf5-8a62-4f7c-b9b9-2f1e881ef921',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'971e07'},body:JSON.stringify({sessionId:'971e07',location:'ProjectHeader.tsx:onSave:entry',message:'save clicked',data:{payload,settingsDetails},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    try {
      setLoading(true)
      const result = await axios.put('/api/project', payload)
      // #region agent log
      fetch('http://127.0.0.1:7629/ingest/ef469cf5-8a62-4f7c-b9b9-2f1e881ef921',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'971e07'},body:JSON.stringify({sessionId:'971e07',location:'ProjectHeader.tsx:onSave:success',message:'put succeeded',data:{status:result.status,data:result.data},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      setLoading(false)
      toast.success('Project saved successfully!')
    } catch (error) {
      const err = error as { response?: { status?: number; data?: unknown }; message?: string }
      // #region agent log
      fetch('http://127.0.0.1:7629/ingest/ef469cf5-8a62-4f7c-b9b9-2f1e881ef921',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'971e07'},body:JSON.stringify({sessionId:'971e07',location:'ProjectHeader.tsx:onSave:error',message:'put failed',data:{status:err.response?.status,responseData:err.response?.data,message:err.message},timestamp:Date.now(),hypothesisId:'B,E'})}).catch(()=>{});
      // #endregion
      toast.error('Failed to save project')
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
