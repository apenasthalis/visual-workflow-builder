"use client"

import { useState } from "react"
import { WorkflowCanvas } from "@/components/workflow-canvas"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function Page() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleToggleConnection = () => {
    setIsConnecting((prev) => !prev)
  }

  const handleConnectionComplete = () => {
    setIsConnecting(false)
  }

  const handleNewNode = () => {
    alert("Arraste um componente da barra lateral para o canvas para criar um novo node!")
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <Header onNewNode={handleNewNode} onToggleConnection={handleToggleConnection} isConnecting={isConnecting} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <WorkflowCanvas isConnecting={isConnecting} onConnectionComplete={handleConnectionComplete} />
        </main>
      </div>
    </div>
  )
}
