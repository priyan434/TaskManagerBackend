const mongoose = require('mongoose');
const app = require('./app');
require("dotenv").config();
const PORT = process.env.PORT || 3000;




mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });


  
