// parses user-agent string to extract browser, os, and device information
function parseUserAgent(userAgentString) {
  if (!userAgentString) {
    return {
      valid: false,
      error: 'user-agent header is required'
    };
  }

  const ua = userAgentString;

  const browser = detectBrowser(ua);
  const os = detectOs(ua);
  const device = detectDevice(ua, browser.name);

  return {
    valid: true,
    data: {
      browser,
      os,
      device,
      raw: ua
    }
  };
}

// detects browser name and version from user-agent string
// uses early return pattern - first match wins
function detectBrowser(ua) {
  // edge must be checked before chrome (edge includes edg/ or edga/)
  const edgeMatch = ua.match(/edg[a]?\/([\d.]+)/i);
  if (edgeMatch) {
    return { name: 'Edge', version: edgeMatch[1], engine: 'Blink' };
  }

  // samsung internet
  const samsungMatch = ua.match(/samsungbrowser\/([\d.]+)/i);
  if (samsungMatch) {
    return { name: 'Samsung Internet', version: samsungMatch[1], engine: 'Blink' };
  }

  // opera - check for opr/ or opera/ or opt/ (opera touch)
  const operaMatch = ua.match(/opr\/([\d.]+)/i) || ua.match(/opera\/([\d.]+)/i) || ua.match(/opt\/([\d.]+)/i);
  if (operaMatch) {
    return { name: 'Opera', version: operaMatch[1], engine: 'Blink' };
  }

  // firefox (check before chrome to avoid false positives)
  const firefoxMatch = ua.match(/firefox\/([\d.]+)/i);
  if (firefoxMatch) {
    return { name: 'Firefox', version: firefoxMatch[1], engine: 'Gecko' };
  }

  // safari (check before chrome, safari doesn't have chrome/ or chromium/)
  if (/safari\/([\d.]+)/i.test(ua) && !/chrome\/([\d.]+)/i.test(ua) && !/chromium\/([\d.]+)/i.test(ua)) {
    const safariMatch = ua.match(/version\/([\d.]+)/i) || ua.match(/safari\/([\d.]+)/i);
    return { name: 'Safari', version: safariMatch ? safariMatch[1] : null, engine: 'WebKit' };
  }

  // brave - check before chrome (brave includes chrome/ in ua)
  const braveMatch = ua.match(/brave\/([\d.]+)/i);
  if (braveMatch) {
    return { name: 'Brave', version: braveMatch[1], engine: 'Blink' };
  }

  // vivaldi
  const vivaldiMatch = ua.match(/vivaldi\/([\d.]+)/i);
  if (vivaldiMatch) {
    return { name: 'Vivaldi', version: vivaldiMatch[1], engine: 'Blink' };
  }

  // duckduckgo
  const ddgMatch = ua.match(/duckduckgo\/([\d.]+)/i);
  if (ddgMatch) {
    return { name: 'DuckDuckGo', version: ddgMatch[1], engine: 'WebKit' };
  }

  // chrome (must be checked after edge, opera, safari, brave, vivaldi)
  const chromeMatch = ua.match(/chrome\/([\d.]+)/i) || ua.match(/chromium\/([\d.]+)/i);
  if (chromeMatch) {
    const isChromium = ua.toLowerCase().includes('chromium');
    return { name: isChromium ? 'Chromium' : 'Chrome', version: chromeMatch[1], engine: 'Blink' };
  }

  return { name: 'Unknown', version: null, engine: 'Unknown' };
}

// detects operating system from user-agent string
function detectOs(ua) {
  let name = 'Unknown';
  let version = null;
  let platform = 'Unknown';

  // windows
  if (/windows nt/i.test(ua)) {
    name = 'Windows';
    platform = 'Desktop';

    if (/windows nt 10/i.test(ua)) {
      version = '10/11';
    }

    if (/windows nt 6\.3/i.test(ua)) {
      version = '8.1';
    }

    if (/windows nt 6\.2/i.test(ua)) {
      version = '8';
    }

    if (/windows nt 6\.1/i.test(ua)) {
      version = '7';
    }
  }

  // macos
  if (/macintosh/i.test(ua) || /mac os x/i.test(ua)) {
    name = 'macOS';
    platform = 'Desktop';
    const match = ua.match(/mac os x ([\d_]+)/i);

    if (match) {
      version = match[1].replace(/_/g, '.');
    }
  }

  // ios (check before android, must be before generic mobile check)
  if (/iphone|ipad|ipod/i.test(ua)) {
    name = 'iOS';
    platform = 'Mobile';
    const match = ua.match(/os ([\d_]+)/i);

    if (match) {
      version = match[1].replace(/_/g, '.');
    }
  }

  // android (check before linux, android includes linux in ua)
  if (/android/i.test(ua)) {
    name = 'Android';
    platform = 'Mobile';
    const match = ua.match(/android ([\d.]+)/i);

    if (match) {
      version = match[1];
    }
  }

  // linux (must be checked after android)
  if (/linux/i.test(ua) && !/android/i.test(ua)) {
    name = 'Linux';
    platform = 'Desktop';

    // try to detect distro
    if (/ubuntu/i.test(ua)) {
      version = 'Ubuntu';
    }

    if (/debian/i.test(ua)) {
      version = 'Debian';
    }

    if (/fedora/i.test(ua)) {
      version = 'Fedora';
    }
  }

  return { name, version, platform };
}

// detects device type and model from user-agent string
function detectDevice(ua, browserName) {
  let type = 'Desktop';
  let model = 'Unknown';
  let vendor = 'Unknown';

  // mobile detection
  if (/mobile/i.test(ua) || /iphone|ipod|android.*mobile/i.test(ua)) {
    type = 'Mobile';
  }

  // tablet detection
  if (/tablet|ipad|android(?!.*mobile)/i.test(ua)) {
    type = 'Tablet';
  }

  // apple devices
  if (/macintosh|mac os x/i.test(ua)) {
    vendor = 'Apple';
  }

  if (/iphone/i.test(ua)) {
    model = 'iPhone';
    vendor = 'Apple';
  }

  if (/ipad/i.test(ua)) {
    model = 'iPad';
    vendor = 'Apple';
  }

  // samsung - detect by sm- model code or samsung keyword
  if (/samsung|sm-[a-z0-9]/i.test(ua)) {
    vendor = 'Samsung';
    const match = ua.match(/sm-[a-z0-9]+/i);

    if (match) {
      model = match[0].toUpperCase();
    }
  }

  // google pixel
  if (/pixel/i.test(ua)) {
    vendor = 'Google';
    const match = ua.match(/pixel [a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // xiaomi/redmi/poco
  if (/xiaomi|redmi|poco|mi /i.test(ua)) {
    vendor = 'Xiaomi';
    const match = ua.match(/(xiaomi|redmi|poco|mi) [a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // huawei
  if (/huawei/i.test(ua)) {
    vendor = 'Huawei';
    const match = ua.match(/(huawei|honor) [a-z0-9-]+/i);

    if (match) {
      model = match[0];
    }
  }

  // oneplus
  if (/oneplus/i.test(ua)) {
    vendor = 'OnePlus';
    const match = ua.match(/oneplus[\s]?[a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // oppo
  if (/oppo/i.test(ua)) {
    vendor = 'OPPO';
    const match = ua.match(/oppo [a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // vivo
  if (/vivo/i.test(ua)) {
    vendor = 'vivo';
    const match = ua.match(/vivo [a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // realme
  if (/realme/i.test(ua)) {
    vendor = 'realme';
    const match = ua.match(/realme [a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // sony xperia
  if (/xperia|sony/i.test(ua)) {
    vendor = 'Sony';
    const match = ua.match(/xperia [a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // lg
  if (/lg-/i.test(ua)) {
    vendor = 'LG';
    const match = ua.match(/lg-[a-z0-9]+/i);

    if (match) {
      model = match[0].toUpperCase();
    }
  }

  // motorola
  if (/motorola|moto/i.test(ua)) {
    vendor = 'Motorola';
    const match = ua.match(/moto [a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // nokia
  if (/nokia/i.test(ua)) {
    vendor = 'Nokia';
    const match = ua.match(/nokia[a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // asus
  if (/asus/i.test(ua)) {
    vendor = 'ASUS';
    const match = ua.match(/asus [a-z0-9]+/i);

    if (match) {
      model = match[0];
    }
  }

  // lenovo
  if (/lenovo/i.test(ua)) {
    vendor = 'Lenovo';
  }

  // hp
  if (/hp|hewlett-packard/i.test(ua)) {
    vendor = 'HP';
  }

  // dell
  if (/dell/i.test(ua)) {
    vendor = 'Dell';
  }

  // acer
  if (/acer/i.test(ua)) {
    vendor = 'Acer';
  }

  // msi
  if (/msi/i.test(ua)) {
    vendor = 'MSI';
  }

  // razer
  if (/razer/i.test(ua)) {
    vendor = 'Razer';
  }

  // microsoft surface
  if (/surface/i.test(ua)) {
    vendor = 'Microsoft';
    model = 'Surface';
  }

  // bot/crawler detection
  if (/bot|crawler|spider|slurp|baidu|bing|googlebot/i.test(ua)) {
    type = 'Bot';
    model = 'Crawler';
  }

  return { type, model, vendor };
}

module.exports = {
  parseUserAgent
};
