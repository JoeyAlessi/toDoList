const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "database_name",
});

connection.connect((err) => {
  // ========================================================================================
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.post("/send-task", (req, res) => {
  const task = req.body.task;
  console.log("TASK: ", task);
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  const query = "INSERT INTO tasks (task) VALUES (?)";
  connection.query(query, [task], (err, result) => {
    if (err) {
      console.error("Error inserting task into database:", err);
      return res.status(500).json({ error: "Failed to save task" });
    }
    console.log("Task saved to database:", task);
    res.json({ message: "Task saved successfully" });
  });
});

app.get("/get-tasks", (req, res) => {
  // ========================================================================================
  const query = "SELECT * FROM tasks ORDER BY id DESC";
  connection.query(query, (err, rows) => {
    if (err) {
      console.error("Error fetching tasks from database:", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    // Extracting tasks from rows
    const tasks = rows.map((row) => row);

    res.json({ tasks: tasks });
  });
});

app.delete("/delete-task/:taskID", (req, res) => {
  // ========================================================================================
  taskID = req.params.taskID;
  console.log("A:LKJAS:LFKJSDL:F: ", taskID);
  const query = "DELETE FROM tasks WHERE id = ?";
  connection.query(query, [taskID], (err, result) => {
    if (err) {
      console.error("Error deleting task from database:", err);
      return res.status(500).json({ error: "Failed to delete task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    console.log("Task deleted from database:", taskID);
    res.json({ message: "Task deleted successfully" });
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
