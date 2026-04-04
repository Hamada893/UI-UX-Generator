'use client'

import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectDetail, ScreenConfig } from "@/type/types";
import { Loader2Icon } from "lucide-react";

export default function ProjectCanvasPage() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading');

  useEffect(() => {
    getProjectDetail();
  }, [projectId]);

  const getProjectDetail = async () => {
    setIsLoading(true);
    setLoadingMsg('Loading...');
    const result = await axios.get(`/api/project?projectId=${projectId}`);
    console.log(result.data);
    setProjectDetail(result?.data?.projectDetail);
    setScreenConfig(result?.data?.screenConfig);
    // if (result.data?.screenConfig.length === 0) {
    //   generateScreenConfig();
    // }
    setIsLoading(false);
  }

  useEffect(() => {
    if (projectDetail && screenConfig && screenConfig.length === 0) {
      generateScreenConfig();
    }
  },[projectDetail && screenConfig])

  const generateScreenConfig = async () => {
    setIsLoading(true);
    setLoadingMsg('Generating screen config...');
    const result = await axios.post('/api/generate-config', {
      projectId: projectId,
      deviceType: projectDetail?.deviceType,
      userInput: projectDetail?.userInput,
    })
    console.log(result.data);
    getProjectDetail();
    setIsLoading(false)
  }

  return (
    <div>
      <ProjectHeader />

      <div>
        {isLoading && <div className="absolute p-3 bg-blue-300/20 border-blue-400 border rounded-xl left-1/2 top-20">
          <h2 className="flex items-center gap-2"><Loader2Icon className="animate-spin" /> {loadingMsg}...</h2>
        </div>}
        
        <SettingsSection projectDetail={projectDetail as ProjectDetail} />

        {/* {Canvas} */}
      </div>
    </div>
  );
}
