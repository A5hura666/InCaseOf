db = db.getSiblingDB('api_in_case_of');
db.createCollection('users');
db.createCollection('lockers');
db.createCollection('bookings');