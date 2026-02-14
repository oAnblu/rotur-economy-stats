import type { Item } from "@/App";
import BlehChart from "./BlehChart";
import ChartCard from "./ChartCard";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export default function EcoInfoCard({
	title,
	data,
	labelFormatter,

	inflRC,
	setInflRC,

	showCents,
	setShowCents,
}: {
	title: string;
	labelFormatter?: (value: any) => string;
	data: Item[];

	inflRC: boolean;
	showCents: boolean;

	setShowCents: (value: boolean) => void;
	setInflRC: (value: boolean) => void;
}) {
	return (
		<Card className="bg-popover">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid md:grid-cols-4 gap-5">
					<ChartCard
						title="Inflation"
						description="Amount of credits added into the economy"
						data={data}
						labelFormatter={labelFormatter}
						tickFormatter={labelFormatter}
						dataKeys={
							inflRC
								? [["inflrc", "var(--chart-1)"]]
								: [["inflation", "var(--chart-1)"]]
						}
					/>

					<ChartCard
						title="Comparison Rate"
						description={`Comparison of 1 RC to ${showCents ? "American Cent" : "British Pence"}`}
						data={data}
						dataKeys={
							showCents
								? [["comp.cents", "var(--chart-4)"]]
								: [["comp.pence", "var(--chart-4)"]]
						}
						tickFormatter={labelFormatter}
						labelFormatter={labelFormatter}
					/>

					<ChartCard
						title="Credit Supply"
						description="Total amount of credits in the economy"
						data={data}
						dataKeys={[["total", "var(--chart-3)"]]}
						tickFormatter={labelFormatter}
						labelFormatter={labelFormatter}
					/>

					<ChartCard
						title="Average Balance"
						description="The average balance for a Rotur account"
						data={data}
						dataKeys={[["avg", "var(--chart-5)"]]}
						tickFormatter={labelFormatter}
						labelFormatter={labelFormatter}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
