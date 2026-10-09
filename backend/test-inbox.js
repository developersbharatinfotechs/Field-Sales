const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign(
  { sub: 'SE-FS-001', employeeId: 'SE-FS-001', role: 'EMPLOYEE' },
  process.env.JWT_SECRET || 'Fob9ThVU/MSqqmpPUtrSBB22RBO39x2kJo+phb00FFA=',
  { expiresIn: '1h' }
);

async function test() {
  const inboxRes = await fetch('http://localhost:3000/email/inbox', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Inbox status:', inboxRes.status);
  const inboxText = await inboxRes.text();
  console.log('Inbox body:', inboxText);

  const syncRes = await fetch('http://localhost:3000/email/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Sync status:', syncRes.status);
  const syncText = await syncRes.text();
  console.log('Sync body:', syncText);
}
test();
