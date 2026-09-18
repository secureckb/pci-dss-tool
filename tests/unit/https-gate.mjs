// Unit checks on the HTTPS gate: the peer address decides whether a forwarded
// protocol header may be believed at all.
import { canAuthenticate } from '../../server/auth.js';

const fails = [];
const ck = (l, c, x = '') => {
  console.log(`  ${c ? 'PASS' : 'FAIL'}  ${l}${x ? ' -> ' + x : ''}`);
  if (!c) fails.push(l);
};

const req = ({ peer = '203.0.113.9', proto = null, encrypted = false, host = 'saq.example.com' }) => ({
  socket: { remoteAddress: peer, encrypted },
  get: (name) => (name.toLowerCase() === 'x-forwarded-proto' ? proto : name.toLowerCase() === 'host' ? host : undefined),
});

console.log('== a direct plaintext client cannot spoof its way past the HTTPS gate ==');
ck('public peer claiming https over plain HTTP is refused',
   canAuthenticate(req({ peer: '203.0.113.9', proto: 'https' })) === false);
ck('and with a forwarded chain, still refused',
   canAuthenticate(req({ peer: '198.51.100.7', proto: 'https, http' })) === false);
ck('public peer with no header is refused', canAuthenticate(req({ peer: '203.0.113.9' })) === false);

console.log('\n-- what a real deployment looks like --');
ck('TLS terminated by a proxy on the private network is accepted',
   canAuthenticate(req({ peer: '10.1.2.3', proto: 'https' })) === true);
ck('so is a loopback proxy', canAuthenticate(req({ peer: '127.0.0.1', proto: 'https' })) === true);
ck('IPv6-mapped loopback too', canAuthenticate(req({ peer: '::ffff:127.0.0.1', proto: 'https' })) === true);
ck('direct TLS to the process is accepted with no header at all',
   canAuthenticate(req({ peer: '203.0.113.9', encrypted: true })) === true);
ck('a private peer speaking plain http is still refused',
   canAuthenticate(req({ peer: '10.1.2.3', proto: 'http' })) === false);

console.log('\n-- local development is unaffected --');
ck('localhost signs in without TLS', canAuthenticate(req({ peer: '127.0.0.1', host: 'localhost' })) === true);
ck('127.0.0.1 as a host signs in', canAuthenticate(req({ peer: '127.0.0.1', host: '127.0.0.1:8080' })) === true);

console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nHTTPS GATE VERIFIED');

process.exit(fails.length ? 1 : 0);
