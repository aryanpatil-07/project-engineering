export default function FilterBar({ currentFilter, onChangeFilter }) {
	const filters = ["all", "active", "completed"];

	return (
		<div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
			{filters.map((filter) => {
				const isActive = currentFilter === filter;

				return (
					<button
						key={filter}
						onClick={() => onChangeFilter(filter)}
						style={{
							padding: "8px 12px",
							borderRadius: 8,
							border: isActive ? "2px solid #1f6feb" : "1px solid #ccc",
							background: isActive ? "#e8f0ff" : "#fff",
							cursor: "pointer",
							textTransform: "capitalize",
						}}
					>
						{filter}
					</button>
				);
			})}
		</div>
	);
}
