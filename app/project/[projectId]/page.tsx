import React from "react";

type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectCanvasPage({ params }: Props) {
  const { projectId } = await params;
  return (
    <div className="container mx-auto px-4 py-10">
      <div>Project canvas: {projectId}</div>
    </div>
  );
}
