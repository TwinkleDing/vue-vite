import * as echarts from "echarts/core"
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent
} from "echarts/components"
import { LineChart, BarChart } from "echarts/charts"
import { UniversalTransition } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"

echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    LineChart,
    BarChart,
    CanvasRenderer,
    UniversalTransition
])

export default echarts
