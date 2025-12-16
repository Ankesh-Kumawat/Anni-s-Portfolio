import { TodoItem } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { useState } from "react";

interface ChecklistEditorProps {
    todos: TodoItem[];
    setTodos: (todos: TodoItem[]) => void;
}

export function ChecklistEditor({ todos, setTodos }: ChecklistEditorProps) {
    const [newTodoText, setNewTodoText] = useState("");

    const addTodo = () => {
        if (newTodoText.trim()) {
            setTodos([
                ...todos,
                {
                    id: `todo-${Date.now()}`,
                    text: newTodoText,
                    completed: false
                }
            ]);
            setNewTodoText("");
        }
    };

    const toggleTodo = (id: string) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const updateTodoText = (id: string, text: string) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, text } : todo
            )
        );
    };

    const completedCount = todos.filter(t => t.completed).length;

    return (
        <div className="p-6 space-y-4">
            {/* Progress */}
            {todos.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                            {completedCount} / {todos.length}
                        </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${(completedCount / todos.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Add New Todo */}
            <div className="flex gap-2">
                <Input
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Add a new task..."
                    className="flex-1"
                />
                <Button onClick={addTodo} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                </Button>
            </div>

            {/* Todo List */}
            <div className="space-y-2">
                {todos.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <ListChecks className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No tasks yet. Add one above!</p>
                    </div>
                ) : (
                    todos.map((todo) => (
                        <div
                            key={todo.id}
                            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors"
                        >
                            <Checkbox
                                checked={todo.completed}
                                onCheckedChange={() => toggleTodo(todo.id)}
                            />
                            <Input
                                value={todo.text}
                                onChange={(e) => updateTodoText(todo.id, e.target.value)}
                                className={`flex-1 border-none bg-transparent focus-visible:ring-0 h-auto p-0 ${todo.completed ? 'line-through text-muted-foreground' : ''
                                    }`}
                            />
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
