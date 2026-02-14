import { LineChart, XAxis, Line } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import type { ReactNode } from "react";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

export default function BlehChart(props: {
	data: Record<any, any>[];
	dataKeys: ([string] | [string, string])[];
	tickFormatter?: (value: any, index: number) => string;
	labelFormatter?: (
		label: ReactNode,
		payload: ReadonlyArray<Payload<any, any>>,
	) => ReactNode;
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
					tickFormatter={
						props.tickFormatter ??
						(value => {
							const date = new Date(value);
							return date.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							});
						})
					}
				/>

				<ChartTooltip
					content={
						<ChartTooltipContent
							className="w-37.5"
							nameKey="views"
							labelFormatter={
								props.labelFormatter ??
								(value => {
									return new Date(value).toLocaleDateString(
										"en-US",
										{
											month: "short",
											day: "numeric",
											year: "numeric",
										},
									);
								})
							}
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

export const monthFormatter = (value: any): string => {
	const date = new Date(value);
	return date.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});
};

export const yearFormatter = (value: any): string => {
	const date = new Date(value);
	return date.getFullYear().toString();
};
