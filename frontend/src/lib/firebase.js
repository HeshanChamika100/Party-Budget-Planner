import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  writeBatch,
  setDoc,
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
const partiesCollection = collection(db, 'parties');

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

const normalizeArrayItem = (item = {}, fallbackOrder = 0) => ({
  name: item.name ?? '',
  unitPrice: toNumber(item.unitPrice),
  quantity: toNumber(item.quantity, 1),
  isAlcoholic: Boolean(item.isAlcoholic),
  order: toNumber(item.order, fallbackOrder),
  createdAt: item.createdAt ?? null,
  updatedAt: item.updatedAt ?? null,
});

const normalizeArrayPerson = (person = {}, fallbackOrder = 0) => ({
  name: person.name ?? '',
  isAlcoholic: Boolean(person.isAlcoholic),
  order: toNumber(person.order, fallbackOrder),
  createdAt: person.createdAt ?? null,
  updatedAt: person.updatedAt ?? null,
});

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

const fetchParties = async () => {
  const snapshot = await getDocs(partiesCollection);

  return snapshot.docs
    .map((partySnapshot) => {
      const data = partySnapshot.data();
      return {
        _id: partySnapshot.id,
        name: data.name ?? 'Untitled Party',
        createdAt: data.createdAt ?? null,
        updatedAt: data.updatedAt ?? null,
        itemCount: Array.isArray(data.items) ? data.items.length : 0,
        peopleCount: Array.isArray(data.people) ? data.people.length : 0,
      };
    })
    .sort((left, right) => (left.createdAt ?? '').localeCompare(right.createdAt ?? ''));
};

const sanitizeItems = (items) =>
  items.map(({ _id, _isNew, ...item }, index) => ({
    ...item,
    order: index,
    isAlcoholic: Boolean(item.isAlcoholic),
    unitPrice: toNumber(item.unitPrice),
    quantity: toNumber(item.quantity, 1),
  }));

const sanitizePeople = (people) =>
  people.map(({ _id, _isNew, ...person }, index) => ({
    ...person,
    order: index,
    isAlcoholic: Boolean(person.isAlcoholic),
  }));

const writePartyDocument = async (partyId, { name, items, people, createdAt = null }) => {
  const timestamp = new Date().toISOString();
  const partyRef = doc(partiesCollection, partyId);

  const nextItems = sanitizeItems(items).map((item) => ({
    ...item,
    createdAt: item.createdAt ?? timestamp,
    updatedAt: timestamp,
  }));

  const nextPeople = sanitizePeople(people).map((person) => ({
    ...person,
    createdAt: person.createdAt ?? timestamp,
    updatedAt: timestamp,
  }));

  await setDoc(partyRef, {
    name,
    items: nextItems,
    people: nextPeople,
    createdAt: createdAt ?? timestamp,
    updatedAt: timestamp,
  });

  return {
    _id: partyId,
    name,
    items: nextItems,
    people: nextPeople,
    createdAt: createdAt ?? timestamp,
    updatedAt: timestamp,
  };
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

export const listParties = async () => {
  return fetchParties();
};

export const ensurePartyStore = async () => {
  const existingParties = await fetchParties();

  if (existingParties.length > 0) {
    return existingParties;
  }

  const [items, people] = await Promise.all([
    fetchCollection(itemsCollection, normalizeItem),
    fetchCollection(peopleCollection, normalizePerson),
  ]);

  const hasLegacyData = items.length > 0 || people.length > 0;
  const baseItems = hasLegacyData ? items : defaultItems;
  const basePeople = hasLegacyData ? people : defaultPeople;

  await createParty('My Party', {
    items: baseItems,
    people: basePeople,
  });

  return fetchParties();
};

export const seedPartyData = async () => {
  const [items, people] = await Promise.all([
    replaceCollection(itemsCollection, defaultItems),
    replaceCollection(peopleCollection, defaultPeople),
  ]);

  return { items, people };
};

export const createParty = async (partyName, options = {}) => {
  const name = partyName?.trim() || 'Untitled Party';
  const items = options.items ?? defaultItems;
  const people = options.people ?? defaultPeople;
  const partyRef = doc(partiesCollection);

  await writePartyDocument(partyRef.id, {
    name,
    items,
    people,
  });

  return {
    _id: partyRef.id,
    name,
  };
};

export const loadPartyDataById = async (partyId) => {
  const partyRef = doc(partiesCollection, partyId);
  const snapshot = await getDoc(partyRef);

  if (!snapshot.exists()) {
    throw new Error('Selected party was not found.');
  }

  const data = snapshot.data();
  const items = (Array.isArray(data.items) ? data.items : [])
    .map((item, index) => normalizeArrayItem(item, index))
    .sort(sortByOrder);
  const people = (Array.isArray(data.people) ? data.people : [])
    .map((person, index) => normalizeArrayPerson(person, index))
    .sort(sortByOrder);

  return {
    _id: snapshot.id,
    name: data.name ?? 'Untitled Party',
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    items,
    people,
  };
};

export const savePartyData = async (partyId, items, people) => {
  const existingParty = await loadPartyDataById(partyId);

  const savedParty = await writePartyDocument(partyId, {
    name: existingParty.name,
    items,
    people,
    createdAt: existingParty.createdAt,
  });

  return {
    party: {
      _id: savedParty._id,
      name: savedParty.name,
    },
    items: savedParty.items,
    people: savedParty.people,
  };
};

export const renameParty = async (partyId, nextName) => {
  const normalizedName = nextName?.trim();

  if (!normalizedName) {
    throw new Error('Party name cannot be empty.');
  }

  const existingParty = await loadPartyDataById(partyId);
  const savedParty = await writePartyDocument(partyId, {
    name: normalizedName,
    items: existingParty.items,
    people: existingParty.people,
    createdAt: existingParty.createdAt,
  });

  return {
    _id: savedParty._id,
    name: savedParty.name,
  };
};

export const deleteParty = async (partyId) => {
  const partyRef = doc(partiesCollection, partyId);
  await deleteDoc(partyRef);

  let remainingParties = await fetchParties();

  if (remainingParties.length === 0) {
    await createParty('My Party', {
      items: defaultItems,
      people: defaultPeople,
    });
    remainingParties = await fetchParties();
  }

  return remainingParties;
};
