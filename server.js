const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/aadharDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory database - We will directly use 'user123'
const users = {
  'user123': {
    id: 'user123',
    name: 'Aswin',
    email: 'aswinja05@gmail.com',
    walletBalance: 100.0, // Initial balance
    transactions: [
      {
        id: 'tx_initial_recharge',
        type: 'RECHARGE',
        amount: 150.0,
        date: new Date().toISOString(),
        description: 'Initial Wallet Balance',
      }
    ],
  },
};

// Helper to get the single demo user
function getDemoUser() {
  return users['user123'];
}

// API Routes

// Get wallet balance
app.get('/api/wallet/balance', (req, res) => {
  const user = getDemoUser();
  console.log(`Fetching balance for demo user. Balance: ${user.walletBalance}`);
  res.json({ balance: user.walletBalance });
});

// Recharge wallet
app.post('/api/wallet/recharge', (req, res) => {
  const user = getDemoUser();
  const { amount, upiId, paymentApp } = req.body;

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  user.walletBalance += parsedAmount;
  console.log(`Recharged wallet for demo user. Amount: ${parsedAmount}. New Balance: ${user.walletBalance}`);

  const transaction = {
    id: `tx${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    type: 'RECHARGE',
    amount: parsedAmount,
    date: new Date().toISOString(),
    description: 'Wallet Recharge',
    paymentMethod: {
      type: 'UPI',
      upiId: upiId || 'N/A',
      app: paymentApp || 'N/A',
    },
  };

  user.transactions.push(transaction);

  res.json({
    success: true,
    message: 'Recharge successful',
    newBalance: user.walletBalance,
    transaction: transaction
  });
});

// Payment endpoint for bus fare
app.post('/api/wallet/pay-fare', (req, res) => {
  const user = getDemoUser();
  const { amount, busId, routeId } = req.body;

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  if (user.walletBalance < parsedAmount) {
    console.log(`Insufficient balance for demo user. Balance: ${user.walletBalance}, Required: ${parsedAmount}`);
    return res.status(400).json({
      error: 'Insufficient balance',
      balance: user.walletBalance,
      required: parsedAmount
    });
  }

  user.walletBalance -= parsedAmount;
  console.log(`Fare paid by demo user. Amount: ${parsedAmount}. New Balance: ${user.walletBalance}`);

  const transaction = {
    id: `tx${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    type: 'PAYMENT',
    amount: -parsedAmount,
    date: new Date().toISOString(),
    description: `Bus Fare - ${busId || 'Unknown Bus'}`,
    busDetails: {
      busId: busId || 'N/A',
      routeId: routeId || 'N/A',
    },
  };

  user.transactions.push(transaction);

  res.json({
    success: true,
    message: 'Payment successful',
    newBalance: user.walletBalance,
    transaction: transaction
  });
});
















// Aadhaar Schema
const aadhaarSchema = new mongoose.Schema({
  aadhaarNumber: String,
  name: String,
  age: Number,
  dob: String,
  address: String,
  state: String,
  phone: String,
  photo: String, // URL or base64
  gender: String
});

const Aadhaar = mongoose.model('Aadhaar', aadhaarSchema);

// One-time seeding of synthetic data
async function seedData() {
  const existing = await Aadhaar.find({});
  if (existing.length === 0) {
    const sampleData = [
      {
        aadhaarNumber: '123412341234',
        name: 'Ananya Rao',
        age: 24,
        dob: '2001-05-12',
        address: 'Indiranagar, Bangalore',
        state: 'Karnataka',
        phone: '9902227821',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
        gender: 'Female'
      },
      {
        aadhaarNumber: '234523452345',
        name: 'Nikita Sharma',
        age: 27,
        dob: '1997-03-22',
        address: 'Rajajinagar, Bangalore',
        state: 'Karnataka',
        phone: '7892525214',
        photo: 'https://randomuser.me/api/portraits/women/37.jpg',
        gender: 'Female'
      },
      {
        aadhaarNumber: '345634563456',
        name: 'Ravi Kumar',
        age: 30,
        dob: '1993-07-10',
        address: 'Jayanagar, Bangalore',
        state: 'Karnataka',
        phone: '9876543210',
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
        gender: 'Male'
      },
      {
        aadhaarNumber: '456745674567',
        name: 'Meena Iyer',
        age: 35,
        dob: '1989-09-05',
        address: 'Whitefield, Bangalore',
        state: 'Karnataka',
        phone: '8123456789',
        photo: 'https://randomuser.me/api/portraits/women/3.jpg',
        gender: 'Female'
      },
      {
        aadhaarNumber: '567856785678',
        name: 'Priya Nair',
        age: 22,
        dob: '2002-01-19',
        address: 'BTM Layout, Bangalore',
        state: 'Karnataka',
        phone: '9012345678',
        photo: 'https://randomuser.me/api/portraits/women/4.jpg',
        gender: 'Female'
      },
      {
        aadhaarNumber: '678967896789',
        name: 'Ramesh Gowda',
        age: 28,
        dob: '1996-11-03',
        address: 'Hebbal, Bangalore',
        state: 'Karnataka',
        phone: '9988776655',
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
        gender: 'Male'
      },
      {
        aadhaarNumber: '789078907890',
        name: 'Shruti Menon',
        age: 29,
        dob: '1995-04-18',
        address: 'Koramangala, Bangalore',
        state: 'Karnataka',
        phone: '9845098450',
        photo: 'https://randomuser.me/api/portraits/women/9.jpg',
        gender: 'Female'
      },
      {
        aadhaarNumber: '890189018901',
        name: 'Vikram S',
        age: 31,
        dob: '1993-06-25',
        address: 'Majestic, Bangalore',
        state: 'Karnataka',
        phone: '9811198111',
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
        gender: 'Male'
      },
      {
        aadhaarNumber: '901290129012',
        name: 'Deepa Shetty',
        age: 26,
        dob: '1998-08-11',
        address: 'Yelahanka, Bangalore',
        state: 'Karnataka',
        phone: '9741197411',
        photo: 'https://randomuser.me/api/portraits/women/8.jpg',
        gender: 'Female'
      },
      {
        aadhaarNumber: '012301230123',
        name: 'Manoj Das',
        age: 34,
        dob: '1990-02-28',
        address: 'Marathahalli, Bangalore',
        state: 'Karnataka',
        phone: '9123491234',
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
        gender: 'Male'
      }
    ];

    await Aadhaar.insertMany(sampleData);
    console.log('Sample Aadhaar data inserted');
  }
}
// seedData();

// API Endpoint to verify Aadhaar using phone
app.post('/api/verify-aadhaar', async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    const aadhaarUser = await Aadhaar.findOne({ phone });

    if (!aadhaarUser) return res.status(404).json({ error: 'User not found' });

    if (aadhaarUser.gender !== 'Female' || aadhaarUser.state.toLowerCase() !== 'karnataka') {
      return res.status(403).json({ error: 'Not eligible for free female ticket' });
    }

    return res.json({
      success: true,
      message: 'User eligible for free female ticket',
      user: aadhaarUser
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});












app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
