import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getFlashCardsByCourseAndUser, deleteFlashCard, getCourses } from "../services/api";
import CustomNavbar from "./app-custom/CustomNavbar";
import { Spinner } from "react-bootstrap";
import { FaRedo, FaArrowLeft } from "react-icons/fa";
import "./FlashCardGamePage.css";

const FlashCardGamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();
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
        const fetchedCards = await getFlashCardsByCourseAndUser(courseId);
        setCards(fetchedCards);
        // Try to get courseTitle from the first card if not already set
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Fetch course title if not available
  useEffect(() => {
    const fetchCourseTitle = async () => {
      if (!courseTitle && courseId) {
        try {
          const allCourses = await getCourses();
          const found = allCourses.find(c => String(c.id) === String(courseId));
          if (found) setCourseTitle(found.title);
        } catch (e) {
          // fallback: do nothing
        }
      }
    };
    fetchCourseTitle();
  }, [courseTitle, courseId]);

  const flipCard = (id) => {
    setCards(
        cards.map((card) =>
            card.id === id ? { ...card, flipped: !card.flipped } : card
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
    setCards(cards.map(card => ({ ...card, flipped: false })));
  };

  const handleBack = () => {
    // Use courseTitle from state, fallback to cards, then location, then courseId
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
      // Store the current card's title before deletion
      const lastCourseTitle = courseTitle || cards[0]?.courseTitle || location.state?.courseTitle || courseId || "";
      
      // First, update the UI to remove the card
      const newCards = cards.filter((card) => card.id !== id);
      setCards(newCards);
      
      // Then delete from backend
      await deleteFlashCard(id);

      // Update state based on whether it was the last card
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
      // If deletion fails, restore the cards
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

  // Show message if there are no flashcards
  if (!loading && cards.length === 0) {
    return (
      <>
        <CustomNavbar />
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
        <CustomNavbar />

        {!gameStarted ? (
            <div className="start-game-container">
              <div className="start-game-text">
                <h1>Welcome to Flash Cards Game!</h1>
                <button className="start-btn" onClick={() => setGameStarted(true)}>
                  Start Game
                </button>
              </div>
            </div>
        ) : (
            <div className={`flashcard-game-container fade-in ${showEndScreen ? 'has-end-screen' : ''}`}>
              <header className="hero-header">
                <div className="hero-title">
                  <h1>Flash Cards Game</h1>
                  <p>
                    Challenge your memory and boost your knowledge
                    <br />
                    with every card you flip.
                  </p>
                </div>
              </header>

              {/* Progress Bar & Card Counter */}
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
                                <div className="flashcard-header-align">
                                  <h3>{cards[currentIndex].courseTitle}</h3>
                                  <button
                                      className="delete-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCard(cards[currentIndex].id);
                                      }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <div className="flashcard-content">
                                <div className="flashcard-label question-label">Question</div>
                                <p>{cards[currentIndex].question}</p>
                                <div className="hint">Click to flip</div>
                              </div>
                            </div>

                            <div className="flashcard-back">
                              <div className="flashcard-header">
                                <h3>{cards[currentIndex].courseTitle}</h3>
                              </div>
                              <div className="flashcard-content">
                                <div className="flashcard-label answer-label">Answer</div>
                                <p>{cards[currentIndex].answer}</p>
                                <div className="hint">Click to flip back</div>
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
                      <h2>You've completed all flashcards!</h2>
                      <p>Would you like to review them again or go back?</p>
                      <div className="end-screen-buttons">
                        <button className="end-screen-button restart" onClick={handleRestart}>
                          <FaRedo /> Start Over
                        </button>
                        <button className="end-screen-button back" onClick={handleBack}>
                          <FaArrowLeft /> Back to Course
                        </button>
                        <button className="end-screen-button flashcard-gen" onClick={handleGoToFlashcards}>
                          Go to Flashcard generation
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

