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
	inflRC,
	setInflRC,
	labelFormatter,
}: {
	title: string;
	labelFormatter?: (value: any) => string;
	data: Item[];
	inflRC: boolean;
	setInflRC: (value: boolean) => void;
}) {
	return (
		<Card className="bg-popover">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid md:grid-cols-4 gap-5">
					<Card>
						<CardHeader>
							<div className="absolute flex justify-self-end items-center space-x-2">
								<Checkbox
									checked={inflRC}
									onCheckedChange={val =>
										setInflRC(
											typeof val === "boolean"
												? val
												: false,
										)
									}
									id="show-diff-checkbox"
								/>
								<Label htmlFor="show-diff-checkbox">
									In RC
								</Label>
							</div>

							<CardTitle>Inflation</CardTitle>
							<CardDescription>
								Amount of credits added into the economy
							</CardDescription>
						</CardHeader>

						<CardContent>
							<BlehChart
								data={data}
								labelFormatter={labelFormatter}
								tickFormatter={labelFormatter}
								dataKeys={
									inflRC
										? [["inflrc", "var(--chart-1)"]]
										: [["inflation", "var(--chart-1)"]]
								}
							/>
						</CardContent>
					</Card>

					<ChartCard
						title="Comparison Rate"
						description="Comparison of 1 RC to British Pence"
						data={data}
						dataKeys={[["comp.pence", "var(--chart-4)"]]}
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
