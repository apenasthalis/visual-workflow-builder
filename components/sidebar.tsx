"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  Square,
  Circle,
  GitBranch,
  Database,
  Mail,
  FileText,
  Webhook,
  Clock,
  Users,
  CheckCircle2,
  Search,
} from "lucide-react"

const nodeTypes = [
  { id: "trigger", label: "Gatilho", icon: Play, color: "bg-green-500/20 text-green-400" },
  { id: "action", label: "Ação", icon: Square, color: "bg-blue-500/20 text-blue-400" },
  { id: "condition", label: "Condição", icon: GitBranch, color: "bg-yellow-500/20 text-yellow-400" },
  { id: "database", label: "Banco de Dados", icon: Database, color: "bg-purple-500/20 text-purple-400" },
  { id: "email", label: "Email", icon: Mail, color: "bg-pink-500/20 text-pink-400" },
  { id: "document", label: "Documento", icon: FileText, color: "bg-orange-500/20 text-orange-400" },
  { id: "webhook", label: "Webhook", icon: Webhook, color: "bg-cyan-500/20 text-cyan-400" },
  { id: "schedule", label: "Agendamento", icon: Clock, color: "bg-indigo-500/20 text-indigo-400" },
  { id: "team", label: "Equipe", icon: Users, color: "bg-teal-500/20 text-teal-400" },
  { id: "complete", label: "Completo", icon: CheckCircle2, color: "bg-emerald-500/20 text-emerald-400" },
]

export function Sidebar() {
  const [search, setSearch] = useState("")

  const filteredNodes = nodeTypes.filter((node) => node.label.toLowerCase().includes(search.toLowerCase()))

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="border-b border-border p-4">
          <h2 className="mb-3 text-sm font-semibold">Componentes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {filteredNodes.map((node) => {
              const Icon = node.icon
              return (
                <Button
                  key={node.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 py-6 hover:bg-secondary"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("nodeType", node.id)
                    e.dataTransfer.setData("nodeLabel", node.label)
                    e.dataTransfer.effectAllowed = "copy"
                  }}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-md ${node.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm">{node.label}</span>
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Circle className="mr-2 h-4 w-4" />
            Modelos
          </Button>
        </div>
      </div>
    </aside>
  )
}
