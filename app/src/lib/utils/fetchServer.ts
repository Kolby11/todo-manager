import { PUBLIC_SERVER } from '$env/static/public';

function getEndpointPath(path: string): string {
	if (!path.startsWith('/')) {
		path = '/' + path;
	}
	return `${PUBLIC_SERVER}${path}`;
}

export function fetchServer(path: string, options?: RequestInit): Promise<Response> {
	const defaultOptions: RequestInit = {
		credentials: 'include'
	};
	return fetch(getEndpointPath(path), { ...defaultOptions, ...options });
}
