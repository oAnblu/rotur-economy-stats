import type { ReactNode } from "react";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import BlehChart from "./BlehChart";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "./ui/card";

export default function ChartCard(props: {
	data: any;
	dataKeys: ([string] | [string, string])[];
	title: string;
	description: string;
	tickFormatter?: (value: any, index: number) => string;
	labelFormatter?: (
		label: ReactNode,
		payload: ReadonlyArray<Payload<any, any>>,
	) => ReactNode;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
				<CardDescription>{props.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<BlehChart
					data={props.data}
					dataKeys={props.dataKeys}
					tickFormatter={props.tickFormatter}
					labelFormatter={props.labelFormatter}
				/>
			</CardContent>
		</Card>
	);
}
