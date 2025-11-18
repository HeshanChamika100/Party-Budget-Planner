import { createClient } from '@sanity/client';

// Create and configure the Sanity client
export const client = createClient({
  projectId: '7tl85h8u', // Your project ID from sanity.config.ts
  dataset: 'production',
  useCdn: true, // Set to true for faster cached responses
  apiVersion: '2024-01-01', // Use current date (YYYY-MM-DD) to target the latest API version
  // Uncomment the line below and add your token if you need authenticated requests
  // token: process.env.VITE_SANITY_TOKEN,
});

// Helper function to fetch all party items
export const fetchPartyItems = async () => {
  try {
    const query = `*[_type == "partyItem"] | order(_createdAt desc) {
      _id,
      name,
      unitPrice,
      quantity,
      isAlcoholic,
      category,
      notes,
      "imageUrl": image.asset->url,
      createdAt,
      updatedAt
    }`;
    
    const items = await client.fetch(query);
    return items;
  } catch (error) {
    console.error('Error fetching party items:', error);
    throw error;
  }
};

// Helper function to fetch all party people
export const fetchPartyPeople = async () => {
  try {
    const query = `*[_type == "partyPerson"] | order(_createdAt desc) {
      _id,
      name,
      isAlcoholic,
      email,
      phone,
      dietaryRestrictions,
      notes,
      rsvpStatus,
      "avatarUrl": avatar.asset->url,
      createdAt,
      updatedAt
    }`;
    
    const people = await client.fetch(query);
    return people;
  } catch (error) {
    console.error('Error fetching party people:', error);
    throw error;
  }
};

// Helper function to fetch all party events
export const fetchPartyEvents = async () => {
  try {
    const query = `*[_type == "partyEvent"] | order(eventDate desc) {
      _id,
      title,
      slug,
      description,
      eventDate,
      location,
      budget,
      status,
      "coverImageUrl": coverImage.asset->url,
      "items": items[]->{
        _id,
        name,
        unitPrice,
        quantity,
        isAlcoholic,
        category
      },
      "attendees": attendees[]->{
        _id,
        name,
        isAlcoholic,
        rsvpStatus
      },
      createdAt,
      updatedAt
    }`;
    
    const events = await client.fetch(query);
    return events;
  } catch (error) {
    console.error('Error fetching party events:', error);
    throw error;
  }
};

// Helper function to fetch a single party event by slug
export const fetchPartyEventBySlug = async (slug) => {
  try {
    const query = `*[_type == "partyEvent" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      eventDate,
      location,
      budget,
      status,
      "coverImageUrl": coverImage.asset->url,
      "items": items[]->{
        _id,
        name,
        unitPrice,
        quantity,
        isAlcoholic,
        category,
        notes
      },
      "attendees": attendees[]->{
        _id,
        name,
        isAlcoholic,
        email,
        phone,
        dietaryRestrictions,
        rsvpStatus
      },
      createdAt,
      updatedAt
    }`;
    
    const event = await client.fetch(query, { slug });
    return event;
  } catch (error) {
    console.error('Error fetching party event by slug:', error);
    throw error;
  }
};

// Helper function to create a new party item
export const createPartyItem = async (itemData) => {
  try {
    const newItem = await client.create({
      _type: 'partyItem',
      name: itemData.name,
      unitPrice: itemData.unitPrice,
      quantity: itemData.quantity,
      isAlcoholic: itemData.isAlcoholic || false,
      category: itemData.category,
      notes: itemData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newItem;
  } catch (error) {
    console.error('Error creating party item:', error);
    throw error;
  }
};

// Helper function to create a new party person
export const createPartyPerson = async (personData) => {
  try {
    const newPerson = await client.create({
      _type: 'partyPerson',
      name: personData.name,
      isAlcoholic: personData.isAlcoholic || false,
      email: personData.email,
      phone: personData.phone,
      dietaryRestrictions: personData.dietaryRestrictions,
      notes: personData.notes,
      rsvpStatus: personData.rsvpStatus || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newPerson;
  } catch (error) {
    console.error('Error creating party person:', error);
    throw error;
  }
};

// Helper function to update a party item
export const updatePartyItem = async (itemId, updates) => {
  try {
    const updatedItem = await client
      .patch(itemId)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .commit();
    return updatedItem;
  } catch (error) {
    console.error('Error updating party item:', error);
    throw error;
  }
};

// Helper function to update a party person
export const updatePartyPerson = async (personId, updates) => {
  try {
    const updatedPerson = await client
      .patch(personId)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .commit();
    return updatedPerson;
  } catch (error) {
    console.error('Error updating party person:', error);
    throw error;
  }
};

// Helper function to delete a party item
export const deletePartyItem = async (itemId) => {
  try {
    await client.delete(itemId);
    return { success: true, message: 'Item deleted successfully' };
  } catch (error) {
    console.error('Error deleting party item:', error);
    throw error;
  }
};

// Helper function to delete a party person
export const deletePartyPerson = async (personId) => {
  try {
    await client.delete(personId);
    return { success: true, message: 'Person deleted successfully' };
  } catch (error) {
    console.error('Error deleting party person:', error);
    throw error;
  }
};

// Helper function to subscribe to real-time updates for party items
export const subscribeToPartyItems = (callback) => {
  const query = '*[_type == "partyItem"]';
  const subscription = client.listen(query).subscribe((update) => {
    callback(update);
  });
  
  return subscription; // Return subscription so it can be unsubscribed later
};

// Helper function to subscribe to real-time updates for party people
export const subscribeToPartyPeople = (callback) => {
  const query = '*[_type == "partyPerson"]';
  const subscription = client.listen(query).subscribe((update) => {
    callback(update);
  });
  
  return subscription; // Return subscription so it can be unsubscribed later
};

export default client;
