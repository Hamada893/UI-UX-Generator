'use client'

import { useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import axios from "axios";
import { useParams } from "next/navigation";
import { ProjectDetail, ScreenConfig } from "@/type/types";
import { Loader2Icon } from "lucide-react";

export default function ProjectCanvasPage() {
  const { projectId } = useParams()
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Loading...')
  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([])

useEffect(() => {
    projectId && getProjectDetail()
  }, [projectId])

  const getProjectDetail = async () => {
    setLoading(true)
    setLoadingMessage('Loading...')
    const result = await axios.get(`/api/project?projectId=${projectId}`)
    console.log(result.data)
    setProjectDetail(result?.data?.projectDetail)
    setScreenConfig(result?.data?.screenConfig)
    if (result?.data?.screenConfig?.length === 0) {
      generateScreenConfig()
    }
    setLoading(false)
  }

  const generateScreenConfig = async () => {
    
  }

  return (
    <div>
      <ProjectHeader />

      <div>
        {loading && 
        <div className="p-3 text-sm absolute left-1/2 top-20 text-shadow-sm bg-blue-300/20 border border-blue-400 rounded-xl">
          <h2 className="flex items-center gap-2"><Loader2Icon className="animate-spin" />{loadingMessage}</h2>
        </div>}
        <SettingsSection />
        {/* {Canvas} */}
      </div>
    </div>
  );
}
