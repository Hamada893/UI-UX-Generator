import React from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectCanvasPage({ params }: Props) {
  const { projectId } = await params;
  return (
    <div>
      <ProjectHeader />

      <div>
        <SettingsSection />
        {/* {Canvas} */}
      </div>
    </div>
  );
}
