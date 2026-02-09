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
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
				<CardDescription>{props.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<BlehChart data={props.data} dataKeys={props.dataKeys} />
			</CardContent>
		</Card>
	);
}
