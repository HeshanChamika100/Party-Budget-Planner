import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  writeBatch,
} from 'firebase/firestore';
import { defaultItems, defaultPeople } from '../data/defaultData';

const firebaseConfig = {
  apiKey: 'AIzaSyAX4WcCzTvUCTxAOaRzsjz1t5EhgbyhBYk',
  authDomain: 'party-budget-planner.firebaseapp.com',
  projectId: 'party-budget-planner',
  storageBucket: 'party-budget-planner.firebasestorage.app',
  messagingSenderId: '869463100762',
  appId: '1:869463100762:web:09dae61e5713fb76c07763',
  measurementId: 'G-85G2FLJ5KE',
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

let analyticsPromise = null;

export const initializeFirebaseAnalytics = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => {
        if (!supported) {
          return null;
        }

        return getAnalytics(app);
      })
      .catch(() => null);
  }

  return analyticsPromise;
};

const itemsCollection = collection(db, 'partyItems');
const peopleCollection = collection(db, 'partyPeople');

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeItem = (snapshot, fallbackOrder = 0) => {
  const data = snapshot.data();

  return {
    _id: snapshot.id,
    name: data.name ?? '',
    unitPrice: toNumber(data.unitPrice),
    quantity: toNumber(data.quantity, 1),
    isAlcoholic: Boolean(data.isAlcoholic),
    order: toNumber(data.order, fallbackOrder),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

const normalizePerson = (snapshot, fallbackOrder = 0) => {
  const data = snapshot.data();

  return {
    _id: snapshot.id,
    name: data.name ?? '',
    isAlcoholic: Boolean(data.isAlcoholic),
    order: toNumber(data.order, fallbackOrder),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

const sortByOrder = (left, right) => {
  const leftOrder = toNumber(left.order);
  const rightOrder = toNumber(right.order);

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return (left.createdAt ?? '').localeCompare(right.createdAt ?? '');
};

const fetchCollection = async (collectionRef, normalizer) => {
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map(normalizer).sort(sortByOrder);
};

const replaceCollection = async (collectionRef, records) => {
  const existingSnapshot = await getDocs(collectionRef);

  if (!existingSnapshot.empty) {
    const deleteBatch = writeBatch(db);
    existingSnapshot.docs.forEach((documentSnapshot) => {
      deleteBatch.delete(documentSnapshot.ref);
    });
    await deleteBatch.commit();
  }

  if (records.length === 0) {
    return [];
  }

  const batch = writeBatch(db);
  const timestamp = new Date().toISOString();

  records.forEach((record, index) => {
    const documentRef = doc(collectionRef);
    batch.set(documentRef, {
      ...record,
      order: index,
      createdAt: record.createdAt ?? timestamp,
      updatedAt: timestamp,
    });
  });

  await batch.commit();

  const normalizer = collectionRef.id === 'partyItems' ? normalizeItem : normalizePerson;
  return fetchCollection(collectionRef, normalizer);
};

export const loadPartyData = async () => {
  const [items, people] = await Promise.all([
    fetchCollection(itemsCollection, normalizeItem),
    fetchCollection(peopleCollection, normalizePerson),
  ]);

  return { items, people };
};

export const seedPartyData = async () => {
  const [items, people] = await Promise.all([
    replaceCollection(itemsCollection, defaultItems),
    replaceCollection(peopleCollection, defaultPeople),
  ]);

  return { items, people };
};

export const savePartyData = async (items, people) => {
  const normalizedItems = items.map(({ _id, _isNew, ...item }, index) => ({
    ...item,
    order: index,
    isAlcoholic: Boolean(item.isAlcoholic),
    unitPrice: toNumber(item.unitPrice),
    quantity: toNumber(item.quantity, 1),
  }));

  const normalizedPeople = people.map(({ _id, _isNew, ...person }, index) => ({
    ...person,
    order: index,
    isAlcoholic: Boolean(person.isAlcoholic),
  }));

  const [savedItems, savedPeople] = await Promise.all([
    replaceCollection(itemsCollection, normalizedItems),
    replaceCollection(peopleCollection, normalizedPeople),
  ]);

  return { items: savedItems, people: savedPeople };
};
