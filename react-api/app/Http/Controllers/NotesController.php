<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notes;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;

class NotesController extends Controller
{
    public function updateNote(Request $request, $id)
    {
        $user = Auth::user();

        if ($user) {
            $validatedData = $request->validate([
                'body' => 'required|max:200',
            ]);

            $note = Notes::findOrFail($id);
            $note->body = $validatedData['body'];
            $note->save();

            return response()->json($note, 200);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }

    public function showNote(Request $request)
    {
        $user = Auth::user();
    
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        $notes = Notes::where('user_id', $user->id)
            ->get()
            ->map(function ($note) {
                return [
                    'id' => $note->id,
                    'body' => $note->body,
                    'color' => $note->color,
                    'date' => $note->created_at->format('F j, Y'),
                ];
            });
    
        return response()->json(['notes' => $notes], 200);
    }
    

    public function createNote(Request $request)
    {
        $user = Auth::user();
    
        if ($user) {
            $validatedData = $request->validate([
                'body' => 'required|max:100',
                'color' => 'required',
            ]);
    
            $note = new Notes();
            $note->user_id = $user->id;
            $note->body = $validatedData['body'];
            $note->color = $validatedData['color'];
            $note->save();
    
            // Include the date in the response
            $noteData = [
                'id' => $note->id,
                'body' => $note->body,
                'color' => $note->color,
                'date' => $note->created_at->format('F j, Y')
            ];
    
            return response()->json($noteData, 201);
        }
    
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    public function deleteNote(Request $request, $id) {
        $note = Notes::find($id);

        if (!$note) {
            return response()->json(['error' => 'Note not found'], 404);
        }

        if($note->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully'], 200);

    }
    
}
