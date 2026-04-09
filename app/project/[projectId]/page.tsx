'use client'

import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectDetail, ScreenConfig } from "@/type/types";
import { Loader2Icon } from "lucide-react";
import Canvas from "./_shared/Canvas";

export default function ProjectCanvasPage() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading');
  const hasRequestedConfigRef = useRef(false)
  const hasRequestedUIRef = useRef(false)

  useEffect(() => {
    hasRequestedConfigRef.current = false;
    hasRequestedUIRef.current = false;
    getProjectDetail();
  }, [projectId]);

  const getProjectDetail = async () => {
    try {
        setIsLoading(true);
        setLoadingMsg('Loading...');
        const result = await axios.get(`/api/project?projectId=${projectId}`);
        setProjectDetail(result?.data?.projectDetail);
        setScreenConfig(result?.data?.screenConfig ?? []);
        console.log(result?.data);
      } catch (error) {
        console.error('Failed to fetch project detail', error);
      } finally {
        setIsLoading(false);
      }
  }

  useEffect(() => {
    if (!projectDetail) return;

    if (screenConfig.length === 0) {
      if (hasRequestedConfigRef.current) return;
      hasRequestedConfigRef.current = true;
      void generateScreenConfig();
    } else if (projectDetail && screenConfig && !hasRequestedUIRef.current) {
      hasRequestedUIRef.current = true;
      void generateScreenUI();
    }
  }, [projectDetail, screenConfig.length])

  const generateScreenConfig = async () => {
    try {
        setIsLoading(true);
        setLoadingMsg('Generating screen config...');
        await axios.post('/api/generate-config', {
          projectId,
          deviceType: projectDetail?.deviceType,
          userInput: projectDetail?.userInput,
        });
        await getProjectDetail();
      } catch (error) {
        console.error('Failed to generate screen config', error);
      } finally {
        setIsLoading(false);
      }
  }

  const generateScreenUI = async () => {
    try {
      setIsLoading(true)

      for (let index = 0; index < screenConfig?.length; index++) {
        const screen = screenConfig[index]
        if (screen.code) {
          continue;
        }

        setLoadingMsg(`Generating UI for screen ${index + 1}`);
        const result = await axios.post('/api/generate-screen-ui', {
          projectId,
          screenId: screen?.screenId,
          screenName: screen?.screenName,
          purpose: screen?.purpose,
          screenDescription: screen.screenDescription,
        })
        console.log(result?.data);
      }
      await getProjectDetail();
    } catch (error) {
      console.error('Failed to generate screen UI', error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <ProjectHeader />
      <div className="relative flex gap-5">
        {isLoading && <div className="pointer-events-none absolute z-50 left-1/2 top-20 -translate-x-1/2 p-3 bg-blue-300/20 border-blue-400 border rounded-xl shadow-lg">
          <h2 className="flex items-center gap-2"><Loader2Icon className="animate-spin" /> {loadingMsg}</h2>
        </div>}
        
        <SettingsSection projectDetail={projectDetail as ProjectDetail} />

        <Canvas 
          projectDetail={projectDetail as ProjectDetail} 
          screenConfig={screenConfig as ScreenConfig[]} 
        />
      </div>
    </div>
  );
}
