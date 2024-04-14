import { useState, useEffect } from "react";
import "../styles/TodoList.css";
import AxiosClient from "../AxiosClient";

function TodoList() {
    const [tasks, setTasks] = useState(["basta"]);
    const [newTask, setNewTask] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function handleOnChange(e) {
        setNewTask(e.target.value);
    }

    async function addTask() {
        if (newTask.trim() !== "") {
            if (
                tasks.some(
                    (task) => task.todo.toLowerCase() === newTask.toLowerCase()
                )
            ) {
                const error = "Task already exists";
                setNewTask("");
                setErrorMessage(error);
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
                return;
            }
            try {
                const response = await AxiosClient.post("/addTodo", {
                    todo: newTask,
                });
                const newTaskData = response.data.todo;
                setTasks((prevTasks) => [...prevTasks, newTaskData]);
                setNewTask("");
                setErrorMessage("");
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    }

    async function deleteTask(taskId) {
        try {
            await AxiosClient.delete(`/deleteTodo/${taskId}`);
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    async function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [
                updatedTasks[index - 1],
                updatedTasks[index],
            ];
            setTasks(updatedTasks);

            try {
                await AxiosClient.put(`/updateTodoOrder/${tasks[index].id}`, {
                    order: index - 1,
                });
            } catch (error) {
                console.error("Error updating task order:", error);
            }
        }
    }

    async function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [
                updatedTasks[index + 1],
                updatedTasks[index],
            ];
            setTasks(updatedTasks);

            try {
                const taskId = tasks[index].id;
                await AxiosClient.put(`/updateTodoOrder/${taskId}`, {
                    order: index + 1,
                });
                await AxiosClient.put(
                    `/updateTodoOrder/${tasks[index + 1].id}`,
                    {
                        order: index,
                    }
                );
            } catch (error) {
                console.error("Error moving task down:", error);
            }
        }
    }

    useEffect(() => {
        document.title = `Todos`;
        async function fetchTasks() {
            try {
                const response = await AxiosClient.get("/showTodo");
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }

        fetchTasks();
    }, []);

    return (
        <div className="todo-container">
            <div className="container d-flex justify-content-start align-items-center">
                <h2>Todo Lists</h2>
                <div className="input-todo">
                    <input
                        type="text"
                        value={newTask}
                        onChange={handleOnChange}
                        placeholder="Enter Task"
                    />
                    <button onClick={addTask}>Add</button>
                </div>
                {errorMessage && (
                    <div className="invalid-feedbacks">{errorMessage}</div>
                )}
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            <span className="text">{task.todo}</span>
                            <div className="buttons">
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() => moveTaskUp(index)}
                                    className="up-btn"
                                >
                                    Up
                                </button>
                                <button
                                    onClick={() => moveTaskDown(index)}
                                    className="down-btn"
                                >
                                    Down
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TodoList;
