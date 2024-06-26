<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoListController;
use App\Http\Controllers\NotesController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/logout', [AuthController::class, 'logout']);

    Route::post('/addTodo', [TodoListController::class, 'addTodo']);
    Route::get('/showTodo', [TodoListController::class, 'showTodo']);
    Route::delete('/deleteTodo/{id}', [TodoListController::class, 'deleteTodo']);
    Route::put('/updateTodoOrder/{id}', [TodoListController::class, 'updateTodoOrder']);

    Route::put('/updateNote/{id}' , [NotesController::class, 'updateNote']);
    Route::get('/showNote' , [NotesController::class, 'showNote']);
    Route::post('/createNote', [NotesController::class, 'createNote']);
    Route::delete('/deleteNote/{id}', [NotesController::class, 'deleteNote']);
});
