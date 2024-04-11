<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\TodoList;

class TodoListController extends Controller
{
    public function addTodo(Request $request) {
        $validatedData = $request->validate([
            'todo' => 'required'
        ]);

        $todo = TodoList::create([
            'todo' => $validatedData['todo'],
            'user_id' => Auth::user()->id
        ]);

        return response()->json(['todo' => $todo], 201);
    }

    public function showTodo() {
        $userId = Auth::id();
        
        $todos = TodoList::where('user_id', $userId)->get();
        
        return response()->json($todos, 200);
    }

    public function deleteTodo($id) {
        $todo = TodoList::find($id);

        if (!$todo) {
            return response()->json(['error' => 'Todo not found'], 404);
        }

        if ($todo->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully'], 200);
    }

    public function updateTodoOrder(Request $request, $id) {
        $validatedData = $request->validate([
            'order' => 'required|integer',
        ]);

        $todo = TodoList::find($id);

        if (!$todo) {
            return response()->json(['error' => 'Todo not found'], 404);
        }

        if ($todo->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $todo->order = $validatedData['order'];
        $todo->save();

        return response()->json(['message' => 'Todo order updated successfully'], 200);
    }
}
