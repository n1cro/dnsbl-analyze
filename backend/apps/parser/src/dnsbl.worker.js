/* eslint-disable @typescript-eslint/no-require-imports */
const { parentPort } = require('worker_threads');
const dns = require('dns/promises');

let counter = 0;

const NOT_FOUND_ERR = 'ENOTFOUND';

/**
 * Process DNSBL-query.
 * @param {string} ip - IP-address.
 * @param {string} dnsbl - DNSBL server.
 * @param {dns.Resolver} resolver - DNS resolver.
 * @returns {Promise<{dnsbl: string, ip: string, isBlocked: boolean}>} - Result of query.
 */
async function queryDnsbl(ip, dnsbl, resolver) {
	const reversedIp = ip.split('.').reverse().join('.');
	const query = `${reversedIp}.${dnsbl}`;

	const response = {
		dnsbl,
		ip,
		isBlocked: false
	};

	try {
		const addresses = await resolver.resolve4(query);
		if (!addresses[0]?.startsWith('127.0.0.')) {
			console.log(query, addresses, 'ERROR');
		} else {
			response.isBlocked = true;
		}
	} catch (err) {
		if (err.code !== NOT_FOUND_ERR) {
			console.log(err.code, query, 'catch');
			counter += 1;
		}
	}

	return response;
}

/**
 * Resolve ip-chunks.
 * @param {string} dnsbl - DNSBL server.
 * @param {string[]} chunks - IP chunks.
 * @param {dns.Resolver[]} resolvers - DNS resolvers.
 * @returns {Promise<{dnsbl: string, ip: string, isBlocked: boolean}>} - Result of query.
 */
async function resolveChunks(dnsbl, chunks, resolvers) {
	let resolverIndex = 0;
	const result = [];

	for (const chunk of chunks) {
		const resolver = resolvers[resolverIndex];
		resolverIndex = (resolverIndex + 1) % resolvers.length;

		const promises = chunk.map((ip) => queryDnsbl(ip, dnsbl, resolver));

		const resolved = await Promise.all(promises);
		result.push(...resolved);
	}

	return result;
}

async function processBlacklist(data) {
	const { workerId, ips, blocklists, resolvers } = data;

	counter = 0;
	const instancesRes = resolvers.map((ip) => {
		const resolver = new dns.Resolver();
		resolver.setServers([ip]);

		return resolver;
	});

	const chunkSize = resolvers.length * 10;
	const numChunks = Math.ceil(ips.length / chunkSize);

	const chunks = Array.from({ length: numChunks }, (_, i) =>
		ips.slice(i * chunkSize, (i + 1) * chunkSize)
	);

	const promises = blocklists.flatMap((dnsbl) =>
		resolveChunks(dnsbl, chunks, instancesRes)
	);
	const results = await Promise.all(promises);

	const blocklistsResult = {};

	for (const { isBlocked, dnsbl, ip } of results.flat(1)) {
		if (!blocklistsResult[dnsbl]) {
			blocklistsResult[dnsbl] = [];
		}

		if (isBlocked) blocklistsResult[dnsbl].push(ip);
	}

	parentPort.postMessage({
		workerId,
		result: blocklistsResult,
		errors: counter
	});
}

parentPort.on('message', async (data) => {
	try {
		await processBlacklist(data);
	} catch (err) {
		console.error(`Error in worker ${data.workerId}:`, err);
		parentPort.postMessage({ error: err.message });
	}
});
