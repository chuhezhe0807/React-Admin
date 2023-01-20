export interface MetaProps {
  keepAlive?: boolean
  requireAuth?: boolean
  title: string
  key?: string
}

export interface RouteObject {
  caseSensitive?: boolean
  element?: React.ReactNode
  index?: boolean
  path?: string
  meta?: MetaProps
  isLink?: string
  children?: Array<RouteObject>
}
