import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { monthFormatter, yearFormatter } from "./components/BlehChart";
import { monthlyData, yearlyData } from "./lib/timeperiods";
import EcoInfoCard from "./components/EcoInfoCard";

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

				<EcoInfoCard
					title="Per day"
					data={data}
					inflRC={inflRC}
					setInflRC={setInflRC}
				/>

				<EcoInfoCard
					title="Per month"
					data={monthlyData(data)}
					inflRC={inflRC}
					setInflRC={setInflRC}
					labelFormatter={monthFormatter}
				/>

				<EcoInfoCard
					title="Per year"
					data={yearlyData(data)}
					inflRC={inflRC}
					setInflRC={setInflRC}
					labelFormatter={yearFormatter}
				/>
			</div>

			{/* <pre>
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre> */}
		</div>
	);
}
