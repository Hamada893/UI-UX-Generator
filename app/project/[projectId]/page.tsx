'use client'

import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectDetail, ScreenConfig } from "@/type/types";
import { Loader2Icon } from "lucide-react";
import Canvas from "./_shared/Canvas";
import { SettingsContext } from "@/context/SettingsContext";
import { RefreshDataContext } from "@/context/RefreshDataContext";

export default function ProjectCanvasPage() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading');
  const hasRequestedConfigRef = useRef(false)
  const isGeneratingUIRef = useRef(false)
  const { setSettingsDetails } = useContext(SettingsContext)
  const { refreshData } = useContext(RefreshDataContext);

  useEffect(() => {
    const resolvedProjectId = Array.isArray(projectId) ? projectId[0] : projectId
    hasRequestedConfigRef.current = false;
    isGeneratingUIRef.current = false;
    setProjectDetail(undefined);
    setScreenConfig([]);
    if (resolvedProjectId) {
      setSettingsDetails({
        projectId: resolvedProjectId,
        projectName: '',
      });
    }
    getProjectDetail();
  }, [projectId]);

  useEffect(() => {
    if (refreshData?.method === 'screenConfig') {
      void getProjectDetail()
    }
  }, [refreshData])

  const getProjectDetail = async () => {
    try {
        setIsLoading(true);
        setLoadingMsg('Loading...');
        const result = await axios.get(`/api/project?projectId=${projectId}`);
        setProjectDetail(result?.data?.projectDetail);
        const configs = result?.data?.screenConfig ?? [];
        setScreenConfig(configs);
        const detail = result?.data?.projectDetail
        if (detail) {
          setSettingsDetails({
            projectId: detail.projectId,
            projectName: detail.projectName ?? '',
            ...(detail.theme ? { theme: detail.theme } : {}),
          })
        }
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
      return;
    }

    const pendingScreens = screenConfig.filter((s) => !s.code);
    if (pendingScreens.length === 0 || isGeneratingUIRef.current) return;

    isGeneratingUIRef.current = true;
    void generateScreenUI().finally(() => {
      isGeneratingUIRef.current = false;
    });
  }, [projectDetail, screenConfig])

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
    const pendingScreens = screenConfig.filter((s) => !s.code);
    if (pendingScreens.length === 0) return;

    try {
      setIsLoading(true)

      for (const screen of pendingScreens) {
        setLoadingMsg(`Generating UI for ${screen.screenName ?? screen.screenId ?? 'new screen'}`);
        const result = await axios.post('/api/generate-screen-ui', {
          projectId,
          screenId: screen?.screenId,
          screenName: screen?.screenName,
          purpose: screen?.purpose,
          screenDescription: screen.screenDescription,
          projectVisualDescription: projectDetail?.projectVisualDescription,
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
      <div className="sticky top-0 z-50 bg-white">
      <ProjectHeader />
      </div>
      <div className="relative flex gap-5">
        {isLoading && <div className="pointer-events-none absolute z-50 left-1/2 top-20 -translate-x-1/2 p-3 bg-blue-300/20 border-blue-400 border rounded-xl shadow-lg">
          <h2 className="flex items-center gap-2"><Loader2Icon className="animate-spin" /> {loadingMsg}</h2>
        </div>}
        
        <SettingsSection
          projectDetail={projectDetail as ProjectDetail}
          screenConfig={screenConfig}
        />

        <div className="min-w-0 flex-1">
          <Canvas
            projectDetail={projectDetail as ProjectDetail}
            screenConfig={screenConfig as ScreenConfig[]}
          />
        </div>
      </div>
    </div>
  );
}
