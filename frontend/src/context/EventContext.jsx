import React, { createContext, useState, useEffect } from 'react';

export const EventContext = createContext();

const EVENTS_STORAGE_KEY = 'metacup_events';
const TICKETS_STORAGE_KEY = 'metacup_user_tickets';

const initialEvents = [
  {
    id: 1,
    title: "Final: Brazil vs Germany",
    teams: { team1: "Brazil", team2: "Germany" },
    date: "15 Juli 2026",
    time: "20:00 WITA",
    venue: "Lusail Stadium",
    price: 0.01,
    seatQuantity: 1000,
    ticketsSold: 138,
  },
  {
    id: 2,
    title: "Semi-Final: Argentina vs France",
    teams: { team1: "Argentina", team2: "France" },
    date: "12 Juli 2026",
    time: "22:00 WITA",
    venue: "Al Bayt Stadium",
    price: 0.01,
    seatQuantity: 1500,
    ticketsSold: 89,
  },
  {
    id: 3,
    title: "Quarter-Final: Portugal vs Spain",
    teams: { team1: "Portugal", team2: "Spain" },
    date: "10 Juli 2026",
    time: "19:00 WITA",
    venue: "Education City Stadium",
    price: 0.02,
    seatQuantity: 800,
    ticketsSold: 800,
  },
];

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Corrupt data — fall back to defaults
  }
  return fallback;
}

export function EventProvider({ children }) {
  // Persisted per-browser; not shared across devices or a substitute for on-chain records.
  const [events, setEvents] = useState(() =>
    loadFromStorage(EVENTS_STORAGE_KEY, initialEvents)
  );
  const [userTickets, setUserTickets] = useState(() =>
    loadFromStorage(TICKETS_STORAGE_KEY, [])
  );

  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(userTickets));
  }, [userTickets]);

  const addEvent = (eventData) => {
    const newEvent = {
      id: Math.max(...events.map((e) => e.id), 0) + 1,
      ...eventData,
      ticketsSold: 0,
    };
    setEvents([...events, newEvent]);
    return newEvent.id;
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter((e) => e.id !== eventId));
    setUserTickets(userTickets.filter((t) => t.eventId !== eventId));
  };

  const getUserTickets = (userAddress) => {
    if (!userAddress) return [];
    return userTickets
      .filter((t) => t.userAddress.toLowerCase() === userAddress.toLowerCase())
      .map((t) => {
        const event = events.find((e) => e.id === t.eventId);
        return {
          ...t,
          eventTitle: event?.title || 'Unknown Event',
          eventDate: event?.date || 'Unknown Date',
          eventVenue: event?.venue || 'Unknown Venue',
        };
      });
  };

  const addUserTicket = (userAddress, eventId, quantity, txHash, tokenIds) => {
    const newTickets = [];
    for (let i = 0; i < quantity; i++) {
      const tokenId = tokenIds && tokenIds[i] !== undefined ? tokenIds[i] : `MOCK-${Date.now() + i}`;
      const newTicket = {
        id: `TKT-${tokenId}`,
        userAddress,
        eventId,
        quantity: 1, // Store each ticket NFT as its own record
        purchaseDate: new Date().toISOString(),
        status: 'Valid',
        txHash: txHash || '0x' + 'f'.repeat(64),
      };
      newTickets.push(newTicket);
    }
    
    setUserTickets([...userTickets, ...newTickets]);

    setEvents(
      events.map((e) =>
        e.id === eventId
          ? { ...e, ticketsSold: e.ticketsSold + quantity }
          : e
      )
    );

    return newTickets.map(t => t.id);
  };

  const getEventById = (eventId) => {
    return events.find((e) => e.id === eventId);
  };

  const getAllEvents = () => {
    return events;
  };

  const deleteUserTicket = (ticketId) => {
    setUserTickets(userTickets.filter((t) => t.id !== ticketId));
  };

  const value = {
    events,
    userTickets,
    addEvent,
    deleteEvent,
    getUserTickets,
    addUserTicket,
    deleteUserTicket,
    getEventById,
    getAllEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}
