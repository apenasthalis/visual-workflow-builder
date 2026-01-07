"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { WorkflowNode } from "@/components/workflow-node"
import { WorkflowConnection } from "@/components/workflow-connection"

interface Node {
  id: string
  type: string
  label: string
  x: number
  y: number
}

interface Connection {
  id: string
  from: string
  to: string
}

interface WorkflowCanvasProps {
  isConnecting: boolean
  onConnectionComplete: () => void
}

export function WorkflowCanvas({ isConnecting, onConnectionComplete }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", type: "trigger", label: "Gatilho", x: 100, y: 100 },
    { id: "2", type: "action", label: "Ação", x: 350, y: 100 },
    { id: "3", type: "condition", label: "Condição", x: 600, y: 100 },
  ])
  const [connections, setConnections] = useState<Connection[]>([
    { id: "c1", from: "1", to: "2" },
    { id: "c2", from: "2", to: "3" },
  ])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 })
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const nodeType = e.dataTransfer.getData("nodeType")
      const nodeLabel = e.dataTransfer.getData("nodeLabel")

      if (nodeType && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - viewOffset.x
        const y = e.clientY - rect.top - viewOffset.y

        const newNode: Node = {
          id: Date.now().toString(),
          type: nodeType,
          label: nodeLabel,
          x,
          y,
        }

        setNodes((prev) => [...prev, newNode])
      }
    },
    [viewOffset],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (isConnecting) {
        setConnectingFrom((prev) => {
          if (!prev) {
            return nodeId
          } else {
            if (prev !== nodeId) {
              const connectionExists = connections.some(
                (c) => (c.from === prev && c.to === nodeId) || (c.from === nodeId && c.to === prev),
              )
              if (!connectionExists) {
                setConnections((prevConnections) => [
                  ...prevConnections,
                  { id: `c${Date.now()}`, from: prev, to: nodeId },
                ])
              }
            }
            onConnectionComplete()
            return null
          }
        })
      }
    },
    [isConnecting, connections, onConnectionComplete],
  )

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    if (!isConnecting) {
      setDraggedNode(nodeId)
      setSelectedNode(nodeId)
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        setOffset({
          x: e.clientX - node.x - viewOffset.x,
          y: e.clientY - node.y - viewOffset.y,
        })
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggedNode && !isConnecting) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y })
      setSelectedNode(null)
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggedNode) {
        setNodes((prev) =>
          prev.map((node) =>
            node.id === draggedNode
              ? {
                  ...node,
                  x: e.clientX - offset.x - viewOffset.x,
                  y: e.clientY - offset.y - viewOffset.y,
                }
              : node,
          ),
        )
      } else if (isPanning) {
        setViewOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        })
      }
    },
    [draggedNode, offset, isPanning, panStart, viewOffset],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null)
    setIsPanning(false)
  }, [])

  useEffect(() => {
    if (draggedNode || isPanning) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggedNode, isPanning, handleMouseMove, handleMouseUp])

  useEffect(() => {
    if (!isConnecting) {
      setConnectingFrom(null)
    }
  }, [isConnecting])

  return (
    <div
      ref={canvasRef}
      className="relative h-full w-full overflow-hidden bg-background"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDown}
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
        cursor: isPanning ? "grabbing" : isConnecting ? "crosshair" : "grab",
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ transform: `translate(${viewOffset.x}px, ${viewOffset.y}px)` }}
      >
        {connections.map((connection) => {
          const fromNode = nodes.find((n) => n.id === connection.from)
          const toNode = nodes.find((n) => n.id === connection.to)
          if (!fromNode || !toNode) return null

          return (
            <WorkflowConnection
              key={connection.id}
              from={{ x: fromNode.x + 120, y: fromNode.y + 40 }}
              to={{ x: toNode.x, y: toNode.y + 40 }}
            />
          )
        })}
      </svg>

      <div
        className="absolute"
        style={{
          transform: `translate(${viewOffset.x}px, ${viewOffset.y}px)`,
        }}
      >
        {nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isConnecting={isConnecting}
            isConnectingFrom={connectingFrom === node.id}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onClick={() => handleNodeClick(node.id)}
            onDelete={() => {
              setNodes((prev) => prev.filter((n) => n.id !== node.id))
              setConnections((prev) => prev.filter((c) => c.from !== node.id && c.to !== node.id))
            }}
          />
        ))}
      </div>

      {isConnecting && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg border border-accent bg-card px-4 py-2 shadow-lg">
          <p className="text-sm font-medium text-accent">
            {connectingFrom ? "Clique no node de destino" : "Clique no primeiro node"}
          </p>
        </div>
      )}
    </div>
  )
}
