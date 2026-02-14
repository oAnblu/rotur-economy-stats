import type { Item } from "@/App";

type KeyFn = (d: Date) => number;
type NormalizeDateFn = (d: Date) => Date;

function groupByPeriod(
	data: Item[],
	keyFn: KeyFn,
	normalizeDate: NormalizeDateFn,
): Item[] {
	const groups = new Map<number, Item[]>();

	for (const item of data) {
		const d = new Date(item.ts);
		const key = keyFn(d);

		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(item);
	}

	const out: Item[] = [];

	for (const group of groups.values()) {
		const item: Item = group.reduce((a, b) => {
			const adate = new Date(a.ts);
			const date = normalizeDate(adate);

			return {
				ts: date.getTime(),
				date: date.toDateString(),

				vari: a.vari + b.vari,

				inflation: 0,
				inflrc: 0,
				total: 0,

				avg: a.avg + b.avg,
				comp: {
					cents: a.comp.cents + b.comp.cents,
					pence: a.comp.pence + b.comp.pence,
				},
			};
		});

		const last = group.reduce((a, b) => (a.ts > b.ts ? a : b));

		item.total = last.total;
		item.avg /= group.length;
		item.comp = {
			cents: item.comp.cents / group.length,
			pence: item.comp.pence / group.length,
		};

		out.push(item);
	}

	out.sort((a, b) => a.ts - b.ts);

	for (let i = 1; i < out.length; i++) {
		const prev = out[i - 1];
		const curr = out[i];

		curr.inflrc = curr.total - prev.total;
		curr.inflation =
			prev.total !== 0 ? (curr.inflrc / prev.total) * 100 : 0;
	}

	return out;
}

export const monthlyData = (data: Item[]) =>
	groupByPeriod(
		data,
		d => d.getFullYear() * 12 + d.getMonth(),
		d => new Date(d.getFullYear(), d.getMonth(), 1),
	);

export const yearlyData = (data: Item[]) =>
	groupByPeriod(
		data,
		d => d.getFullYear(),
		d => new Date(d.getFullYear(), 0, 1),
	);
