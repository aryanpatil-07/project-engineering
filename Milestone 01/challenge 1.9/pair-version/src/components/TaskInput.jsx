import { useState } from "react";

export default function TaskInput({ onAddTask }) {
	const [title, setTitle] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		onAddTask(title);
		setTitle("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			style={{ display: "flex", gap: 8, marginBottom: 16 }}
		>
			<input
				type="text"
				placeholder="Enter task title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				style={{
					flex: 1,
					padding: "10px 12px",
					border: "1px solid #ccc",
					borderRadius: 8,
				}}
			/>
			<button
				type="submit"
				style={{
					padding: "10px 14px",
					border: "none",
					borderRadius: 8,
					background: "#1f6feb",
					color: "#fff",
					cursor: "pointer",
				}}
			>
				Add
			</button>
		</form>
	);
}
