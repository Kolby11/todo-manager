import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchServer } from './fetchServer';


const MOCK_SERVER_URL = "https://example.com"

vi.mock('$env/static/public', () => ({
    PUBLIC_SERVER: "https://example.com"
}));

describe('fetchServer utility', () => {
    const mockFetch = vi.fn();

    beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it('should prepend a slash if the path starts without one', async () => {
        mockFetch.mockResolvedValueOnce(new Response('ok'));

        await fetchServer('api/test');
        expect(mockFetch).toHaveBeenCalledWith(
        `${MOCK_SERVER_URL}/api/test`,
        expect.objectContaining({ credentials: 'include' })
        );
    });

    it('should not double-prepend slashes if path already starts with "/"', async () => {
        mockFetch.mockResolvedValueOnce(new Response('ok'));

        await fetchServer('/api/test');
        expect(mockFetch).toHaveBeenCalledWith(
        `${MOCK_SERVER_URL}/api/test`,
        expect.objectContaining({ credentials: 'include' })
        );
    });

    it('should merge default options with provided options', async () => {
        mockFetch.mockResolvedValueOnce(new Response('ok'));

        await fetchServer('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
        });

        expect(mockFetch).toHaveBeenCalledWith(
        `${MOCK_SERVER_URL}/api/test`,
        expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        );
    });

    it('should return the fetch response', async () => {
        const response = new Response('data', { status: 200 });
        mockFetch.mockResolvedValueOnce(response);

        const result = await fetchServer('/api/test');

        expect(result).toBe(response);
        expect(await result.text()).toBe('data');
    });
});
