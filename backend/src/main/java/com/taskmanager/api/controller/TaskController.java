package com.taskmanager.api.controller;

import com.taskmanager.api.model.Task;
import com.taskmanager.api.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React frontend
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // Get all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get all tasks by completion status
    @GetMapping("/status")
    public List<Task> getTasksByStatus(@RequestParam boolean completed) {
        return taskRepository.findByCompleted(completed);
    }

    // Get task by id
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(task -> ResponseEntity.ok().body(task))
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return new ResponseEntity<>(taskRepository.save(task), HttpStatus.CREATED);
    }

    // Update a task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(taskDetails.getTitle());
                    existingTask.setDescription(taskDetails.getDescription());
                    existingTask.setCompleted(taskDetails.isCompleted());
                    existingTask.setUpdatedAt(LocalDateTime.now());
                    
                    return ResponseEntity.ok().body(taskRepository.save(existingTask));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Toggle task completion status
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggleTaskCompletion(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setCompleted(!existingTask.isCompleted());
                    existingTask.setUpdatedAt(LocalDateTime.now());
                    
                    return ResponseEntity.ok().body(taskRepository.save(existingTask));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
