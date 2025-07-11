'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import "../../app/globals.css";

interface Trainer {
  id: number;
  name: string;
  age: number;
  category: string;
  image: string;
  description: string;
  details: string;
}

const trainers: Trainer[] = [
  {
    id: 1,
    name: 'John Smith',
    age: 35,
    category: 'Bench Press',
    image: '/images/john.jpg',
    description: 'Certified personal trainer with 10+ years of experience in strength training and nutrition.',
    details: 'John specializes in bench press techniques, progressive overload plans, and strength-based routines for all levels.',
  },
  {
    id: 2,
    name: 'Emily Johnson',
    age: 29,
    category: 'Bench Press',
    image: '/images/t3.jpg',
    description: 'Yoga and flexibility expert helping clients achieve balance and mindfulness.',
    details: 'Emily also incorporates bench press training to develop strength alongside flexibility practices.',
  },
  {
    id: 3,
    name: 'Michael Brown',
    age: 40,
    category: 'Bench Press',
    image: '/images/t5.jpg',
    description: 'CrossFit coach known for high-intensity training programs.',
    details: 'Michael uses heavy bench press in CrossFit routines for building explosive upper-body strength.',
  },
  {
    id: 4,
    name: 'Sarah Davis',
    age: 33,
    category: 'HIIT',
    image: '/images/t6.jpg',
    description: 'Specialist in weight loss and sustainable fitness habits.',
    details: 'Sarah’s HIIT sessions are effective for fat burning and improving cardiovascular health.',
  },
  {
    id: 5,
    name: 'David Wilson',
    age: 38,
    category: 'HIIT',
    image: '/images/t10.jpg',
    description: 'Athletic performance coach working with competitive athletes.',
    details: 'David trains athletes using high-intensity intervals to boost endurance and agility.',
  },
  {
    id: 6,
    name: 'Laura Garcia',
    age: 31,
    category: 'HIIT',
    image: '/images/t9.jpg',
    description: 'Pilates instructor focused on core strength and injury prevention.',
    details: 'Laura blends HIIT with Pilates to enhance both strength and core stability.',
  },
  {
    id: 7,
    name: 'Chris Martinez',
    age: 36,
    category: 'Yoga',
    image: '/images/t7.jpg',
    description: 'Functional fitness and mobility expert.',
    details: 'Chris leads yoga sessions that improve flexibility, reduce stress, and aid recovery.',
  },
  {
    id: 8,
    name: 'Thomas Lee',
    age: 30,
    category: 'Yoga',
    image: '/images/t2.jpg',
    description: 'Group fitness trainer with a passion for dance-based workouts.',
    details: 'Thomas adds yoga flows to his group routines to improve balance and body awareness.',
  },
  {
    id: 9,
    name: 'Daniel Thompson',
    age: 41,
    category: 'Yoga',
    image: '/images/t8.jpg',
    description: 'Kickboxing and martial arts trainer with military background.',
    details: 'Daniel uses yoga for recovery and flexibility, especially for fighters.',
  },
  {
    id: 10,
    name: 'Ashley White',
    age: 28,
    category: 'Beginner',
    image: '/images/t4.jpg',
    description: 'Nutrition coach and strength trainer focused on women’s health.',
    details: 'Ashley guides beginners through safe, effective strength training and nutritional planning.',
  },
  {
    id: 11,
    name: 'Greg Simmons',
    age: 45,
    category: 'Beginner',
    image: '/images/t11.jpg',
    description: 'Beginner-focused trainer with emphasis on form and consistency.',
    details: 'Greg helps newcomers build confidence and correct form from day one.',
  },
  {
    id: 12,
    name: 'Nina Patel',
    age: 27,
    category: 'Beginner',
    image: '/images/t12.jpg',
    description: 'Supportive coach for beginners looking to gain confidence.',
    details: 'Nina specializes in coaching through basic exercises and building a foundation for long-term success.',
  },
];

const TrainersPage: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  return (
    <div>
      <Header />
    <div style={{ minHeight: '100vh', backgroundColor: '#111', color: 'white', padding: '2rem', marginTop: '100px' }}>
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
              <Image
                src={trainer.image}
                alt={trainer.name}
                width={300}
                height={250}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{trainer.name}</h2>
              <p style={{ color: '#ccc', margin: '0.25rem 0' }}>Age: {trainer.age}</p>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>Category: {trainer.category}</p>
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
                  onClick={() => setSelectedTrainer(trainer)}
                >
                  Choose Trainer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedTrainer && (
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
            maxWidth: '500px',
            position: 'relative'
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
              onClick={() => setSelectedTrainer(null)}
            >
              ×
            </button>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>{selectedTrainer.name}</h2>
            <Image
              src={selectedTrainer.image}
              alt={selectedTrainer.name}
              width={500}
              height={250}
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
            <p style={{ fontWeight: 500 }}>{selectedTrainer.description}</p>
            <p style={{ marginTop: '1rem' }}>{selectedTrainer.details}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TrainersPage;