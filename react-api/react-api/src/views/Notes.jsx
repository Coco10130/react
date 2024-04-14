import { useState, useEffect } from "react";
import "../styles/Notes.css";
import Card from "../components/Card";
import AxiosClient from "../AxiosClient";

function Notes() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        document.title = `Notes`;
        const fetchNotes = async () => {
            try {
                const response = await AxiosClient.get("/showNote");
                const fetchedNotes = response.data.notes;
                setCards(fetchedNotes);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };

        fetchNotes();
    }, []);

    const handleCardCreate = (newCard) => {
        setCards([...cards, newCard]);
    };

    return (
        <>
            <div
                className="container-fluid d-flex align-items-center justify-content-center flex-column mb-5 mt-5"
                style={{ width: "80vw" }}
            >
                <div className="row">
                    <div className="col">
                        <h2 className="notes-title m-5">Notes</h2>
                    </div>
                </div>

                <div className="row cards-container">
                    <div className="col-4">
                        <Card onCardCreate={handleCardCreate} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Notes;
