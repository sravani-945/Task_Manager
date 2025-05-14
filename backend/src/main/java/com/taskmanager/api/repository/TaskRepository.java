package com.taskmanager.api.repository;

import com.taskmanager.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Find all tasks by completion status
    List<Task> findByCompleted(boolean completed);
}
