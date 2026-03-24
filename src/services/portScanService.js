const net = require('net');
const dns = require('node:dns').promises;

// ipv4 format validation - ensures proper dotted decimal notation
const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

// hostname validation - allows alphanumeric, hyphens, and multiple subdomains
const HOSTNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// frequently scanned ports for quick reference - covers most common services
const COMMON_PORTS = [
  21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 5900, 8080, 8443
];

// validates the target host parameter
// accepts both ipv4 addresses and domain hostnames
// returns validation result object with optional error message
function validateHost(host) {
  if (!host) {
    return {
      valid: false,
      error: 'host is required. please make a request like /api/scan/port?host=example.com'
    };
  }

  if (!IP_REGEX.test(host) && !HOSTNAME_REGEX.test(host)) {
    return { valid: false, error: 'invalid host format. provide a valid ip or hostname.' };
  }

  return { valid: true };
}

function ipv4ToNumber(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function isIpv4InRange(ip, cidrBase, prefixLength) {
  const ipNum = ipv4ToNumber(ip);
  const baseNum = ipv4ToNumber(cidrBase);
  const mask = prefixLength === 0 ? 0 : (0xFFFFFFFF << (32 - prefixLength)) >>> 0;
  return (ipNum & mask) === (baseNum & mask);
}

function isBlockedIpv4(ip) {
  const blockedRanges = [
    ['0.0.0.0', 8],
    ['10.0.0.0', 8],
    ['100.64.0.0', 10],
    ['127.0.0.0', 8],
    ['169.254.0.0', 16],
    ['172.16.0.0', 12],
    ['192.0.0.0', 24],
    ['192.0.2.0', 24],
    ['192.168.0.0', 16],
    ['198.18.0.0', 15],
    ['198.51.100.0', 24],
    ['203.0.113.0', 24],
    ['224.0.0.0', 4]
  ];

  return blockedRanges.some(([base, prefix]) => isIpv4InRange(ip, base, prefix));
}

function isBlockedIpv6(ip) {
  const normalized = ip.toLowerCase();
  return normalized === '::1'
    || normalized === '::'
    || normalized.startsWith('fc')
    || normalized.startsWith('fd')
    || normalized.startsWith('fe80:')
    || normalized.startsWith('ff');
}

function isBlockedAddress(address) {
  if (net.isIPv4(address)) {
    return isBlockedIpv4(address);
  }

  if (net.isIPv6(address)) {
    return isBlockedIpv6(address);
  }

  return true;
}

async function resolveAndValidateTarget(host) {
  if (net.isIP(host)) {
    if (isBlockedAddress(host)) {
      return {
        valid: false,
        error: 'private, loopback, and reserved targets are not allowed for port scanning.'
      };
    }

    return { valid: true, address: host };
  }

  const records = await dns.lookup(host, { all: true, verbatim: true });

  if (!records.length) {
    return { valid: false, error: 'could not resolve the target host.' };
  }

  if (records.some(record => isBlockedAddress(record.address))) {
    return {
      valid: false,
      error: 'private, loopback, and reserved targets are not allowed for port scanning.'
    };
  }

  return { valid: true, address: records[0].address };
}

// validates port configuration from request parameters
// supports two modes: comma-separated list or start-end range
// enforces safety limits to prevent resource exhaustion attacks
function validatePorts(startPort, endPort, ports) {
  // specific ports provided as comma-separated values
  if (ports) {
    const portList = [...new Set(ports.split(',').map(p => parseInt(p.trim(), 10)))];

    // each port must be a valid number within tcp/udp port range (1-65535)
    if (portList.some(p => isNaN(p) || p < 1 || p > 65535)) {
      return { valid: false, error: 'invalid port list. ports must be between 1-65535.' };
    }

    if (portList.length > 100) {
      return { valid: false, error: 'port list too large. maximum 100 ports per request.' };
    }

    return { valid: true, mode: 'list', portList };
  }

  // scan from startPort to endPort
  const start = startPort ? parseInt(startPort, 10) : 1;
  const end = endPort ? parseInt(endPort, 10) : 1000;

  if (isNaN(start) || isNaN(end) || start < 1 || end > 65535 || start > end) {
    return { valid: false, error: 'invalid port range. ports must be between 1-65535 and start <= end.' };
  }

  const rangeSize = end - start + 1;

  if (rangeSize > 250) {
    return { valid: false, error: 'port range too large. maximum 250 ports per request.' };
  }

  return { valid: true, mode: 'range', start, end };
}

// attempts to establish a tcp connection to a single port
// returns promise that resolves with port status and detected service
// connection attempts timeout after specified milliseconds
function scanPort(host, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    // prevent hanging connections by enforcing timeout
    socket.setTimeout(timeout);

    // connection successful - port is open and accepting connections
    socket.on('connect', () => {
      socket.destroy();
      resolve({ port, status: 'open', service: getServiceName(port) });
    });

    // timeout reached - port is likely closed or filtered by firewall
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ port, status: 'closed', service: null });
    });

    // connection error (refused, unreachable, etc.) - port is closed
    socket.on('error', () => {
      socket.destroy();
      resolve({ port, status: 'closed', service: null });
    });

    // initiate the tcp connection attempt
    socket.connect(port, host);
  });
}

// orchestrates the full port scanning operation
// processes port list or range and returns aggregated results
// implements controlled concurrency to prevent resource exhaustion
async function scanPorts(host, portConfig, timeout = 2000) {
  try {
    const target = await resolveAndValidateTarget(host);

    if (!target.valid) {
      return {
        success: false,
        statusCode: 400,
        error: target.error
      };
    }

    let portsToScan;

    if (portConfig.mode === 'list') {
      portsToScan = portConfig.portList;
    } else {
      portsToScan = [];

      for (let p = portConfig.start; p <= portConfig.end; p++) {
        portsToScan.push(p);
      }
    }

    const CONCURRENCY_LIMIT = 25;
    const results = [];

    // process ports in batches to control resource usage
    for (let i = 0; i < portsToScan.length; i += CONCURRENCY_LIMIT) {
      const batch = portsToScan.slice(i, i + CONCURRENCY_LIMIT);
      const batchPromises = batch.map(port => scanPort(target.address, port, timeout));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const openPorts = results.filter(r => r.status === 'open');
    const closedPorts = results.filter(r => r.status === 'closed');

    return {
      success: true,
      data: {
        host,
        resolvedAddress: target.address,
        totalScanned: results.length,
        openCount: openPorts.length,
        closedCount: closedPorts.length,
        openPorts: openPorts.map(p => ({ port: p.port, service: p.service })),
        scanDetails: results
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `port scan failed: ${error.message}`
    };
  }
}

// maps common port numbers to service names - based on iana registered ports
function getServiceName(port) {
  const services = {
    20: 'FTP-DATA',
    21: 'FTP',
    22: 'SSH',
    23: 'TELNET',
    25: 'SMTP',
    53: 'DNS',
    67: 'DHCP',
    68: 'DHCP',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    445: 'SMB',
    3306: 'MYSQL',
    3389: 'RDP',
    5432: 'POSTGRESQL',
    5900: 'VNC',
    6379: 'REDIS',
    8080: 'HTTP-ALT',
    8443: 'HTTPS-ALT',
    27017: 'MONGODB'
  };

  return services[port] || 'UNKNOWN';
}

function getCommonPorts() {
  return COMMON_PORTS;
}

module.exports = {
  validateHost,
  validatePorts,
  scanPorts,
  getCommonPorts,
  resolveAndValidateTarget
};
