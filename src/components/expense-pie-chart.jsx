"use client"

import { useEffect, useRef } from "react"

export default function ExpensePieChart({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate total for percentages
    const total = data.reduce((sum, category) => sum + category.value, 0)

    // Draw pie chart
    let startAngle = 0
    data.forEach((category) => {
      const sliceAngle = (category.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = category.color
      ctx.fill()

      // Add label
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      // Only add label if slice is big enough
      if (sliceAngle > 0.2) {
        const percent = Math.round((category.value / total) * 100)
        if (percent >= 5) {
          ctx.fillStyle = "#FFFFFF"
          ctx.font = "bold 12px Arial"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(`${percent}%`, labelX, labelY)
        }
      }

      startAngle += sliceAngle
    })

    // Draw inner circle for donut effect
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()

    // Add text in center
    ctx.fillStyle = "#333"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Total", centerX, centerY - 10)

    ctx.fillStyle = "#000"
    ctx.font = "bold 20px Arial"
    ctx.fillText(`₹${total.toLocaleString()}`, centerX, centerY + 15)
  }, [data])

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas ref={canvasRef} width={300} height={300} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 w-full">
        {data.map((category) => (
          <div key={category.id} className="flex items-center truncate">
            <span
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: category.color }}
            ></span>
            <span className="text-sm truncate">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
