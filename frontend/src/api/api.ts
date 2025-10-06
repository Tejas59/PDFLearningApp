
const sentPdfFile = async (file: File) => {
    const response = await fetch('/api/upload', {
        method: 'POST',
        body: file,
    });
}