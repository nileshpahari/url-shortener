import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, BASE_URL } from "@/constants";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MousePointerClick, Clock } from "lucide-react";
import axios from "axios";

interface Url {
	id: string;
	redirectURL: string;
	clicks: number;
	clickHistory: { timestamp: number }[];
}

export default function AnalyticsPage() {
	const [urls, setUrls] = useState<Url[]>([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);

	const fetchUrls = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${API_BASE_URL}/url/all`);
			const data = res.data.urls as Url[];
			setUrls(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUrls();
	}, []);

	const filtered = useMemo(() => {
		const q = query.toLowerCase().trim();
		if (!q) return urls;
		return urls.filter(
			(url) =>
				url.redirectURL.toLowerCase().includes(q) ||
				url.id.toLowerCase().includes(q)
		);
	}, [urls, query]);

	const shorten = (url: string) =>
		url.length > 50 ? url.slice(0, 50) + "..." : url;

	const getLastClick = (clickHistory: { timestamp: number }[]) => {
		if (!clickHistory?.length) return null;
		return clickHistory[clickHistory.length - 1]?.timestamp ?? null;
	};

	return (
		<div className="w-full min-h-screen bg-gray px-4 py-10 justify-center items-center flex rounded">
			<div className="w-6xl mx-auto flex flex-col gap-6 z-100 bg-white relative p-6 rounded-lg">
				<h1 className="text-2xl font-bold text-gray-800">Analytics</h1>

				<div className="flex items-center justify-between gap-4">
					<Input
						placeholder="Search links..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="max-w-sm"
					/>
				</div>

				<div className="rounded-md border border-border bg-white shadow-sm">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[30%]">Short URL</TableHead>
								<TableHead className="w-[40%]">Original URL</TableHead>
								<TableHead className="w-[15%] text-center">Clicks</TableHead>
								<TableHead className="w-[15%] text-right">Last Click</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading && (
								<TableRow>
									<TableCell
										colSpan={4}
										className="text-center text-gray-400 text-sm py-6"
									>
										Loading...
									</TableCell>
								</TableRow>
							)}

							{filtered.map((url) => (
								<TableRow key={url.id} className="hover:bg-gray-50 transition">
									<TableCell className="font-mono">
										<a
											href={`${BASE_URL}/${url.id}`}
											target="_blank"
											rel="noreferrer"
											className="truncate text-blue-600 underline underline-offset-4"
										>
											{`${BASE_URL}/${url.id}`}
										</a>
									</TableCell>

									<TableCell>
										<a
											href={url.redirectURL}
											target="_blank"
											rel="noreferrer"
											className="truncate text-gray-500 underline underline-offset-4"
										>
											{shorten(url.redirectURL)}
										</a>
									</TableCell>

									<TableCell className="text-center text-gray-700 font-medium">
										<div className="flex justify-center items-center gap-1">
											<MousePointerClick size={16} className="text-gray-500" />
											{url.clicks}
										</div>
									</TableCell>

									<TableCell className="text-right text-gray-500 text-sm">
										<div className="flex justify-end items-center gap-1">
											<Clock size={14} className="text-gray-400" />
											{getLastClick(url.clickHistory)
												? new Date(getLastClick(url.clickHistory) as number).toLocaleString()
												: "—"}
										</div>
									</TableCell>
								</TableRow>
							))}

							{filtered.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={4}
										className="text-center text-gray-400 text-sm py-6"
									>
										{loading ? "" : "No links found."}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
