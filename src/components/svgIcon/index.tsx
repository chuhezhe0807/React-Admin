interface SvgProps {
  name: string // 图标的名称
  color?: string // 图标的颜色
  prefix?: string // 前缀
  iconStyle?: { [key: string]: any } // 样式
}

export default function SvgIcon(props: SvgProps) {
  const { name, prefix = "icon", iconStyle = { width: "100px", height: "100%" } } = props
  const symbolId = `#${prefix}-${name}`

  return (
    <svg aria-hidden="true" style={iconStyle}>
      <use href={symbolId}></use>
    </svg>
  )
}
