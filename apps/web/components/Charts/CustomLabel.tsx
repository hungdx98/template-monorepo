import get from 'lodash/get'

const CustomLabel = ({ x, y, width, index, data, height }: any) => {
  const item = get(data, `data.${index}`)
  const isActive = get(item, 'isActive')
  if (!isActive) return null

  const activePrice = get(item, 'binStep', 0)
  const text = `Active Bin: ${activePrice} ${data.label.tokenX} per ${data.label.tokenY}`
  const padding = 8
  const textWidth = text.length * 6
  const textHeight = 20
  const offset = 8
  const rectHeight = textHeight + 2 * padding
  const xHeight = (height * item.tokenX) / item.tokenY

  return (
    <g>
      <line
        x1={x + width / 2}
        y1={y - offset}
        x2={x + width / 2}
        y2={y + height + xHeight}
        stroke="#242424"
        strokeWidth={1}
      />
      <rect
        x={x + width / 2 - textWidth / 2 - padding}
        y={y - offset - rectHeight}
        width={textWidth + padding * 2}
        height={textHeight + padding}
        fill="#F7F7F7"
        rx={4}></rect>
      <text
        x={x + width / 2}
        y={y - offset - padding * 2}
        textAnchor="middle"
        fill="#000000"
        fontSize={12}>
        {text}
      </text>
    </g>
  )
}

export default CustomLabel
