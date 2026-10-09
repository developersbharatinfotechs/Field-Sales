const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
require('dotenv').config();

const prisma = new PrismaClient();

function getTokenEncryptionKey() {
  const configured = process.env.GMAIL_TOKEN_ENCRYPTION_KEY;
  if (/^[0-9a-fA-F]{64}$/.test(configured)) {
    return Buffer.from(configured, 'hex');
  }
  return Buffer.from(configured, 'base64');
}

function decryptToken(value) {
  if (!value.startsWith('enc:v1:')) return value;
  const parts = value.split(':');
  const iv = Buffer.from(parts[2], 'hex');
  const authTag = Buffer.from(parts[3], 'hex');
  const encrypted = Buffer.from(parts[4], 'base64');
  const crypto = require('crypto');
  const decipher = crypto.createDecipheriv('aes-256-gcm', getTokenEncryptionKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

async function testSync() {
  try {
    const connection = await prisma.gmailConnection.findUnique({
      where: { employeeId: 'SE-FS-001' }
    });
    if (!connection) {
      console.log('No connection');
      return;
    }
    const accessToken = decryptToken(connection.accessToken);
    const refreshToken = decryptToken(connection.refreshToken);

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: connection.tokenExpiry.getTime()
    });

    console.log('Refreshing token...');
    const { credentials } = await client.refreshAccessToken();
    console.log('Token refreshed!', credentials);

    console.log('Initializing Gmail...');
    const gmail = google.gmail({ version: 'v1', auth: client });
    console.log('Fetching history...');
    const response = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: connection.historyId || undefined,
    });
    console.log('History fetched!', response.data);

  } catch (err) {
    console.error('Error in test script:', err.message, err.response?.data);
  } finally {
    await prisma.$disconnect();
  }
}

testSync();
