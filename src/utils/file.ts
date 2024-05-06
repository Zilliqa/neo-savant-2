export const readFileAsText = async (
  inputFile: File
): Promise<string | ArrayBuffer> => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new Error('Problem parsing input file.'));
    };

    temporaryFileReader.onload = () => {
      if (temporaryFileReader.result !== null) {
        resolve(temporaryFileReader.result);
      }
    };
    temporaryFileReader.readAsText(inputFile);
  });
};
