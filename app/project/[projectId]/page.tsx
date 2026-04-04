'use client'

import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectDetail } from "@/type/types";
import { Loader2Icon } from "lucide-react";

export default function ProjectCanvasPage() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading');

  const getProjectDetail = async () => {
    setIsLoading(true);
    setLoadingMsg('Loading...');
    const result = await axios.get(`/api/project?projectId=${projectId}`);
    console.log(result.data);
    setProjectDetail(result.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getProjectDetail();
  }, [projectId]);

  return (
    <div>
      <ProjectHeader />

      <div>
        {isLoading && <div className="absolute p-3 bg-blue-300/20 border-blue-400 border rounded-xl left-1/2 top-20">
          <h2 className="flex items-center gap-2"><Loader2Icon className="animate-spin" /> {loadingMsg}...</h2>
        </div>}
        
        <SettingsSection />

        {/* {Canvas} */}
      </div>
    </div>
  );
}
