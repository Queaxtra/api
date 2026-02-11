const fetch = require('cross-fetch');

const CLOUDFLARE_DOH_URL = 'https://cloudflare-dns.com/dns-query';
const VALID_RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'TXT', 'SRV', 'PTR', 'CAA'];

// validates domain format using regex - ensures proper structure
const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/;

function validateDomain(domain) {
  if (!domain) {
    return {
      valid: false,
      error: 'domain is required. please make a request like /api/dns?domain=example.com'
    };
  }

  // remove protocol if present for validation
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  if (!DOMAIN_REGEX.test(cleanDomain)) {
    return { valid: false, error: 'invalid domain format.' };
  }

  return { valid: true, cleanDomain };
}

function validateRecordType(type) {
  if (!type) {
    return { valid: true, type: 'A' };
  }

  const upperType = type.toUpperCase();

  if (!VALID_RECORD_TYPES.includes(upperType)) {
    return {
      valid: false,
      error: `invalid record type. valid types: ${VALID_RECORD_TYPES.join(', ')}`
    };
  }

  return { valid: true, type: upperType };
}

async function lookupDns(domain, recordType = 'A') {
  try {
    const url = `${CLOUDFLARE_DOH_URL}?name=${encodeURIComponent(domain)}&type=${recordType}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/dns-json'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `dns query failed with status: ${response.status}`
      };
    }

    const data = await response.json();

    // check for dns response codes - 0 is NOERROR
    if (data.Status !== 0) {
      const statusMessages = {
        1: 'FORMERR - format error',
        2: 'SERVFAIL - server failure',
        3: 'NXDOMAIN - domain does not exist',
        4: 'NOTIMP - not implemented',
        5: 'REFUSED - query refused'
      };

      return {
        success: false,
        error: statusMessages[data.Status] || `dns error status: ${data.Status}`
      };
    }

    if (!data.Answer || data.Answer.length === 0) {
      return {
        success: true,
        data: {
          domain,
          recordType,
          records: [],
          message: 'no records found for this query'
        }
      };
    }

    const records = data.Answer.map(record => ({
      name: record.name,
      type: getRecordTypeName(record.type),
      typeId: record.type,
      ttl: record.TTL,
      data: record.data
    }));

    return {
      success: true,
      data: {
        domain,
        recordType,
        records,
        ttl: records[0]?.ttl || null
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `dns lookup failed: ${error.message}`
    };
  }
}

// maps dns record type numbers to names - based on RFC standards
function getRecordTypeName(typeId) {
  const types = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    6: 'SOA',
    12: 'PTR',
    15: 'MX',
    16: 'TXT',
    28: 'AAAA',
    33: 'SRV',
    257: 'CAA'
  };

  return types[typeId] || `UNKNOWN(${typeId})`;
}

module.exports = {
  validateDomain,
  validateRecordType,
  lookupDns
};
