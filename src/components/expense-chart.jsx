"use client"

import { useEffect, useRef } from "react"

export default function ExpenseChart({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate total for percentages
    const total = data.reduce((sum, category) => sum + category.amount, 0)

    // Draw pie chart
    let startAngle = 0
    data.forEach((category) => {
      const sliceAngle = (category.amount / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = category.color
      ctx.fill()

      startAngle += sliceAngle
    })

    // Draw inner circle for donut effect
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()

    // Add text in center
    ctx.fillStyle = "#333"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Total", centerX, centerY - 10)

    ctx.fillStyle = "#000"
    ctx.font = "bold 20px sans-serif"
    ctx.fillText(`₹${total.toLocaleString()}`, centerX, centerY + 15)
  }, [data])

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas ref={canvasRef} width={200} height={200} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 w-full">
        {data.map((category) => (
          <div key={category.name} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
            <span className="text-sm">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

