import prisma from "../lib/prisma.js";

// Simpler approach - just get all tasks
export async function getAllTasks(userId) {
  return await prisma.task.findMany({
    where: { userId },
    include: { subtasks: true },
    orderBy: { createdAt: "desc" },
  });
}

// Get task by ID
export async function getTaskById(id, userId) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
      include: { subtasks: true },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  } catch (error) {
    throw new Error(`Error retrieving task: ${error.message}`);
  }
}

// Create new task
export async function createTask(taskData, userId) {
  try {
    // Convert status from kebab-case to snake_case for Prisma enum
    const status =
      taskData.status === "in-progress" ? "in_progress" : taskData.status;

    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        status: status,
        priority: taskData.priority,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        assignedTo: taskData.assignedTo,
        userId: userId,
        subtasks: {
          create: taskData.subtasks || [],
        },
      },
      include: {
        subtasks: true,
      },
    });

    return task;
  } catch (error) {
    throw new Error(`Error creating task: ${error.message}`);
  }
}

// Update task
export async function updateTask(id, updateData, userId) {
  try {
    // Check if task exists
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }
      
    // Convert status from kebab-case to snake_case for Prisma enum
   const { userId: _, subtasks: __, id: ___, ...cleanData } = updateData;

   if (cleanData.status && cleanData.status === "in-progress") {
     cleanData.status = "in_progress";
   }

   if (cleanData.dueDate) {
     cleanData.dueDate = new Date(cleanData.dueDate);
   }

   const task = await prisma.task.update({
     where: { id },
     data: cleanData,
     include: {
       subtasks: true,
     },
   });
    return task;
  } catch (error) {
    throw new Error(`Error updating task: ${error.message}`);
  }
}

// Delete task
export async function deleteTask(id, userId) {
  try {
    // Check if task exists
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        subtasks: true,
      },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Delete the task (subtasks will be deleted automatically due to cascade)
    await prisma.task.delete({
      where: { id },
    });

    return existingTask;
  } catch (error) {
    if (error.message.includes("not found")) {
      throw error;
    }
    throw new Error(`Error deleting task: ${error.message}`);
  }
}

// Create subtask
export async function createSubtask(taskId, subtaskData, userId) {
  try {
    // First verify the task belongs to the user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new Error("Task not found or access denied");
    }

    const subtask = await prisma.subtask.create({
      data: {
        title: subtaskData.title,
        description: subtaskData.description,
        completed: subtaskData.completed || false,
        taskId: taskId,
      },
    });

    return subtask;
  } catch (error) {
    throw new Error(`Error creating subtask: ${error.message}`);
  }
}

// Update subtask
export async function updateSubtask(id, updateData, userId) {
  try {
    // First verify the subtask belongs to a task owned by the user
    const subtask = await prisma.subtask.findFirst({
      where: {
        id,
        task: {
          userId,
        },
      },
      include: {
        task: true,
      },
    });

    if (!subtask) {
      throw new Error("Subtask not found or access denied");
    }
    const { id: _, taskId: __, task: ___, ...cleanData } = updateData;

    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: cleanData,
    });

    return updatedSubtask;
  } catch (error) {
    throw new Error(`Error updating subtask: ${error.message}`);
  }
}

// Delete subtask
export async function deleteSubtask(id, userId) {
  try {
    // First verify the subtask belongs to a task owned by the user
    const subtask = await prisma.subtask.findFirst({
      where: {
        id,
        task: {
          userId,
        },
      },
      include: {
        task: true,
      },
    });

    if (!subtask) {
      throw new Error("Subtask not found or access denied");
    }

    const deletedSubtask = await prisma.subtask.delete({
      where: { id },
    });

    return deletedSubtask;
  } catch (error) {
    throw new Error(`Error deleting subtask: ${error.message}`);
  }
}

// Get subtask by ID
export async function getSubtaskById(id, userId) {
  try {
    const subtask = await prisma.subtask.findFirst({
      where: {
        id,
        task: {
          userId,
        },
      },
      include: {
        task: true,
      },
    });

    if (!subtask) {
      throw new Error("Subtask not found or access denied");
    }

    return subtask;
  } catch (error) {
    throw new Error(`Error retrieving subtask: ${error.message}`);
  }
}

// Get all subtasks for a specific task
export async function getSubtasksByTaskId(taskId, userId) {
  try {
    // First verify the task belongs to the user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new Error("Task not found or access denied");
    }

    const subtasks = await prisma.subtask.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    });

    return subtasks;
  } catch (error) {
    throw new Error(`Error retrieving subtasks: ${error.message}`);
  }
}
// update user
export async function updateUser(userId, updateData) {
  try {
    const { id: _, createdAt: __, updatedAt: ___, ...cleanData } = updateData;

    if (cleanData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: cleanData.email },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new Error("Email already in use");
      }
    }

    if (cleanData.password) {
      cleanData.password = await bcrypt.hash(cleanData.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: cleanData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}

// Delete User
export async function deleteUser(userId) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return deletedUser;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
}