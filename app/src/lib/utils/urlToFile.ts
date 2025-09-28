
export async function urlToFile(url: string, filename: string = 'image.jpg'): Promise<File | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        
        const urlParts = url.split('/');
        const urlFilename = urlParts[urlParts.length - 1];
        const finalFilename = urlFilename.includes('.') ? urlFilename : filename;
        
        return new File([blob], finalFilename, { type: blob.type });
    } catch (error) {
        console.error('Error converting URL to File:', error);
        return null;
    }
}