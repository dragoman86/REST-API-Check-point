require('dotenv').config({ path: './config/.env' });
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

//Create express app
const app = express();

//Middleware to parse JSON body
app.use(express.json());

//Define Routes
app.get('/', (req, res) => {
  res.send('Check Point RestAPI!');
});
//GET :  RETURN ALL USERS
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});
//POST :  ADD A NEW USER TO THE DATABASE 
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});
//PUT : EDIT A USER BY ID 
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});
//DELETE : REMOVE A USER BY ID
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});


//Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

