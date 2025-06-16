db = db.getSiblingDB('api_in_case_of');
db.createCollection('Users');
db.createCollection('Lockers');
db.createCollection('Bookings');