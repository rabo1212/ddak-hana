"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import AchievementNode from "./AchievementNode";
import { skillTreeNodes, skillTreeEdges } from "@/data/skillTreeNodes";
import { useAchievementStore } from "@/stores/useAchievementStore";

const nodeTypes: NodeTypes = {
  achievement: AchievementNode,
};

const defaultEdgeOptions = {
  style: {
    stroke: "#A78BFA",
    strokeWidth: 2,
  },
};

export default function SkillTree() {
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);

  // 해금 상태에 따라 edge 스타일 분기
  const styledEdges = useMemo(
    () =>
      skillTreeEdges.map((edge) => ({
        ...edge,
        style: {
          stroke: unlockedIds.includes(edge.source) ? "#A78BFA" : "#4B5563",
          strokeWidth: 2,
        },
        animated: unlockedIds.includes(edge.source),
      })),
    [unlockedIds]
  );

  const [nodes, , onNodesChange] = useNodesState(skillTreeNodes);
  const [edges, , onEdgesChange] = useEdgesState(styledEdges);

  const onInit = useCallback(() => {
    // 초기화 시 줌아웃해서 전체 보기
  }, []);

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-purple-200/30 bg-[#1a1025]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnPinch
        attributionPosition="bottom-left"
      >
        <Background color="#2d1f3d" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-purple-900/80 !border-purple-700 !rounded-xl [&>button]:!bg-purple-800 [&>button]:!border-purple-600 [&>button]:!text-purple-200 [&>button:hover]:!bg-purple-700"
        />
        <MiniMap
          nodeColor={() => "#A78BFA"}
          maskColor="rgba(26,16,37,0.8)"
          className="!bg-purple-950/80 !border-purple-700 !rounded-xl"
        />
      </ReactFlow>
    </div>
  );
}
