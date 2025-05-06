// src/app/Trainers/page.tsx (or index.tsx depending on your structure)
import React from 'react';
import T1 from '@/assets/images/john.jpg'; // adjust path if needed

interface Trainer {
  id: number;
  name: string;
  image: string;
  description: string;
}

const trainers: Trainer[] = [
  {
    id: 1,
    name: 'John Smith',
    image: T1.src,
    description: 'Certified personal trainer with 10+ years of experience in strength training and nutrition.',
  },
  {
    id: 2,
    name: 'Emily Johnson',
    image: T1.src,
    description: 'Yoga and flexibility expert helping clients achieve balance and mindfulness.',
  },
  {
    id: 3,
    name: 'Michael Brown',
    image: T1.src,
    description: 'CrossFit coach known for high-intensity training programs.',
  },
  {
    id: 4,
    name: 'Sarah Davis',
    image: T1.src,
    description: 'Specialist in weight loss and sustainable fitness habits.',
  },
  {
    id: 5,
    name: 'David Wilson',
    image: T1.src,
    description: 'Athletic performance coach working with competitive athletes.',
  },
  {
    id: 6,
    name: 'Laura Garcia',
    image: T1.src,
    description: 'Pilates instructor focused on core strength and injury prevention.',
  },
  {
    id: 7,
    name: 'Chris Martinez',
    image: T1.src,
    description: 'Functional fitness and mobility expert.',
  },
  {
    id: 8,
    name: 'Jessica Lee',
    image: T1.src,
    description: 'Group fitness trainer with a passion for dance-based workouts.',
  },
  {
    id: 9,
    name: 'Daniel Thompson',
    image: T1.src,
    description: 'Kickboxing and martial arts trainer with military background.',
  },
  {
    id: 10,
    name: 'Ashley White',
    image: T1.src,
    description: 'Nutrition coach and strength trainer focused on women’s health.',
  },
];

const TrainersPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111', color: 'white', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        Meet Our Trainers
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {trainers.map((trainer) => (
          <div key={trainer.id} style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            <img
              src={trainer.image}
              alt={trainer.name}
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '1rem',
              }}
            />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{trainer.name}</h2>
            <p style={{ color: '#ccc' }}>{trainer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainersPage;
