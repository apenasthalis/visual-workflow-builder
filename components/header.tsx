"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download, Share2, Undo2, Redo2, Zap, Link2 } from "lucide-react"

interface HeaderProps {
  onNewNode?: () => void
  onToggleConnection?: () => void
  isConnecting?: boolean
}

export function Header({ onNewNode, onToggleConnection, isConnecting }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
            <Zap className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-lg font-semibold">ConstrutorFluxo</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <span className="text-sm text-muted-foreground">Fluxo sem título</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border" />
        <Button variant={isConnecting ? "default" : "ghost"} size="sm" className="gap-2" onClick={onToggleConnection}>
          <Link2 className="h-4 w-4" />
          {isConnecting ? "Conectando..." : "Conectar"}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Button size="sm" className="gap-2" onClick={onNewNode}>
          <Plus className="h-4 w-4" />
          Novo Node
        </Button>
      </div>
    </header>
  )
}
