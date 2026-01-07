"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Play,
  Square,
  GitBranch,
  Database,
  Mail,
  FileText,
  Webhook,
  Clock,
  Users,
  CheckCircle2,
  X,
  GripVertical,
} from "lucide-react"

interface Node {
  id: string
  type: string
  label: string
  x: number
  y: number
}

interface WorkflowNodeProps {
  node: Node
  isSelected: boolean
  isConnecting?: boolean
  isConnectingFrom?: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onClick?: () => void
  onDelete: () => void
}

const nodeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  trigger: { icon: Play, color: "text-green-400", bgColor: "bg-green-500/20" },
  action: { icon: Square, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  condition: { icon: GitBranch, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  database: { icon: Database, color: "text-purple-400", bgColor: "bg-purple-500/20" },
  email: { icon: Mail, color: "text-pink-400", bgColor: "bg-pink-500/20" },
  document: { icon: FileText, color: "text-orange-400", bgColor: "bg-orange-500/20" },
  webhook: { icon: Webhook, color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
  schedule: { icon: Clock, color: "text-indigo-400", bgColor: "bg-indigo-500/20" },
  team: { icon: Users, color: "text-teal-400", bgColor: "bg-teal-500/20" },
  complete: { icon: CheckCircle2, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
}

export function WorkflowNode({
  node,
  isSelected,
  isConnecting = false,
  isConnectingFrom = false,
  onMouseDown,
  onClick,
  onDelete,
}: WorkflowNodeProps) {
  const config = nodeConfig[node.type] || nodeConfig.action
  const Icon = config.icon

  return (
    <div
      className="absolute group"
      style={{
        left: node.x,
        top: node.y,
        cursor: isConnecting ? "pointer" : "move",
      }}
      onMouseDown={onMouseDown}
      onClick={(e) => {
        if (isConnecting && onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
    >
      <div
        className={`
          relative flex w-60 items-center gap-3 rounded-lg border-2 bg-card p-4
          shadow-lg transition-all hover:shadow-xl
          ${isSelected ? "border-accent ring-2 ring-accent/50" : "border-border"}
          ${isConnectingFrom ? "border-accent ring-4 ring-accent/50 animate-pulse" : ""}
          ${isConnecting ? "hover:border-accent" : ""}
        `}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${config.bgColor}`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>

        <div className="flex-1">
          <div className="text-sm font-medium">{node.label}</div>
          <div className="text-xs text-muted-foreground">ID: {node.id}</div>
        </div>

        {!isConnecting && <GripVertical className="h-4 w-4 text-muted-foreground" />}

        {!isConnecting && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Connection points */}
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-border bg-background" />
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-border bg-background" />
      </div>
    </div>
  )
}
