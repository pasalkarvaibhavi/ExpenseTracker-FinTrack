"use client"

import { useEffect, useRef } from "react"

export default function MonthlyTrendChart({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Find max value for scaling
    const maxValue = Math.max(...data.map((item) => item.amount)) * 1.1 // Add 10% padding

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#E5E7EB" // gray-200
    ctx.lineWidth = 1

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)

    // X-axis
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw grid lines
    const gridLines = 5
    ctx.beginPath()
    ctx.strokeStyle = "#F3F4F6" // gray-100
    ctx.lineWidth = 1

    for (let i = 1; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i
      ctx.moveTo(padding, canvas.height - y)
      ctx.lineTo(canvas.width - padding, canvas.height - y)
    }
    ctx.stroke()

    // Draw data points and line
    if (data.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#8B5CF6" // purple-500
      ctx.lineWidth = 3

      // Calculate x and y positions for each data point
      const points = data.map((item, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = canvas.height - padding - (item.amount / maxValue) * chartHeight
        return { x, y }
      })

      // Draw line connecting points
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        // Create a curved line
        const xc = (points[i].x + points[i - 1].x) / 2
        const yc = (points[i].y + points[i - 1].y) / 2
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc)
      }
      ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        points[points.length - 1].x,
        points[points.length - 1].y,
      )
      ctx.stroke()

      // Draw points
      points.forEach((point, index) => {
        ctx.beginPath()
        ctx.fillStyle = "#8B5CF6" // purple-500
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
        ctx.fill()

        // Draw white inner circle
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
        ctx.fill()

        // Draw month labels
        ctx.fillStyle = "#6B7280" // gray-500
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(data[index].name, point.x, canvas.height - padding + 20)

        // Draw amount labels for first, last, min and max points
        if (
          index === 0 ||
          index === points.length - 1 ||
          data[index].amount === Math.max(...data.map((d) => d.amount)) ||
          data[index].amount === Math.min(...data.map((d) => d.amount))
        ) {
          ctx.fillStyle = "#4B5563" // gray-600
          ctx.font = "bold 12px Arial"
          const labelY = point.y - 15
          ctx.fillText(`₹${data[index].amount.toLocaleString()}`, point.x, labelY)
        }
      })

      // Add gradient fill under the line
      const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding)
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.3)") // purple-500 with opacity
      gradient.addColorStop(1, "rgba(139, 92, 246, 0.05)")

      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.moveTo(points[0].x, canvas.height - padding)
      ctx.lineTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2
        const yc = (points[i].y + points[i - 1].y) / 2
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc)
      }

      ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        points[points.length - 1].x,
        points[points.length - 1].y,
      )

      ctx.lineTo(points[points.length - 1].x, canvas.height - padding)
      ctx.closePath()
      ctx.fill()
    }
  }, [data])

  return (
    <div className="h-full w-full">
      <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
    </div>
  )
}

