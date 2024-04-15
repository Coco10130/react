import { useState, useEffect, useRef } from "react";
import "../styles/Card.css";
import AxiosClient from "../AxiosClient";

function Card({ onCardCreate }) {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editableIndex, setEditableIndex] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const updatedNoteRefs = useRef({});
    const cursorPosition = useRef({});

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await AxiosClient.get("/showNote");
                setCards(response.data.notes);
            } catch (error) {
                console.error("Error fetching notes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const handleEdit = async (id, updatedBody) => {
        try {
            const response = await AxiosClient.put(`/updateNote/${id}`, {
                body: updatedBody,
            });
            const updatedNote = response.data;
            const updatedCards = cards.map((card) =>
                card.id === updatedNote.id ? updatedNote : card
            );
            setCards(updatedCards);
            setEditableIndex(null);
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const handleColorClick = async (color) => {
        console.log("Color clicked:", color);
        try {
            const response = await AxiosClient.post("/createNote", {
                body: "New Note",
                color: color,
            });
            console.log("New note created:", response.data);
            const newNote = response.data;

            setCards((c) => [...c, newNote]);
        } catch (error) {
            console.error("Error creating note:", error);
        }
    };

    const handleContentChange = (id, updatedBody) => {
        const updatedCards = cards.map((card) =>
            card.id === id ? { ...card, body: updatedBody } : card
        );
        setCards(updatedCards);
    };

    const setRef = (id, ref) => {
        updatedNoteRefs.current[id] = ref;
    };

    const handleInput = (e, id) => {
        cursorPosition.current[id] = {
            startOffset: window.getSelection().anchorOffset,
            endOffset: window.getSelection().focusOffset,
        };
    };

    const handleBlur = (e, id) => {
        handleEdit(id, e.target.textContent);
        cursorPosition.current[id] = {};
    };

    const handleEditButton = (index, id, body) => {
        if (editableIndex === index) {
            handleEdit(id, updatedNoteRefs.current[id].textContent);
            setIsEditable(!isEditable);
            setEditableIndex(null);
        } else {
            setEditableIndex(index);
        }
    };

    async function deleteNote(id) {
        try {
            await AxiosClient.delete(`/deleteNote/${id}`);
            setCards((c) => c.filter((cards) => cards.id !== id));
        } catch (e) {
            console.error("error deleting note: ", e);
        }
    }

    function returnDate(card) {
        return <p>{card.date}</p>;
    }

    function returnDeletebtn(card, index) {
        if (editableIndex === index) {
            return (
                <button
                    onClick={() => deleteNote(card.id)}
                    className="delete-note btn btn-outline-light"
                >
                    Delete
                </button>
            );
        } else {
            return null;
        }
    }

    return (
        <>
            <div className="note-container">
                <div className="row">
                    <div className="col-1 sidebar">
                        <div className="sidebar-container d-flex justify-content-center align-items-center flex-column">
                            <button
                                className="red"
                                value={"#ff0000cc"}
                                onClick={() => handleColorClick("#ff0000cc")}
                            ></button>

                            <button
                                className="blue"
                                value={"#4000ffcc"}
                                onClick={() => handleColorClick("#4000ffcc")}
                            ></button>

                            <button
                                className="green"
                                value={"#00ff1ecc"}
                                onClick={() => handleColorClick("#00ff1ecc")}
                            ></button>

                            <button
                                className="orange"
                                value={"#ffa500"}
                                onClick={() => handleColorClick("#ffa500")}
                            ></button>
                        </div>
                    </div>

                    <div className="col content-container">
                        <div className="row">
                            {isLoading ? (
                                <div className="loader-container">
                                    <div className="loader"></div>
                                    <div className="loader-text">
                                        Loading...
                                    </div>
                                </div>
                            ) : cards.length === 0 ? (
                                <p className="card-is-empty">Notes is empty</p>
                            ) : (
                                cards.map((card, index) => (
                                    <div className="col-4" key={card.id}>
                                        <div
                                            className="card-body mb-4"
                                            style={{
                                                padding: "20px",
                                                backgroundColor: card.color,
                                            }}
                                        >
                                            <div className="note-content">
                                                {editableIndex === index ? (
                                                    <p
                                                        className="card-text"
                                                        contentEditable={true}
                                                        suppressContentEditableWarning={
                                                            true
                                                        }
                                                        onInput={(e) =>
                                                            handleInput(
                                                                e,
                                                                card.id
                                                            )
                                                        }
                                                        onBlur={(e) =>
                                                            handleBlur(
                                                                e,
                                                                card.id
                                                            )
                                                        }
                                                        ref={(ref) =>
                                                            setRef(card.id, ref)
                                                        }
                                                    >
                                                        {card.body}
                                                    </p>
                                                ) : (
                                                    <p className="card-text">
                                                        {card.body.length > 100
                                                            ? `${card.body.slice(
                                                                  0,
                                                                  80
                                                              )}... (MAXIMUM OF 80 CHARACRTERS ONLY)`
                                                            : card.body}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="card-button d-flex justify-content-between align-items-center">
                                                <div className="card-date">
                                                    {isEditable
                                                        ? returnDeletebtn(
                                                              card,
                                                              index
                                                          )
                                                        : returnDate(card)}
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleEditButton(
                                                            index,
                                                            card.id,
                                                            card.body
                                                        )
                                                    }
                                                    className="save-btn btn btn-dark"
                                                >
                                                    {editableIndex === index
                                                        ? "✔"
                                                        : "🖋"}{" "}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Card;
