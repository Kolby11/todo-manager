import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { urlToFile } from './urlToFile';


const MOCK_IMAGE_URL = 'https://example.com/images/photo.png';
const MOCK_NO_EXTENSION_URL = 'https://example.com/data/blob_id';
const MOCK_FILENAME = 'custom_name.jpeg';
const MOCK_BLOB_TYPE = 'image/png';
const MOCK_FALLBACK_FILENAME = 'image.jpg';


describe('urlToFile utility', () => {
    const mockFetch = vi.fn();

    const createMockResponse = (
        status: number,
        ok: boolean,
        data: string,
        type: string = MOCK_BLOB_TYPE
    ): { status: number, ok: boolean, statusText: string, blob: ReturnType<typeof vi.fn> } => ({
        status,
        ok,
        statusText: ok ? 'OK' : 'Not Found',
        blob: vi.fn().mockResolvedValue(new Blob([data], { type })),
    });

    beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('should successfully convert a URL to a File object using filename from URL', async () => {
        const mockResponse = createMockResponse(200, true, 'image data');
        mockFetch.mockResolvedValueOnce(mockResponse);

        const result = await urlToFile(MOCK_IMAGE_URL);

        if (result === null) {
            throw new Error('Expected result to be a File, but got null');
        }

        expect(mockFetch).toHaveBeenCalledWith(MOCK_IMAGE_URL);
        expect(result).toBeInstanceOf(File);
        expect(result.name).toBe('photo.png');
        expect(result.type).toBe(MOCK_BLOB_TYPE);
        expect(await result.text()).toBe('image data');
    });

    it('should successfully convert a URL to a File object using the provided filename', async () => {
        const mockResponse = createMockResponse(200, true, 'image data');
        mockFetch.mockResolvedValueOnce(mockResponse);

        const result = await urlToFile(MOCK_IMAGE_URL, MOCK_FILENAME);

        if (result === null) {
            throw new Error('Expected result to be a File, but got null');
        }

        expect(mockFetch).toHaveBeenCalledWith(MOCK_IMAGE_URL);
        expect(result).toBeInstanceOf(File);
        // Should prioritize filename from URL if it has an extension
        expect(result.name).toBe('photo.png');
        expect(result.type).toBe(MOCK_BLOB_TYPE);
    });

    it('should use the provided filename if the URL filename has no extension', async () => {
        const mockResponse = createMockResponse(200, true, 'image data');
        mockFetch.mockResolvedValueOnce(mockResponse);

        const result = await urlToFile(MOCK_NO_EXTENSION_URL, MOCK_FILENAME);

        if (result === null) {
            throw new Error('Expected result to be a File, but got null');
        }

        expect(mockFetch).toHaveBeenCalledWith(MOCK_NO_EXTENSION_URL);
        expect(result).toBeInstanceOf(File);
        expect(result.name).toBe(MOCK_FILENAME);
        expect(result.type).toBe(MOCK_BLOB_TYPE);
    });

    it('should use the default filename if the URL filename has no extension and no filename is provided', async () => {
        const mockResponse = createMockResponse(200, true, 'image data');
        mockFetch.mockResolvedValueOnce(mockResponse);

        const result = await urlToFile(MOCK_NO_EXTENSION_URL);

        if (result === null) {
            throw new Error('Expected result to be a File, but got null');
        }

        expect(mockFetch).toHaveBeenCalledWith(MOCK_NO_EXTENSION_URL);
        expect(result).toBeInstanceOf(File);
        expect(result.name).toBe(MOCK_FALLBACK_FILENAME);
        expect(result.type).toBe(MOCK_BLOB_TYPE);
    });

    it('should return null on a non-200 fetch response', async () => {
        const mockResponse = createMockResponse(404, false, 'Error');
        mockFetch.mockResolvedValueOnce(mockResponse);

        const result = await urlToFile(MOCK_IMAGE_URL);

        expect(mockFetch).toHaveBeenCalledWith(MOCK_IMAGE_URL);
        expect(console.error).toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('should return null on a fetch error (e.g., network issue)', async () => {
        const mockError = new TypeError('Failed to fetch');
        mockFetch.mockRejectedValueOnce(mockError);

        const result = await urlToFile(MOCK_IMAGE_URL);

        expect(mockFetch).toHaveBeenCalledWith(MOCK_IMAGE_URL);
        expect(console.error).toHaveBeenCalledWith(
            'Error converting URL to File:',
            mockError
        );
        expect(result).toBeNull();
    });
});