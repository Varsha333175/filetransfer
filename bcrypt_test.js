const bcrypt = require('bcryptjs');

const testPassword = async () => {
  const password = 'varsha1'; // The plain text password
  const hash = await bcrypt.hash(password, 10); // Hash the password

  console.log('Generated hash:', hash);

  const isMatch = await bcrypt.compare(password, hash); // Compare the password with the hash
  console.log('Password match:', isMatch); // Should print true if matches
};

testPassword().catch(console.error);
