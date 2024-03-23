const { Sequelize } = require('sequelize');
// const { Genre } = require('./models'); // Import Genre model
const db = require("../models");
const Genre = db.genres;

const seedGenres = async () => {
    try {
        const genres = [
            'Fiction',
            'Non-fiction',
            'Science Fiction',
            'Fantasy',
            'Mystery',
            'Romance',
            'Thriller',
            'History',
            'Biography',
            'Self-help',
        ];

        // Loop through genre names and create them
        for (const genreName of genres) {
            await Genre.create({ genre: genreName });
        }

        console.log('10 Genres successfully seeded!');
    } catch (error) {
        console.error('Error seeding genres:', error);
    }
};

// Execute the seeder function
seedGenres();
