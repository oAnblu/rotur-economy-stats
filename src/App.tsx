import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "./components/ui/card";
import { monthFormatter, yearFormatter } from "./components/BlehChart";
import { monthlyData, yearlyData } from "./lib/timeperiods";
import EcoInfoCard from "./components/EcoInfoCard";
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
	const [showCents, setShowCents] = useState<boolean>(false);

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
					<CardContent className="flex flex-row justify-between">
						<h1 className="text-xl font-bold">
							<a target="_blank" href="https://rotur.dev">
								Rotur
							</a>{" "}
							Economy Statistics
						</h1>

						<div className="flex flex-col gap-2">
							<div className="flex justify-self-end items-center space-x-2">
								<Checkbox
									checked={inflRC}
									onCheckedChange={val =>
										setInflRC(
											typeof val === "boolean"
												? val
												: false,
										)
									}
									id="show-rc-checkbox"
								/>
								<Label htmlFor="show-rc-checkbox">
									Show Inflation as RC
								</Label>
							</div>

							<div className="flex justify-self-end items-center space-x-2">
								<Checkbox
									checked={showCents}
									onCheckedChange={val =>
										setShowCents(
											typeof val === "boolean"
												? val
												: false,
										)
									}
									id="show-comp-checkbox"
								/>
								<Label htmlFor="show-comp-checkbox">
									Show Comparison as Cents
								</Label>
							</div>
						</div>
					</CardContent>
				</Card>

				<EcoInfoCard
					title="Per day"
					data={data}
					inflRC={inflRC}
					setInflRC={setInflRC}
					showCents={showCents}
					setShowCents={setShowCents}
				/>

				<EcoInfoCard
					title="Per month"
					data={monthlyData(data)}
					labelFormatter={monthFormatter}
					inflRC={inflRC}
					setInflRC={setInflRC}
					showCents={showCents}
					setShowCents={setShowCents}
				/>

				<EcoInfoCard
					title="Per year"
					data={yearlyData(data)}
					labelFormatter={yearFormatter}
					inflRC={inflRC}
					setInflRC={setInflRC}
					showCents={showCents}
					setShowCents={setShowCents}
				/>
			</div>

			{/* <pre>
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre> */}
		</div>
	);
}
