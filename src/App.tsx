import { useEffect, useState } from "react";
import ChartCard from "./components/ChartCard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./components/ui/card";
import BlehChart from "./components/BlehChart";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";

export interface Item {
	ts: number;
	date: string;
	inflation: number;
	inflrc: number;

	avg: number;
	total: number;
	vari: number;

	comp: {
		cents: number;
		pence: number;
	};
}

export function getPrevious(items: Item[], ts: number): Item | undefined {
	return items.filter(item => item.ts < ts).sort((a, b) => b.ts - a.ts)[0];
}

export default function App() {
	const [data, setData] = useState<Item[]>([]);
	const [inflRC, setInflRC] = useState<boolean>(false);

	useEffect(() => {
		fetch("https://rotur-economy-stats.oanblu-acb.workers.dev/")
			.then(r => r.json())
			.then(items =>
				items.map((item: Item) => {
					const prev = getPrevious(items, item.ts);

					const inflrc = prev ? item.total - prev.total : 0;
					const inflation =
						prev && prev.total !== 0
							? (inflrc / prev.total) * 100
							: 0;

					return {
						...item,
						inflation,
						inflrc,
						date: new Date(item.ts).toDateString(),
					};
				}),
			)
			.then(r => setData(r));
	}, []);

	if (!data.length) return <div>Loading...</div>;
	return (
		<div className="p-5">
			<div className="flex flex-col gap-5">
				<Card>
					<CardContent>
						<h1 className="text-xl font-bold">
							Rotur Economy Statistics
						</h1>
					</CardContent>
				</Card>

				<Card className="bg-popover">
					<CardContent>
						<div className="grid grid-rows-1 grid-cols-4 gap-5">
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
										dataKeys={
											inflRC
												? [["inflrc", "var(--chart-1)"]]
												: [
														[
															"inflation",
															"var(--chart-1)",
														],
													]
										}
									/>
								</CardContent>
							</Card>

							<ChartCard
								title="Comparison Rate"
								description="Comparison of 1 RC to British Pence"
								data={data}
								dataKeys={[["comp.pence", "var(--chart-4)"]]}
							/>

							<ChartCard
								title="Credit Supply"
								description="Total amount of credits in the economy"
								data={data}
								dataKeys={[["total", "var(--chart-3)"]]}
							/>

							<ChartCard
								title="Average Balance"
								description="The average balance for a Rotur account"
								data={data}
								dataKeys={[["avg", "var(--chart-5)"]]}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* <pre>
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre> */}
		</div>
	);
}
