const mongoose = require("mongoose");

exports.reset_all  = async (req, res) => {
     try {
    // Clear all collections except the 'concerts', 'programmes', 'absences' collection
    const collections = mongoose.connection.collections;
    const collectionsToKeep = ['concerts', 'programmes', 'absences']; // Add the collections you want to keep
    const collectionsToClear = Object.keys(collections).filter(collection => !collectionsToKeep.includes(collection));

    await Promise.all(collectionsToClear.map(async collectionName => {
      const collection = collections[collectionName];
      await collection.deleteMany({});
      
    }));

    // Insert test data if needed
    // Your code to insert test data goes here

    res.status(200).json({ message: 'Database reset successfully.' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
