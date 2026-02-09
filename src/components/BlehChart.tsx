import { LineChart, XAxis, Line } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

export default function BlehChart(props: {
	data: Record<any, any>[];
	dataKeys: ([string] | [string, string])[];
}) {
	return (
		<ChartContainer config={{}}>
			<LineChart accessibilityLayer data={props.data}>
				<XAxis
					dataKey="date"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={32}
					tickFormatter={value => {
						const date = new Date(value);
						return date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						});
					}}
				/>

				<ChartTooltip
					content={
						<ChartTooltipContent
							className="w-37.5"
							nameKey="views"
							labelFormatter={value => {
								return new Date(value).toLocaleDateString(
									"en-US",
									{
										month: "short",
										day: "numeric",
										year: "numeric",
									},
								);
							}}
						/>
					}
				/>

				{props.dataKeys.map(([key, color]) => (
					<Line
						key={key}
						dataKey={key}
						type="monotone"
						stroke={color}
						strokeWidth={2}
						dot={false}
					/>
				))}
			</LineChart>
		</ChartContainer>
	);
}
