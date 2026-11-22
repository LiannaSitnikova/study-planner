import { httpClient } from '../api/httpClient';
import { authStorage } from '../utils/authStorage';
import type {
  ApiTodo,
  PaginatedTasksResult,
  Priority,
  Task,
  TodosApiResponse,
} from '../types/task';

interface TaskMetadata {
  description?: string;
  priority?: Priority;
  category?: string;
  createdBy?: string;
  createdAt?: string;
}

function toTask(dto: ApiTodo, meta?: TaskMetadata): Task {
  return {
    id: dto.id,
    title: dto.todo,
    description: meta?.description ?? '',
    completed: dto.completed,
    priority: meta?.priority ?? 'medium',
    category: meta?.category ?? 'General',
    createdBy: meta?.createdBy ?? `User #${dto.userId}`,
    createdAt: meta?.createdAt ?? new Date().toLocaleDateString('uk-UA'),
  };
}

export const taskRepository = {
  async getAll(limit = 10, skip = 0, signal?: AbortSignal): Promise<PaginatedTasksResult> {
    const data = await httpClient<TodosApiResponse>(`/todos?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      signal,
    });

    return {
      tasks: data.todos.map((dto) => toTask(dto)),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  },

  async getById(id: number, existingMeta?: TaskMetadata, signal?: AbortSignal): Promise<Task> {
    const dto = await httpClient<ApiTodo>(`/todos/${id}`, {
      method: 'GET',
      signal,
    });

    return toTask(dto, existingMeta);
  },

  async create(
    taskData: Pick<Task, 'title' | 'description' | 'category' | 'priority'>
  ): Promise<Task> {
    const currentUser = authStorage.getUser();

    const dto = await httpClient<ApiTodo>('/todos/add', {
      method: 'POST',
      body: JSON.stringify({
        todo: taskData.title,
        completed: false,
        userId: currentUser?.id ?? 1,
      }),
    });

    const created = toTask(dto, {
      description: taskData.description,
      priority: taskData.priority,
      category: taskData.category,
      createdBy: currentUser?.username ?? 'Authorized User',
      createdAt: new Date().toLocaleString('uk-UA'),
    });

    return {
      ...created,
      id: Date.now(),
    };
  },

  async update(id: number, updatedTask: Task): Promise<Task> {
    if (id > 254) {
      return updatedTask;
    }

    const dto = await httpClient<ApiTodo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        todo: updatedTask.title,
        completed: updatedTask.completed,
      }),
    });

    return toTask(dto, {
      description: updatedTask.description,
      priority: updatedTask.priority,
      category: updatedTask.category,
      createdBy: updatedTask.createdBy,
      createdAt: updatedTask.createdAt,
    });
  },

  async toggleCompleted(id: number, completed: boolean, existingTask: Task): Promise<Task> {
    if (id > 254) {
      return { ...existingTask, completed };
    }

    const dto = await httpClient<ApiTodo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });

    return toTask(dto, {
      description: existingTask.description,
      priority: existingTask.priority,
      category: existingTask.category,
      createdBy: existingTask.createdBy,
      createdAt: existingTask.createdAt,
    });
  },

  async delete(id: number): Promise<void> {
    if (id > 254) return;

    await httpClient<{ id: number; isDeleted: boolean }>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};