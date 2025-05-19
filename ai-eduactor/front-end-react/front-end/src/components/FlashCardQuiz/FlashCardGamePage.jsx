import React, {useState, useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    getFlashCardsByCourseAndUser,
    deleteFlashCard,
    getFlashCardsByCourse,
    getCourses,
    getFlashCardsForAttachment
} from "../../services/api";
import CustomNavbar from "../app-custom/CustomNavbar";
import {FaRedo, FaArrowLeft} from "react-icons/fa";
import "./FlashCardGamePage.css";

const FlashCardGamePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {courseId} = useParams();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showEndScreen, setShowEndScreen] = useState(false);
    const [courseTitle, setCourseTitle] = useState(location.state?.courseTitle || "");

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                setLoading(true);
                let fetchedCards = [];
                if (location.state.default) {
                    fetchedCards = await getFlashCardsByCourse(courseId);
                } else if (!location.state.isIndividual) {
                    fetchedCards = await getFlashCardsByCourseAndUser(courseId);
                } else {
                    const attachmentId = location.state.attId;
                    fetchedCards = await getFlashCardsForAttachment(attachmentId);
                }
                setCards(fetchedCards);
                if (fetchedCards.length > 0 && !courseTitle) {
                    setCourseTitle(fetchedCards[0].courseTitle);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching flashcards:", error);
                setLoading(false);
            }
        };

        fetchFlashcards();
    }, [courseId]);

    useEffect(() => {
        const fetchCourseTitle = async () => {
            if (!courseTitle && courseId) {
                try {
                    const allCourses = await getCourses();
                    const found = allCourses.find(c => String(c.id) === String(courseId));
                    if (found) setCourseTitle(found.title);
                } catch (e) {

                }
            }
        };
        fetchCourseTitle();
    }, [courseTitle, courseId]);

    const flipCard = (id) => {
        setCards(
            cards.map((card) =>
                card.id === id ? {...card, flipped: !card.flipped} : card
            )
        );
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowEndScreen(true);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setShowEndScreen(false);
        setCards(cards.map(card => ({...card, flipped: false})));
    };

    const handleBack = () => {
        const title =
            courseTitle ||
            cards[0]?.courseTitle ||
            location.state?.courseTitle ||
            courseId ||
            "";
        navigate(`/course/${title}`);
    };

    const handleGoToFlashcards = () => {
        navigate("/flashcards");
    };

    const deleteCard = async (id) => {
        if (!window.confirm("Are you sure you want to delete this flashcard?")) {
            return;
        }

        try {
            const lastCourseTitle = courseTitle || cards[0]?.courseTitle || location.state?.courseTitle || courseId || "";

            const newCards = cards.filter((card) => card.id !== id);
            setCards(newCards);

            await deleteFlashCard(id);

            if (newCards.length === 0) {
                setCurrentIndex(0);
                setShowEndScreen(true);
                setCourseTitle(lastCourseTitle);
            } else {
                const newIndex = currentIndex >= newCards.length ? newCards.length - 1 : currentIndex;
                setCurrentIndex(newIndex);
                setShowEndScreen(false);
            }
        } catch (error) {
            console.error("Error deleting flashcard:", error);
            const fetchedCards = await getFlashCardsByCourseAndUser(courseId);
            setCards(fetchedCards);
            alert("Failed to delete flashcard.");
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner-container">
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p>Loading flashcards...</p>
            </div>
        );
    }

    if (!loading && cards.length === 0) {
        return (
            <>
                <CustomNavbar/>
                <div className="no-flashcards-container">
                    <div className="no-flashcards-content">
                        <h2>You do not have any flashcards yet, please generate some.</h2>
                        <div className="no-flashcards-buttons">
                            <button
                                className="no-flashcards-btn back"
                                onClick={handleBack}
                            >
                                Back to Course
                            </button>
                            <button
                                className="no-flashcards-btn flashcard-gen"
                                onClick={() => navigate("/flashcards")}
                            >
                                Go to Flashcard generation
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <CustomNavbar/>

            {!gameStarted ? (
                <div className="flashcard-welcome-container">
                    <div className="flashcard-welcome-content improved-welcome">
                        <h1 className="welcome-main-title">
                            Welcome to Flash Cards Quiz
                        </h1>
                        {courseTitle && (
                            <h2 className="welcome-course-title">
                                for <span className="flashcard-welcome-course">{courseTitle}</span>
                            </h2>
                        )}
                        <p className="flashcard-welcome-desc improved-welcome-desc">
                            Ready to test your knowledge? Flip through the cards to reveal answers and track your
                            progress.
                            <br/>
                            Let's begin your learning journey!
                        </p>
                        <button className="start-btn welcome-start-btn" onClick={() => setGameStarted(true)}>
                            Start Quiz
                        </button>
                    </div>
                </div>
            ) : (
                <div className={`flashcard-game-container fade-in ${showEndScreen ? 'has-end-screen' : ''}`}>
                    <header className="hero-header">
                        <div className="hero-title">
                            <h1>Flash Cards Game</h1>
                            <h2 className="hero-subtitle">for {courseTitle}</h2>
                            <p>Challenge your memory and boost your knowledge with every card you flip.</p>
                        </div>
                    </header>

                    {!loading && cards.length > 0 && !showEndScreen && (
                        <div className="quiz-progress-bar-container">
                            <div className="quiz-progress-bar">
                                <div
                                    className="quiz-progress-bar-fill"
                                    style={{
                                        width: `${((currentIndex + 1) / cards.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                            <div className="quiz-card-counter">
                                Card {currentIndex + 1} of {cards.length}
                            </div>
                        </div>
                    )}

                    {!loading && cards.length > 0 && (
                        <div className="flashcard-deck">
                            <div className="flashcard-container active">
                                {cards[currentIndex] && (
                                    <div
                                        className={`flashcard ${cards[currentIndex]?.flipped ? "flipped" : ""}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            flipCard(cards[currentIndex].id);
                                        }}
                                    >
                                        <div className="flashcard-front">
                                            <div className="flashcard-header">
                                                <div className="ai-flashcard-header-align">
                                                    <div className="ai-flashcard-label ai-flashcard-label-question">
                                                        Question {currentIndex + 1}
                                                    </div>
                                                    <span className="ai-flashcard-hint">Click to reveal answer</span>
                                                </div>
                                            </div>
                                            <div className="flashcard-content">
                                                <p className={`
                                  ${cards[currentIndex].question.length > 200 ? 'very-long-text' :
                                                    cards[currentIndex].question.length > 100 ? 'long-text' : ''
                                                }`}
                                                >
                                                    {cards[currentIndex].question}
                                                </p>
                                                <button
                                                    className="ai-flashcard-delete-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteCard(cards[currentIndex].id);
                                                    }}
                                                >
                                                    Delete Card
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flashcard-back">
                                            <div className="flashcard-header">
                                                <div className="ai-flashcard-header-align">
                                                    <div className="ai-flashcard-label ai-flashcard-label-answer">
                                                        Answer {currentIndex + 1}
                                                    </div>
                                                    <span className="ai-flashcard-hint">Click to go back</span>
                                                </div>
                                            </div>
                                            <div className="flashcard-content">
                                                <p className={`
                                  ${cards[currentIndex].answer.length > 200 ? 'very-long-text' :
                                                    cards[currentIndex].answer.length > 100 ? 'long-text' : ''
                                                }`}
                                                >
                                                    {cards[currentIndex].answer}
                                                </p>
                                                <button
                                                    className="ai-flashcard-delete-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteCard(cards[currentIndex].id);
                                                    }}
                                                >
                                                    Delete Card
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {cards.length > 0 && !showEndScreen && (
                        <div className="flashcard-controls">
                            {currentIndex > 0 && (
                                <button className="control-btn prev-btn" onClick={prevCard}>
                                    Previous Card
                                </button>
                            )}
                            <button className="control-btn next-btn" onClick={nextCard}>
                                Next Card
                            </button>
                        </div>
                    )}

                    {showEndScreen && (
                        <div className="end-screen-container">
                            <div className="end-screen-content">
                                <div className="end-screen-icon">🎉</div>
                                <h2>Congratulations!</h2>
                                <p>You've completed reviewing all {cards.length} flashcards for {courseTitle}.</p>
                                <div className="end-screen-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{cards.length}</span>
                                        <span className="stat-label">Cards Reviewed</span>
                                    </div>
                                </div>
                                <p className="end-screen-question">What would you like to do next?</p>
                                <div className="end-screen-buttons">
                                    <button className="end-screen-button restart" onClick={handleRestart}>
                                        <FaRedo/> Review Again
                                    </button>
                                    <button className="end-screen-button back" onClick={handleBack}>
                                        <FaArrowLeft/> Back to Course
                                    </button>
                                    <button className="end-screen-button flashcard-gen" onClick={handleGoToFlashcards}>
                                        Create More Cards
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FlashCardGamePage;
