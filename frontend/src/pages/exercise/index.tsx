'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../../app/globals.css';

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  steps: string[];
  musclesWorked: string[];
  recommendedSetsReps: string;
  imageUrl: string;
  categoryId: string;
  category: Category;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/exercises');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Exercise[] = await response.json();
        setExercises(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gabim në ngarkimin e ushtrimeve');
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: '#111', 
          color: 'white', 
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '5px solid #333',
              borderTop: '5px solid #EE7838',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Header />
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: '#111', 
          color: 'white', 
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h2 style={{ color: '#ff4444', marginBottom: '1rem' }}>Error</h2>
            <p style={{ marginBottom: '1rem' }}>{error}</p>
            <button
              style={{
                backgroundColor: '#EE7838',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Empty state
  if (exercises.length === 0) {
    return (
      <div>
        <Header />
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: '#111', 
          color: 'white', 
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>There's no exercise</h2>
            <p>Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: '#111', color: 'white', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          Exercises for Every Goal
        </h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {exercises.map((exercise) => (
            <div key={exercise.id} style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            }}
            >
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
                onError={(e) => {
                  
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE2Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {exercise.name}
              </h2>
              <p style={{ color: '#ccc', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                Category: {exercise.category?.name || 'Uncategorized'}
              </p>
              <p style={{ 
                color: '#ccc', 
                marginBottom: '1rem', 
                fontSize: '0.9rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {exercise.description}
              </p>
              <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                <button
                  style={{
                    backgroundColor: '#EE7838',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d6642e';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#EE7838';
                  }}
                  onClick={() => setSelectedExercise(exercise)}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedExercise && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#fff',
            color: '#000',
            padding: '2rem',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '600px',
            position: 'relative',
            overflowY: 'auto',
            maxHeight: '90vh'
          }}>
            <button
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#333',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => setSelectedExercise(null)}
            >
              &times;
            </button>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem', paddingRight: '40px' }}>
              {selectedExercise.name}
            </h2>
            <img
              src={selectedExercise.imageUrl}
              alt={selectedExercise.name}
              style={{ 
                width: '100%', 
                height: '250px', 
                objectFit: 'cover', 
                borderRadius: '8px', 
                marginBottom: '1rem' 
              }}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE2Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
              }}
            />
            <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>{selectedExercise.description}</p>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                <strong>Category:</strong> {selectedExercise.category?.name || 'Uncategorized'}
              </p>
            </div>

            <h3 style={{ marginTop: '1rem', fontWeight: 'bold', color: '#333' }}>Muscles Worked:</h3>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              {selectedExercise.musclesWorked.map((muscle, index) => (
                <li key={index} style={{ marginBottom: '0.25rem' }}>{muscle}</li>
              ))}
            </ul>

            <h3 style={{ marginTop: '1rem', fontWeight: 'bold', color: '#333' }}>How to Perform:</h3>
            <ol style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              {selectedExercise.steps.map((step, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', lineHeight: '1.4' }}>{step}</li>
              ))}
            </ol>

            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '4px solid #EE7838'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>
                Recommended: {selectedExercise.recommendedSetsReps}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}