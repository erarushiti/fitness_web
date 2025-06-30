'use client';
import React, { useState } from 'react';
import e1 from '@/assets/images/e1.jpg';
import e2 from '@/assets/images/e2.jpg';
import e3 from '@/assets/images/e3.jpg';
import e4 from '@/assets/images/e4.jpg';
import e5 from '@/assets/images/e5.jpg';
import e6 from '@/assets/images/e6.jpg';
import e7 from '@/assets/images/e7.jpg';
import e8 from '@/assets/images/e8.jpg';
import e9 from '@/assets/images/e9.jpg';
import e10 from '@/assets/images/e10.jpg';
import e11 from '@/assets/images/e11.jpg';
import e12 from '@/assets/images/e12.jpg';
import e13 from '@/assets/images/e13.jpg';
import e14 from '@/assets/images/e14.jpg';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../../app/globals.css';

interface Exercise {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  steps: string[];
  musclesWorked: string[];
  recommendedSetsReps: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    name: 'Bench Press',
    category: 'Strength Training',
    image: e1.src,
    description: 'Targets the chest, shoulders, and triceps.',
    musclesWorked: ['Chest', 'Shoulders', 'Triceps'],
    steps: [
      'Lie flat on the bench with feet firmly on the ground.',
      'Grip the bar slightly wider than shoulder-width.',
      'Lower the bar slowly to the mid-chest.',
      'Push the bar upward until arms are extended.'
    ],
    recommendedSetsReps: '3–4 sets of 8–10 reps'
  },
  {
    id: 2,
    name: 'Squats',
    category: 'Strength Training',
    image: e2.src,
    description: 'Strengthens the legs, glutes, and core.',
    musclesWorked: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    steps: [
      'Stand with feet shoulder-width apart.',
      'Lower your hips as if sitting back into a chair.',
      'Keep your chest up and knees aligned.',
      'Push through your heels to return to standing.'
    ],
    recommendedSetsReps: '3–4 sets of 10–12 reps'
  },
  {
    id: 3,
    name: 'Deadlifts',
    category: 'Strength Training',
    image: e3.src,
    description: 'A compound lift that targets the back and legs.',
    musclesWorked: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
    steps: [
      'Stand with feet hip-width apart, barbell over mid-foot.',
      'Grip the bar, keep your back straight.',
      'Lift by extending hips and knees simultaneously.',
      'Lower the bar in a controlled motion.'
    ],
    recommendedSetsReps: '3–5 sets of 5–8 reps'
  },
  {
    id: 4,
    name: 'Push-ups',
    category: 'Bodyweight Exercises',
    image: e6.src,
    description: 'Upper body bodyweight movement for chest and arms.',
    musclesWorked: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    steps: [
      'Start in plank position, hands shoulder-width apart.',
      'Lower your body until your chest nearly touches the floor.',
      'Push back to starting position while keeping your core tight.'
    ],
    recommendedSetsReps: '3 sets of 15–20 reps'
  },
  {
    id: 5,
    name: 'Plank',
    category: 'Core Workouts',
    image: e7.src,
    description: 'Core stabilization exercise.',
    musclesWorked: ['Abdominals', 'Lower Back', 'Shoulders'],
    steps: [
      'Start in forearm plank position.',
      'Keep your back flat and core engaged.',
      'Hold position for desired time.'
    ],
    recommendedSetsReps: '3 sets of 30–60 seconds'
  },
  {
    id: 6,
    name: 'Lunges',
    category: 'Leg Workouts',
    image: e8.src,
    description: 'Strengthens lower body muscles.',
    musclesWorked: ['Glutes', 'Quads', 'Hamstrings'],
    steps: [
      'Stand tall, step forward with one foot.',
      'Lower your hips until both knees are bent at 90 degrees.',
      'Push back up and return to start.'
    ],
    recommendedSetsReps: '3 sets of 10 reps per leg'
  },
  {
    id: 7,
    name: 'Pull-ups',
    category: 'Upper Body Workouts',
    image: e11.src,
    description: 'Strengthens back and arms using bodyweight.',
    musclesWorked: ['Lats', 'Biceps', 'Shoulders'],
    steps: [
      'Grip the bar with palms facing away.',
      'Pull your body upward until chin is above the bar.',
      'Lower yourself with control.'
    ],
    recommendedSetsReps: '3 sets of max reps'
  },
  {
    id: 8,
    name: 'Bicep Curls',
    category: 'Strength Training',
    image: e10.src,
    description: 'Isolation movement for arm development.',
    musclesWorked: ['Biceps'],
    steps: [
      'Hold dumbbells at your sides with palms facing forward.',
      'Curl the weights upward while keeping elbows stationary.',
      'Lower back down slowly.'
    ],
    recommendedSetsReps: '3–4 sets of 10–12 reps'
  },
  {
    id: 9,
    name: 'Leg Press',
    category: 'Leg Workouts',
    image: e9.src,
    description: 'Targets the lower body with resistance.',
    musclesWorked: ['Quads', 'Glutes', 'Hamstrings'],
    steps: [
      'Sit in the leg press machine with feet on the platform.',
      'Lower the platform until knees form 90-degree angles.',
      'Push the weight back to the starting position.'
    ],
    recommendedSetsReps: '3–4 sets of 10 reps'
  },
  {
    id: 10,
    name: 'Tricep Dips',
    category: 'Upper Body Workouts',
    image: e12.src,
    description: 'Uses bodyweight to strengthen arms.',
    musclesWorked: ['Triceps', 'Shoulders', 'Chest'],
    steps: [
      'Place hands behind you on a bench or chair.',
      'Lower your body by bending the elbows.',
      'Push back up to straighten arms.'
    ],
    recommendedSetsReps: '3 sets of 10–15 reps'
  },
  {
    id: 11,
    name: 'Burpees',
    category: 'Cardio Workouts',
    image: e13.src,
    description: 'High-intensity full-body cardio move.',
    musclesWorked: ['Full Body', 'Core', 'Legs', 'Arms'],
    steps: [
      'Start standing, drop into a squat.',
      'Kick your feet back into a plank.',
      'Return feet to squat and jump up.'
    ],
    recommendedSetsReps: '3 sets of 10–15 reps'
  },
  {
    id: 12,
    name: 'Mountain Climbers',
    category: 'Core and Cardio',
    image: e14.src,
    description: 'Combines core work with cardio.',
    musclesWorked: ['Core', 'Shoulders', 'Legs'],
    steps: [
      'Start in plank position.',
      'Drive one knee toward your chest.',
      'Alternate legs quickly like running in place.'
    ],
    recommendedSetsReps: '3 sets of 30 seconds'
  }
];

const ExercisesPage: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              <img
                src={exercise.image}
                alt={exercise.name}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{exercise.name}</h2>
              <p style={{ color: '#ccc', margin: '0.25rem 0' }}>Category: {exercise.category}</p>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>{exercise.description}</p>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                  style={{
                    backgroundColor: '#EE7838',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            color: '#000',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
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
                color: '#333'
              }}
              onClick={() => setSelectedExercise(null)}
            >
              &times;
            </button>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>{selectedExercise.name}</h2>
            <img
              src={selectedExercise.image}
              alt={selectedExercise.name}
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
            <p>{selectedExercise.description}</p>

            <h3 style={{ marginTop: '1rem', fontWeight: 'bold' }}>Muscles Worked:</h3>
            <ul>
              {selectedExercise.musclesWorked.map((muscle, index) => (
                <li key={index}>{muscle}</li>
              ))}
            </ul>

            <h3 style={{ marginTop: '1rem', fontWeight: 'bold' }}>How to Perform:</h3>
            <ol>
              {selectedExercise.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>

            <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
              <strong>Recommended:</strong> {selectedExercise.recommendedSetsReps}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ExercisesPage;  