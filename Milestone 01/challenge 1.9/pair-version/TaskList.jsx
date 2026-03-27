export default function TaskList({ tasks, onToggleTask }) {
	if (tasks.length === 0) {
		return <p style={{ color: "#666", margin: 0 }}>No tasks found.</p>;
	}

	return (
		<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
			{tasks.map((task) => (
				<li
					key={task.id}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 10,
						padding: "10px 0",
						borderBottom: "1px solid #eee",
					}}
				>
					<input
						type="checkbox"
						checked={task.completed}
						onChange={() => onToggleTask(task.id)}
					/>
					<span
						style={{
							textDecoration: task.completed ? "line-through" : "none",
							color: task.completed ? "#888" : "#111",
						}}
					>
						{task.title}
					</span>
				</li>
			))}
		</ul>
	);
}
