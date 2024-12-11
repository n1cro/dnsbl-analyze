export const DNSBL_JOB = 'dnsbl_parse';
export const DNSBL_QUEUE = process.env.DNSBL_QUEUE || 'dnsbl-queue'; // TODO: not worked dynamicly

export const DNSBL_SERVERS = [
	'zen.spamhaus.org',
	'pbl.spamhaus.org',
	'sbl.spamhaus.org',
	'xbl.spamhaus.org',
	'all.spamrats.com',
	'b.barracudacentral.org',
	'dnsbl.justspam.org',
	'all.s5h.net',
	'dnsbl.dronebl.org',
	'bl.mailspike.net'
];
