import mongoose from 'mongoose';
import dns from 'dns';

// Ensure public DNS resolver & IPv4 ordering are set globally for SRV lookups on Windows
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (_) {}

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) {}

const DEFAULT_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

const parseDnsServers = (value) =>
  value
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Helper to convert mongodb+srv:// to direct seed list mongodb://
async function convertSrvToDirectUri(srvUri) {
  try {
    const match = srvUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/);
    if (!match) return null;
    const [, user, pass, host, db = '/tradexpert', query = ''] = match;

    dns.setServers(DEFAULT_DNS_SERVERS);
    const dnsPromises = dns.promises;

    const srvRecords = await dnsPromises.resolveSrv(`_mongodb._tcp.${host}`);
    if (!srvRecords || srvRecords.length === 0) return null;

    const txtRecords = await dnsPromises.resolveTxt(host).catch(() => []);
    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');
    const txtOptions = txtRecords.flat().join('&');

    let finalQuery = query ? query.replace(/^\?/, '') : '';
    if (txtOptions) {
      finalQuery = finalQuery ? `${finalQuery}&${txtOptions}` : txtOptions;
    }
    if (!finalQuery.includes('ssl=true')) {
      finalQuery += `${finalQuery ? '&' : ''}ssl=true`;
    }

    return `mongodb://${user}:${pass}@${hosts}${db}?${finalQuery}`;
  } catch (e) {
    console.warn('[MongoDB] Auto SRV resolution helper failed:', e.message);
    return null;
  }
}

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tradexpert';

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const usesSrvRecord = typeof mongoUri === 'string' && mongoUri.startsWith('mongodb+srv://');

    if (usesSrvRecord) {
      const dnsServers = process.env.MONGO_DNS_SERVERS
        ? parseDnsServers(process.env.MONGO_DNS_SERVERS)
        : DEFAULT_DNS_SERVERS;

      if (dnsServers.length > 0) {
        try {
          dns.setServers(dnsServers);
        } catch (e) {
          console.warn('[MongoDB] Unable to set custom DNS servers:', e.message);
        }
      }
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(mongoUri, opts)
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch(async (err) => {
        const isSrvLookupFailure = usesSrvRecord && /querySrv|ECONNREFUSED|ENOTFOUND/i.test(err.message);
        if (isSrvLookupFailure) {
          console.warn('[MongoDB] SRV lookup failed. Attempting direct seed-list connection fallback...');
          const directUri = await convertSrvToDirectUri(mongoUri);
          if (directUri) {
            console.log('[MongoDB] Retrying with resolved direct seed list...');
            return mongoose.connect(directUri, opts).then((inst) => {
              console.log('MongoDB connected successfully via direct seed list');
              return inst;
            });
          }
        }
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
