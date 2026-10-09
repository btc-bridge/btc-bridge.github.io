const CHAINS = [{"slug": "ethereum", "name": "Ethereum", "icon": "eth", "tokens": "WBTC, cbBTC, tBTC", "gas": "ETH"}, {"slug": "base", "name": "Base", "icon": "base", "tokens": "cbBTC, tBTC", "gas": "ETH"}, {"slug": "arbitrum", "name": "Arbitrum", "icon": "arb", "tokens": "WBTC, cbBTC, tBTC", "gas": "ETH"}, {"slug": "solana", "name": "Solana", "icon": "sol", "tokens": "cbBTC, tBTC", "gas": "SOL"}, {"slug": "bnb", "name": "BNB Chain", "icon": "bnb", "tokens": "BTCB", "gas": "BNB"}, {"slug": "optimism", "name": "Optimism", "icon": "optimism", "tokens": "WBTC, tBTC", "gas": "ETH"}, {"slug": "polygon", "name": "Polygon", "icon": "polygon", "tokens": "WBTC", "gas": "POL"}, {"slug": "avalanche", "name": "Avalanche", "icon": "avalanche", "tokens": "BTC.b", "gas": "AVAX"}];
const destination = document.getElementById('destination');
const amount = document.getElementById('amount');
function updateRoute() {
 const chain = CHAINS.find(item => item.slug === destination.value);
 document.getElementById('destination-icon').src = 'assets/tokens/' + chain.icon + '.svg';
 document.getElementById('token-note').textContent = 'BTC formats: ' + chain.tokens;
 document.getElementById('gas-token').textContent = chain.gas;
 document.getElementById('cta-network').textContent = chain.name;
 document.querySelectorAll('.c505360 button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.slug === chain.slug)));
}
function updateAmount() {
 const raw = amount.value.trim();
 let error = '';
 if (!raw) error = 'Enter an amount in BTC.';
 else if (!/^(?:[0-9]+(?:\.[0-9]{0,8})?|\.[0-9]{1,8})$/.test(raw)) error = 'Use a positive BTC amount with up to 8 decimal places.';
 else if (Number(raw) <= 0 || Number(raw) > 21000000) error = 'Enter an amount from 0.00000001 to 21,000,000 BTC.';
 document.getElementById('amount-error').textContent = error;
 amount.setAttribute('aria-invalid', String(Boolean(error)));
 if (error) document.getElementById('sats').textContent = '1 BTC = 100,000,000 sats';
 else {
  const parts = raw.split('.');
  const sats = BigInt(parts[0] || '0') * 100000000n + BigInt((parts[1] || '').padEnd(8, '0'));
  document.getElementById('sats').textContent = sats.toLocaleString('en-US') + (sats === 1n ? ' sat' : ' sats');
 }
 return !error;
}
destination.addEventListener('change', updateRoute);
amount.addEventListener('input', updateAmount);
document.querySelectorAll('.c505360 button').forEach(button => button.addEventListener('click', () => { destination.value = button.dataset.slug; updateRoute(); }));
document.getElementById('go').addEventListener('click', event => {
 if (!updateAmount()) { event.preventDefault(); amount.focus(); return; }
 try { sessionStorage.setItem('btcBridgeTransfer', JSON.stringify({from:'bitcoin', to:destination.value, amount:amount.value.trim()})); } catch {}
});
document.getElementById('confirmations').addEventListener('input', event => {
 const count = Number(event.target.value);
 document.getElementById('minutes').textContent = '~' + count * 10;
 document.getElementById('confirmation-count').textContent = count + (count === 1 ? ' block' : ' blocks');
 document.getElementById('time-formula').textContent = count + (count === 1 ? ' confirmation' : ' confirmations') + ' × 10 minutes per block.';
});
