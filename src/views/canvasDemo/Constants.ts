// 画布通用的常量
enum CoordinateSystem {
    SOLID_COLOR = "#999", // 实线颜色
    DASHED_COLOR = "#ccc", // 虚线颜色
    ZERO_COLOR = "#358bf3", // 坐标系颜色
    GRID_SIZE = 4,  // N*N的网格组,网格大小
    MAX_SCALESIZE = 40,  // 最大放大比例
    MIN_SCALESIZE = 3,  // 最小缩小比例
    SCALE_ABILITY = 1,  // 缩放快慢
    NATIVE_SCALE = 10,  // 原始缩放大小
    ERROR_RANGE = .25,  // 误差范围, 辅助线对齐判断
    DRAW_INTERVAL = 1,  // 绘制的最小时间间隔
    AREA_FILL_COLOR = "rgba(145,202,255, .5)",  // 区域选择的rect填充色
}

//  绘制的边框的控制点索引枚举
const ControlPointIndexArr = ['TOP', 'TOP_RIGHT', 'RIGHT', 'BOTTOM_RIGHT', 'BOTTOM', 'BOTTOM_LEFT', 'LEFT', 'TOP_LEFT', 'ROTATE']

// 自定义事件名称
enum MyEvent {
    DRAW_LINK = 'draw-link',
    POINT_DOWN = 'point-down',
    MOUSE_WHEEL = 'mouse-wheel',
    DRAW = 'draw',
    BLUR = 'blur',
    FOCUS = 'focus',
    DRAW_AREA = 'draw-area',
    DB_CLICK = 'db-click'
}

// 画画的图形
enum BlockType {
    TRIANGLE = "三角形",
    RECT = "矩形",
    CIRCLE = "圆形",
}

export {
    CoordinateSystem,
    MyEvent,
    BlockType,
    ControlPointIndexArr
}