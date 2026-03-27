import { useMemo, useState } from "react";
import TaskInput from "./components/TaskInput";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";

export default function App() {
	const [tasks, setTasks] = useState([]);
	const [filter, setFilter] = useState("all");

	const addTask = (title) => {
		const trimmed = title.trim();
		if (!trimmed) return;

		const newTask = {
			id: Date.now(),
			title: trimmed,
			completed: false,
		};

		setTasks((prev) => [newTask, ...prev]);
	};

	const toggleTask = (id) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const filteredTasks = useMemo(() => {
		if (filter === "active") return tasks.filter((task) => !task.completed);
		if (filter === "completed") return tasks.filter((task) => task.completed);
		return tasks;
	}, [tasks, filter]);

	return (
		<main
			style={{
				maxWidth: 520,
				margin: "40px auto",
				padding: 20,
				fontFamily: "Arial, sans-serif",
				border: "1px solid #ddd",
				borderRadius: 12,
			}}
		>
			<h1 style={{ marginTop: 0 }}>Task Tracker</h1>

			<TaskInput onAddTask={addTask} />
			<FilterBar currentFilter={filter} onChangeFilter={setFilter} />
			<TaskList tasks={filteredTasks} onToggleTask={toggleTask} />
		</main>
	);
}
