const net = require('net');

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

// validates port configuration from request parameters
// supports two modes: comma-separated list or start-end range
// enforces safety limits to prevent resource exhaustion attacks
function validatePorts(startPort, endPort, ports) {
  // specific ports provided as comma-separated values
  if (ports) {
    const portList = ports.split(',').map(p => parseInt(p.trim(), 10));

    // each port must be a valid number within tcp/udp port range (1-65535)
    if (portList.some(p => isNaN(p) || p < 1 || p > 65535)) {
      return { valid: false, error: 'invalid port list. ports must be between 1-65535.' };
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

  if (rangeSize > 1000) {
    return { valid: false, error: 'port range too large. maximum 1000 ports per request.' };
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
    let portsToScan;

    if (portConfig.mode === 'list') {
      portsToScan = portConfig.portList;
    } else {
      portsToScan = [];

      for (let p = portConfig.start; p <= portConfig.end; p++) {
        portsToScan.push(p);
      }
    }

    const CONCURRENCY_LIMIT = 50;
    const results = [];

    // process ports in batches to control resource usage
    for (let i = 0; i < portsToScan.length; i += CONCURRENCY_LIMIT) {
      const batch = portsToScan.slice(i, i + CONCURRENCY_LIMIT);
      const batchPromises = batch.map(port => scanPort(host, port, timeout));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const openPorts = results.filter(r => r.status === 'open');
    const closedPorts = results.filter(r => r.status === 'closed');

    return {
      success: true,
      data: {
        host,
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
  getCommonPorts
};
