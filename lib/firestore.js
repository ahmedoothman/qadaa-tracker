import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';

// User data operations
export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    } else {
      return { data: null, error: null };
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const setUserData = async (userId, data) => {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const updateUserData = async (userId, updates) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Initialize user document on first sign-up
export const initializeUser = async (userId, email, displayName) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        email,
        displayName,
        salah: {
          totalDays: 0,
          completedDays: 0,
          startDate: null,
          endDate: null,
          menstrualDaysPerMonth: 0,
        },
        siyam: {
          totalDays: 0,
          completedDays: 0,
          ramadans: [],
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Analytics
export const trackVisit = async () => {
  try {
    const statsRef = doc(db, 'siteStats', 'visitors');
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
      await updateDoc(statsRef, {
        totalVisits: increment(1),
        lastVisit: serverTimestamp(),
      });
    } else {
      await setDoc(statsRef, {
        totalVisits: 1,
        lastVisit: serverTimestamp(),
      });
    }
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Salah data operations
export const updateSalahData = async (userId, salahData) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      salah: salahData,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Siyam data operations
export const updateSiyamData = async (userId, siyamData) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      siyam: siyamData,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
