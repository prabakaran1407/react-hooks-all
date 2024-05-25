import React from 'react';
import {
  useRef,
  useState,
  experimental_useOptimistic as useOptimistic,
} from 'react';

type Todo = {
  id: string;
  title: string;
};

type OptimisticTodo = Todo & {
  pending?: boolean;
};

type TodoListProps = {
  initialTodos: Todo[];
};

export function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos);
  const inputRef = useRef(null);

  async function onSubmit(e: any) {
    e.preventDefault();

    if (inputRef.current == null) return;

    const optimisticTodo = {
      id: crypto.randomUUID(),
      title: inputRef.current.value,
    };
    setOptimisticTodos((prev) => [...prev, optimisticTodo]);
    const newTodo = await createTodo(inputRef.current.value);
    setTodos((prev) => [...prev, newTodo]);
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>Title</label>
        <br />
        <input ref={inputRef} required />
        <br />
        <button>Create</button>
      </form>
    </>
  );
}

function createTodo(title: string) {
  return wait({ id: crypto.randomUUID(), title }, 1000);
}

function wait<T>(value: T, duration: number) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), duration);
  });
}
