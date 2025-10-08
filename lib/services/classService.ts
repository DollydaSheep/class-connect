import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Class {
  id?: string;
  name: string;
  instructor: string;
  classCode: string;
  createdAt?: Timestamp;
}

const CLASSES_COLLECTION = 'Classes';

// Add a new class
export const addClass = async (classData: {
  name: string;
  instructor: string;
  classCode: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, CLASSES_COLLECTION), {
      name: classData.name,
      instructor: classData.instructor,
      classCode: classData.classCode,
      createdAt: serverTimestamp()
    });
    return { 
      id: docRef.id, 
      ...classData,
      createdAt: serverTimestamp(), 
    };
  } catch (error) {
    console.error('Error adding class:', error);
    throw error;
  }
};

// Get all classes
export const getClasses = async (): Promise<Class[]> => {
  try {
    const q = query(collection(db, CLASSES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Class));
  } catch (error) {
    console.error('Error getting classes:', error);
    throw error;
  }
};

// Update a class
export const updateClass = async (classId: string, updates: Partial<Class>) => {
  try {
    const classRef = doc(db, CLASSES_COLLECTION, classId);
    await updateDoc(classRef, updates);
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

// Delete a class
export const deleteClass = async (classId: string) => {
  try {
    await deleteDoc(doc(db, CLASSES_COLLECTION, classId));
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};

// Subscribe to real-time updates
export const subscribeToClasses = (
  callback: (classes: Class[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(collection(db, CLASSES_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const classes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Class));
      callback(classes);
    },
    (error) => {
      console.error('Error in subscription:', error);
      if (onError) onError(error);
    }
  );
};